// Self-hosted, normalized copy of the SoundCloud "Transcend" podcast feed.
//
// We rewrite episode notes into HTML — one <p>, <br/> between lines, <br/><br/>
// between blocks — in both <description> and <content:encoded>,
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
// The apex is canonical — www 308-redirects to it, so the self link and
// new-feed-url must be the apex or every crawler eats a redirect hop. These
// were on www until 2026-07-28, left over from before the SEO work flipped the
// canonical host; Apple was registered at the www URL and <itunes:new-feed-url>
// below is what migrates it across. See the note on FEED MOVE at the bottom.
const SELF_URL = "https://eddiebarretta.com/podcast.rss";
// Show cover art — 1400×1400 JPG (<500KB) served from /public. Apple only
// re-downloads artwork when this URL changes, so bump the -vN suffix (rename
// the file to match) whenever the art itself is replaced. (The www → apex swap
// counts as a change, so Apple re-fetches once — same image, harmless.)
const PODCAST_IMAGE = "https://eddiebarretta.com/transcend-v2.jpg";
const SITE = "https://eddiebarretta.com";
// Stable Podcasting 2.0 identity for the show. UUIDv5 of the feed URL
// ("eddiebarretta.com/podcast.rss", protocol stripped) under the Podcast Index
// namespace ead4c236-bf58-58c6-a2c6-a6b28d128cb6. Assign once — NEVER change it.
const PODCAST_GUID = "624c3722-aa94-5e43-95ce-de389eff7957";

// The source feed's <ttl>60</ttl> is advisory only — SoundCloud serves new
// episodes within minutes of release. 5m keeps Apple/Amazon/YouTube pickup
// fast on release day (directories poll this feed, not SoundCloud's).
export const revalidate = 300;

/** Leading bullet/dash/number a description line may carry (we re-add real HTML). */
const LEADING_MARKER = /^\s*(?:[•·▪‣◦*–—]|-|\d+[.)])\s+/u;
/** SoundCloud @handle tags — meaningless in podcast apps, so drop them here. */
const HANDLE_TAG = /\s*\[@[^\]]+\]/g;

/**
 * Render a description into HTML that renders line breaks across every podcast
 * app. Everything goes into a single <p> with lines joined by <br /> and a
 * <br /><br /> (blank line) between blocks — so the intro reads "…the following
 * tracks:", blank line, then one track per line. Two renderer quirks force this
 * shape: Amazon Music strips <br />s that sit *between* <p> blocks (while
 * honoring the ones inside them), so paragraph gaps and empty spacer paragraphs
 * can't be trusted for the blank line; and apps that convert tags to newlines
 * naively render raw newlines in the markup as visible spaces, so the HTML must
 * contain no literal newlines at all. The input is already XML-entity-encoded
 * (&amp; etc.), valid HTML, so it drops in as-is; we only strip our own bullets
 * and @handles.
 */
function descriptionToHtml(text: string): string {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .split("\n")
        .map((l) => l.replace(LEADING_MARKER, "").replace(HANDLE_TAG, "").trim())
        .filter(Boolean)
        .join("<br />"),
    )
    .filter(Boolean);

  return `<p>${blocks.join("<br /><br />")}</p>`;
}

/** Wrap HTML in CDATA, guarding the one sequence that can close it early. */
function cdata(html: string): string {
  return `<![CDATA[${html.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

/** Newest <pubDate> anywhere in the feed, or null if it carries none. */
function newestPubDate(xml: string): Date | null {
  let newest: Date | null = null;
  for (const m of xml.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)) {
    const d = new Date(m[1]);
    if (!Number.isNaN(d.getTime()) && (!newest || d > newest)) newest = d;
  }
  return newest;
}

function rewriteFeed(xml: string, newest: Date | null): string {
  // Declare the content + podcast namespaces (for <content:encoded> and
  // <podcast:guid>).
  let out = xml.replace(/<rss\b([^>]*)>/, (_m, attrs: string) => {
    let a = attrs;
    if (!a.includes("xmlns:content"))
      a += ` xmlns:content="http://purl.org/rss/1.0/modules/content/"`;
    if (!a.includes("xmlns:podcast"))
      a += ` xmlns:podcast="https://podcastindex.org/namespace/1.0"`;
    return `<rss${a}>`;
  });

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

  // Channel-level: stable identity, mark the show episodic, declare canonical.
  //
  // FEED MOVE (started 2026-07-28): <itunes:new-feed-url> is Apple's mechanism
  // for relocating a show, not a permanent tag. Apple was registered at the www
  // URL; pointing this at the apex is what migrates it. Once Apple Podcasts
  // Connect shows the apex as the feed URL (give it ~2 weeks), DELETE the
  // new-feed-url line below — leaving it forever is what turned the old www
  // value into a directive pointing at a host that only 308s back here.
  if (!out.includes("<itunes:type>")) {
    out = out.replace(
      "</image>",
      `</image>\n        <podcast:guid>${PODCAST_GUID}</podcast:guid>\n        <itunes:type>episodic</itunes:type>\n        <itunes:new-feed-url>${SELF_URL}</itunes:new-feed-url>`,
    );
  }

  // SoundCloud's channel <lastBuildDate> and <pubDate> lag scheduled releases
  // by days — on 2026-07-28 they still read "25 Jul" with that day's episode
  // already in the feed. That tells a directory the show is unchanged while a
  // brand-new episode sits right there, which is how a release goes live on one
  // platform and not another. We already override the HTTP Last-Modified for
  // this reason; the in-feed dates need the same treatment, since that's what a
  // directory reads once it does parse the body. Only the channel header is
  // rewritten — item pubDates are real release times and must stay untouched.
  if (newest) {
    const stamp = newest.toUTCString();
    const firstItem = out.indexOf("<item>");
    const head = firstItem === -1 ? out : out.slice(0, firstItem);
    const tail = firstItem === -1 ? "" : out.slice(firstItem);
    out =
      head
        .replace(
          /<lastBuildDate>[^<]*<\/lastBuildDate>/,
          `<lastBuildDate>${stamp}</lastBuildDate>`,
        )
        .replace(/<pubDate>[^<]*<\/pubDate>/, `<pubDate>${stamp}</pubDate>`) +
      tail;
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
  const newest = newestPubDate(src);
  const out = rewriteFeed(src, newest);

  const headers: Record<string, string> = {
    "content-type": "application/rss+xml; charset=utf-8",
    "cache-control": "public, s-maxage=300, stale-while-revalidate=86400",
    // Help podcast apps check for updates efficiently.
    etag: `"${createHash("md5").update(out).digest("hex")}"`,
  };
  // Same reason the in-feed dates get rewritten above: a stale Last-Modified
  // tells crawlers nothing changed. Use the newest item pubDate.
  if (newest) headers["last-modified"] = newest.toUTCString();

  return new Response(out, { headers });
}
