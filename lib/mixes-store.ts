import "server-only";
import { unstable_cache } from "next/cache";
import { XMLParser } from "fast-xml-parser";
import { formatClock, type Mix } from "./mixes";

// The Transcend mix library is sourced live from SoundCloud's public podcast
// RSS feed — new uploads appear with no code change or redeploy. fetch isn't
// cached by default in Next 16, so unstable_cache (tagged, 5m revalidate) is
// the single caching layer, matching lib/shows-store.ts. The feed's <ttl>60</ttl>
// is advisory only — SoundCloud serves new episodes within minutes of release,
// and 5m keeps release-day pickup on par with podcast directories.

const FEED_URL =
  "https://feeds.soundcloud.com/users/soundcloud:users:211674230/sounds.rss";
const TAG = "mixes";

/**
 * The blank line that separates the intro paragraph from the tracklist. Every
 * Transcend description follows "intro sentence → blank line → one track per
 * line", so this is more robust than matching a specific lead-in phrase (which
 * varies: "featuring the following tracks:", "and the following tracks:",
 * "including the following tracks:", …).
 */
const PARAGRAPH_BREAK = /\n\s*\n/;
/**
 * Leading list markers on a track line — bullets, dashes, or "1." / "1)"
 * numbering. Stripped so the on-site numbered tracklist stays clean even if the
 * SoundCloud description prefixes each line (e.g. "• " to survive podcast apps
 * that collapse newlines).
 */
const LEADING_MARKER = /^\s*(?:[•·▪‣◦*–—]|-|\d+[.)])\s+/u;
/**
 * The trailing "…the following tracks:" lead-in on the intro paragraph, dropped
 * so the on-site intro reads cleanly above the tracklist heading. Tolerates the
 * wording variants and stray punctuation (one source has "tracks.:").
 */
const INTRO_TRACKS_TAIL =
  /\s*(?:[,–—-]\s*)?(?:featuring|feat\.?|including|with|and)?\s*(?:but not limited to\s*)?(?:some of\s*)?(?:the following\s*)?tracks?(?:\s+below)?\s*[.:]+\s*$/i;

function toSeconds(hms: string): number {
  const parts = hms.split(":").map((n) => parseInt(n, 10));
  if (parts.some(Number.isNaN)) return 0;
  return parts.reduce((total, n) => total * 60 + n, 0);
}

/** Track id from a guid like "tag:soundcloud,2010:tracks/2350544747". */
function idFromGuid(guid: unknown): string {
  const text =
    typeof guid === "string"
      ? guid
      : String((guid as { "#text"?: string })?.["#text"] ?? "");
  return text.split("/").pop() ?? "";
}

/** Last path segment of the permalink, e.g. ".../eddie-barretta/currents". */
function slugFromLink(link: string): string {
  try {
    return new URL(link).pathname.split("/").filter(Boolean).pop() ?? "";
  } catch {
    return "";
  }
}

/** Split a description blob into the lead-in prose and the track lines. */
function splitDescription(raw: string): { intro: string; tracks: string[] } {
  const description = String(raw ?? "").trim();
  const match = PARAGRAPH_BREAK.exec(description);
  // No blank line → single paragraph, no tracklist (e.g. short live recordings).
  if (!match) return { intro: description, tracks: [] };

  const intro = description
    .slice(0, match.index)
    .replace(INTRO_TRACKS_TAIL, "")
    .trim();
  const tracks = description
    .slice(match.index + match[0].length)
    .split(/\r?\n/)
    // Keep [@handle] tags — the Tracklist component turns them into profile
    // links. Only strip any leading bullet/number the description may carry.
    .map((line) => line.replace(LEADING_MARKER, "").trim())
    .filter(Boolean);
  return { intro, tracks };
}

/**
 * Parse the Transcend RSS XML into typed mixes, newest first. Any item missing
 * a stream, artwork, or link is dropped rather than rendered broken.
 */
export function parseMixesFeed(xml: string): Mix[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    trimValues: true,
  });

  const doc = parser.parse(xml);
  const channel = doc?.rss?.channel;
  if (!channel) return [];

  const rawItems = Array.isArray(channel.item)
    ? channel.item
    : channel.item
      ? [channel.item]
      : [];

  const mixes: Mix[] = [];
  for (const item of rawItems) {
    const streamUrl: string = item?.enclosure?.["@_url"] ?? "";
    const artwork: string = item?.["itunes:image"]?.["@_href"] ?? "";
    const link: string = item?.link ?? "";
    if (!streamUrl || !artwork || !link) continue;

    const durationSeconds = toSeconds(String(item["itunes:duration"] ?? "0"));
    const { intro, tracks } = splitDescription(
      item.description ?? item["itunes:summary"] ?? "",
    );
    const id = idFromGuid(item.guid) || slugFromLink(link);

    mixes.push({
      id,
      slug: slugFromLink(link),
      title: String(item.title ?? "Untitled"),
      date: item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date(0).toISOString(),
      durationSeconds,
      durationLabel: formatClock(durationSeconds),
      artwork,
      streamUrl,
      permalink: link,
      intro,
      tracks,
    });
  }

  return mixes.sort((a, b) => b.date.localeCompare(a.date));
}

async function fetchMixes(): Promise<Mix[]> {
  try {
    const res = await fetch(FEED_URL, {
      // unstable_cache owns caching; keep the raw fetch uncached to avoid a
      // confusing second cache layer.
      cache: "no-store",
      headers: {
        "user-agent": "eddiebarretta.com (+https://eddiebarretta.com)",
      },
    });
    if (!res.ok) return [];
    return parseMixesFeed(await res.text());
  } catch {
    // Never let a feed hiccup take down the page — the section/pages degrade
    // gracefully to empty.
    return [];
  }
}

const getCachedMixes = unstable_cache(fetchMixes, ["mixes:all"], {
  tags: [TAG],
  revalidate: 300,
});

/** All Transcend mixes, newest first. */
export async function getMixes(): Promise<Mix[]> {
  return getCachedMixes();
}

/** A single mix by slug, or null if it isn't in the feed. */
export async function getMix(slug: string): Promise<Mix | null> {
  const mixes = await getCachedMixes();
  return mixes.find((m) => m.slug === slug) ?? null;
}
