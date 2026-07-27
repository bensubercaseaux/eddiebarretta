// Types + pure display helpers for the Transcend mix library. This module has
// NO dependencies, so Client Components (the player, cards) can import from it
// freely. All RSS parsing + fetching lives in the server-only `mixes-store.ts`.

export type Mix = {
  /** SoundCloud track id, e.g. "2350544747". Stable across title edits. */
  id: string;
  /** URL slug from the SoundCloud permalink, e.g. "currents". Our route key. */
  slug: string;
  title: string;
  /** ISO 8601, derived from pubDate. */
  date: string;
  /** Total seconds. */
  durationSeconds: number;
  /** Human duration, e.g. "54:20" or "1:06:50". */
  durationLabel: string;
  /** Full-resolution square artwork (SoundCloud CDN). */
  artwork: string;
  /** Direct, seekable MP3 (RSS enclosure) — plays in a native media element. */
  streamUrl: string;
  /** Canonical SoundCloud page for this mix. */
  permalink: string;
  /** Description text before the tracklist ("A deep, melodic journey…"). */
  intro: string;
  /** One entry per track, handles stripped. Empty when none were listed. */
  tracks: string[];
};

/** Seconds → "54:20" / "1:06:50". Used for durations and the live play timer. */
export function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}

/** "Jul 14, 2026" — for cards and headings. */
export function formatMixDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** A run of a track line: plain text, or an artist name linked to a profile. */
export type TrackPart = { text: string; href?: string };

/** SoundCloud @handle tags on a track line, e.g. " [@justin3lau]". */
const HANDLE_RE = /\s*\[@([^\]]+)\]/g;

function normalizeForMatch(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Index where the artist name begins inside the text preceding a handle. Artists
 * after the first are comma/paren-delimited (reliable); the first artist runs
 * straight out of the title with no delimiter, so we recover its name by matching
 * trailing words against the handle (e.g. "Casablanca Anton Ishutin" +
 * "antonishutin" → "Anton Ishutin").
 */
function artistNameStart(chunk: string, handle: string): number {
  const delim = Math.max(
    chunk.lastIndexOf(","),
    chunk.lastIndexOf(")"),
    chunk.lastIndexOf("]"),
  );
  if (delim >= 0) {
    let i = delim + 1;
    while (i < chunk.length && chunk[i] === " ") i++;
    return i;
  }

  const trimmed = chunk.replace(/\s+$/, "");
  const words = trimmed.split(/\s+/);
  const nh = normalizeForMatch(handle);
  let best = -1;
  for (let k = 1; k <= words.length; k++) {
    const suffix = normalizeForMatch(words.slice(words.length - k).join(" "));
    if (suffix.length >= 2 && nh.includes(suffix)) best = words.length - k;
  }
  if (best >= 0) {
    const namePart = words.slice(best).join(" ");
    const idx = chunk.lastIndexOf(namePart);
    if (idx >= 0) return idx;
  }

  const lastSpace = trimmed.lastIndexOf(" ");
  return lastSpace >= 0 ? lastSpace + 1 : 0;
}

/**
 * Split a track line into display parts, linking each artist that has a
 * SoundCloud @handle to their profile. Title text and handle-less artists stay
 * plain. Pure + dependency-free so the (server-safe) Tracklist can call it.
 */
export function parseTrackParts(line: string): TrackPart[] {
  const parts: TrackPart[] = [];
  let cursor = 0;
  for (const m of line.matchAll(HANDLE_RE)) {
    const handle = m[1];
    const start = m.index ?? 0;
    const chunk = line.slice(cursor, start);
    const nameStart = artistNameStart(chunk, handle);
    const before = chunk.slice(0, nameStart);
    const name = chunk.slice(nameStart).trim();
    if (before) parts.push({ text: before });
    if (name) parts.push({ text: name, href: `https://soundcloud.com/${handle}` });
    else if (chunk.slice(nameStart)) parts.push({ text: chunk.slice(nameStart) });
    cursor = start + m[0].length;
  }
  const rest = line.slice(cursor);
  if (rest) parts.push({ text: rest });
  return parts;
}
