// Self-hosted, normalized copy of the SoundCloud "Transcend" podcast feed.
//
// ONLY the <description> text is rewritten — into real HTML (<p> + <ul><li>)
// wrapped in CDATA — because Apple/Amazon/YouTube render episode notes as HTML
// and collapse/strip plain-text newlines and bullets. Everything else passes
// through untouched, including each <enclosure> (SoundCloud's own stream URL),
// so audio is still served AND counted by SoundCloud exactly as before.
//
// Point Apple Podcasts Connect / Amazon / YouTube at:
//   https://eddiebarretta.com/podcast.rss
// GUIDs are preserved, so existing episodes map 1:1 (no duplicates).

const FEED_URL =
  "https://feeds.soundcloud.com/users/soundcloud:users:211674230/sounds.rss";
const SELF_URL = "https://eddiebarretta.com/podcast.rss";

// The source feed's ttl is 60m; match it.
export const revalidate = 3600;

/** Leading bullet/dash/number a description line may carry (we re-add real HTML). */
const LEADING_MARKER = /^\s*(?:[•·▪‣◦*–—]|-|\d+[.)])\s+/u;
/** SoundCloud @handle tags — meaningless in podcast apps, so drop them here. */
const HANDLE_TAG = /\s*\[@[^\]]+\]/g;

/**
 * Render a description into Apple-safe HTML. Blocks are split on blank lines;
 * a multi-line block (a tracklist) becomes a <ul>, a single line becomes a <p>.
 * The text is already XML-entity-encoded (&amp; etc.), which is valid HTML, so
 * it's dropped in as-is — only <br>-unsafe structure is upgraded to <p>/<ul>.
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
      return lines.length >= 2
        ? `<ul>${lines.map((l) => `<li>${l}</li>`).join("")}</ul>`
        : `<p>${lines[0] ?? ""}</p>`;
    })
    .join("");
}

/** Wrap HTML in CDATA, guarding the one sequence that can close it early. */
function cdata(html: string): string {
  return `<![CDATA[${html.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function rewriteFeed(xml: string): string {
  let out = xml.replace(
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

  // Point the self link at our feed, and mark it canonical for Apple.
  out = out.replace(
    /<atom:link href="[^"]*" rel="self"[^>]*\/>/,
    `<atom:link href="${SELF_URL}" rel="self" type="application/rss+xml"/>`,
  );
  if (!out.includes("<itunes:new-feed-url>")) {
    out = out.replace(
      "</image>",
      `</image>\n        <itunes:new-feed-url>${SELF_URL}</itunes:new-feed-url>`,
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
  const xml = rewriteFeed(await res.text());
  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
