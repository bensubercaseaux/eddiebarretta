// Self-hosted, normalized copy of the SoundCloud "Transcend" podcast feed.
//
// We rewrite episode notes into HTML — matching Podbean's proven format (<p>
// per block, <br/> between lines) — in both <description> and <content:encoded>,
// so Apple/Amazon/YouTube render tracklists with line breaks. Everything else
// passes through untouched — including each <enclosure>
// (SoundCloud's own stream URL), so audio is still served AND counted by
// SoundCloud. Episode <link>s are pointed at our own mix pages, the cover art
// is swapped, and the show is marked episodic.
//
// Point Apple Podcasts Connect / Amazon / YouTube at:
//   https://eddiebarretta.com/podcast.rss
// GUIDs are preserved, so existing episodes map 1:1 (no duplicates).

import { createHash } from "node:crypto";

const FEED_URL =
  "https://feeds.soundcloud.com/users/soundcloud:users:211674230/sounds.rss";
const SELF_URL = "https://eddiebarretta.com/podcast.rss";
// Show cover art — 1400×1400 JPG (<500KB) served from /public.
const PODCAST_IMAGE = "https://eddiebarretta.com/transcend.jpg";
const SITE = "https://eddiebarretta.com";

// The source feed's ttl is 60m; match it.
export const revalidate = 3600;

/** Leading bullet/dash/number a description line may carry (we re-add real HTML). */
const LEADING_MARKER = /^\s*(?:[•·▪‣◦*–—]|-|\d+[.)])\s+/u;
/** SoundCloud @handle tags — meaningless in podcast apps, so drop them here. */
const HANDLE_TAG = /\s*\[@[^\]]+\]/g;

/**
 * Render a description into HTML that renders line breaks across every podcast
 * app. This mirrors exactly what Podbean does (a proven "renders everywhere"
 * host): a <p> per block (blank-line separated), with lines inside a block
 * joined by <br/>. So the intro is its own paragraph and the tracklist is one
 * paragraph with a <br/> between each track — tight, single line breaks. Both
 * <p> and <br> are honored by Apple, Amazon Music, and Spotify. The input is
 * already XML-entity-encoded (&amp; etc.), valid HTML, so it drops in as-is; we
 * only strip our own bullets and @handles.
 */
function descriptionToHtml(text: string): string {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const lines = block
        .split("\n")
        .map((l) => l.replace(LEADING_MARKER, "").replace(HANDLE_TAG, "").trim())
        .filter(Boolean);
      return `<p>${lines.join("<br />\n")}</p>`;
    })
    .join("\n");
}

/** Wrap HTML in CDATA, guarding the one sequence that can close it early. */
function cdata(html: string): string {
  return `<![CDATA[${html.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function rewriteFeed(xml: string): string {
  // Declare the content namespace so <content:encoded> is valid.
  let out = xml.replace(/<rss\b([^>]*)>/, (m, attrs: string) =>
    attrs.includes("xmlns:content")
      ? m
      : `<rss${attrs} xmlns:content="http://purl.org/rss/1.0/modules/content/">`,
  );

  // Descriptions → CDATA HTML (channel + every item).
  out = out.replace(
    /<description>([\s\S]*?)<\/description>/g,
    (_match, inner: string) =>
      `<description>${cdata(descriptionToHtml(inner))}</description>`,
  );

  // itunes:summary must stay plain text (no HTML), but drop the @handle tags
  // and leading bullets so apps that fall back to it don't show the clutter.
  out = out.replace(
    /<itunes:summary>([\s\S]*?)<\/itunes:summary>/g,
    (_match, inner: string) => {
      const clean = inner
        .split(/\r?\n/)
        .map((l) => l.replace(LEADING_MARKER, "").replace(HANDLE_TAG, "").trimEnd())
        .join("\n");
      return `<itunes:summary>${clean}</itunes:summary>`;
    },
  );

  // Per-item: mirror the description into <content:encoded> (the field several
  // apps + validators expect for full show notes) and point the episode <link>
  // at our own mix page (richer than SoundCloud, and it carries subscribe links).
  out = out.replace(/<item>([\s\S]*?)<\/item>/g, (_m, inner: string) => {
    let it = inner.replace(
      /<link>https:\/\/soundcloud\.com\/eddie-barretta\/([^<]+)<\/link>/,
      `<link>${SITE}/mixes/$1</link>`,
    );
    it = it.replace(
      /<description>(<!\[CDATA\[[\s\S]*?\]\]>)<\/description>/,
      (_d, cd: string) =>
        `<description>${cd}</description>\n      <content:encoded>${cd}</content:encoded>`,
    );
    return `<item>${it}</item>`;
  });

  // Swap the channel cover art (first <itunes:image> + the <image> block, both
  // channel-level — per-episode <itunes:image> tags come later and stay).
  out = out.replace(
    /<itunes:image href="[^"]*"\s*\/>/,
    `<itunes:image href="${PODCAST_IMAGE}"/>`,
  );
  out = out.replace(/(<image>\s*<url>)[^<]*(<\/url>)/, `$1${PODCAST_IMAGE}$2`);

  // Point the self link at our feed.
  out = out.replace(
    /<atom:link href="[^"]*" rel="self"[^>]*\/>/,
    `<atom:link href="${SELF_URL}" rel="self" type="application/rss+xml"/>`,
  );

  // Channel-level: mark the show episodic + declare our feed canonical.
  if (!out.includes("<itunes:type>")) {
    out = out.replace(
      "</image>",
      `</image>\n        <itunes:type>episodic</itunes:type>\n        <itunes:new-feed-url>${SELF_URL}</itunes:new-feed-url>`,
    );
  }

  return out;
}

export async function GET() {
  const res = await fetch(FEED_URL, {
    next: { revalidate },
    headers: { "user-agent": "eddiebarretta.com (+https://eddiebarretta.com)" },
  });
  if (!res.ok) {
    return new Response("Upstream feed unavailable", { status: 502 });
  }

  const src = await res.text();
  const out = rewriteFeed(src);

  const headers: Record<string, string> = {
    "content-type": "application/rss+xml; charset=utf-8",
    "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    // Help podcast apps check for updates efficiently.
    etag: `"${createHash("md5").update(out).digest("hex")}"`,
  };
  const built = /<lastBuildDate>([^<]+)<\/lastBuildDate>/.exec(src)?.[1];
  const builtDate = built ? new Date(built) : null;
  if (builtDate && !Number.isNaN(builtDate.getTime())) {
    headers["last-modified"] = builtDate.toUTCString();
  }

  return new Response(out, { headers });
}
