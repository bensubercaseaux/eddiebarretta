import "server-only";
import { unstable_cache } from "next/cache";
import { XMLParser } from "fast-xml-parser";

// The Watch shelf is sourced from a public YouTube playlist RSS feed — curation
// (add/remove/reorder) happens in the YouTube app, no code change or redeploy.
// The feed carries no orientation info, so each video is probed for the
// Shorts-style vertical thumbnail (oar2.jpg): YouTube serves it only for 9:16
// videos, so landscape uploads in the playlist are filtered out here and never
// reach the vertical shelf. Caching mirrors lib/mixes-store.ts — fetch isn't
// cached by default in Next 16, so unstable_cache (tagged, 5m revalidate) is
// the single caching layer, and the probes run inside it.

// "Site — Watch" playlist, overridable per-environment. Note: playlist RSS
// returns at most the first 15 entries, which bounds the shelf length.
const PLAYLIST_ID =
  process.env.YOUTUBE_WATCH_PLAYLIST_ID || "PLjisbdyvOZPBAy5NWNcvdolDuqBqu2sWX";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;
const TAG = "videos";

export type WatchVideo = {
  /** YouTube video id, e.g. "7UZfSiFc084". */
  id: string;
  title: string;
};

/** Parse the playlist Atom feed, preserving playlist order for curation. */
export function parseVideosFeed(xml: string): WatchVideo[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    trimValues: true,
  });

  const doc = parser.parse(xml);
  const raw = doc?.feed?.entry;
  const entries = Array.isArray(raw) ? raw : raw ? [raw] : [];

  const videos: WatchVideo[] = [];
  for (const entry of entries) {
    const id = String(entry?.["yt:videoId"] ?? "");
    if (!id) continue;
    videos.push({ id, title: String(entry.title ?? "") });
  }
  return videos;
}

/**
 * True when YouTube has a vertical poster for the video. On probe failure the
 * video is dropped rather than rendered with a broken 9:16 poster.
 */
async function isVertical(id: string): Promise<boolean> {
  try {
    const res = await fetch(`https://i.ytimg.com/vi/${id}/oar2.jpg`, {
      method: "HEAD",
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function fetchWatchVideos(): Promise<WatchVideo[]> {
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
    const videos = parseVideosFeed(await res.text());
    const vertical = await Promise.all(videos.map((v) => isVertical(v.id)));
    return videos.filter((_, i) => vertical[i]);
  } catch {
    // Never let a feed hiccup take down the page — the Watch section hides
    // itself when there's nothing to show.
    return [];
  }
}

// 5m matches lib/mixes-store.ts. Playlist curation happens in the YouTube app
// with no redeploy, so the TTL is the only thing gating how fast an edit shows
// up — an hour was long enough to look broken. The 15 vertical probes re-run on
// each revalidation, which is cheap at this playlist size.
const getCachedWatchVideos = unstable_cache(fetchWatchVideos, ["videos:watch"], {
  tags: [TAG],
  revalidate: 300,
});

/** Vertical clips from the Watch playlist, in playlist order. */
export async function getWatchVideos(): Promise<WatchVideo[]> {
  return getCachedWatchVideos();
}
