import "server-only";

// SoundCloud's official oEmbed endpoint — no auth, no API key, within ToS.
// For a profile URL it returns 200 + author_name when the handle exists, and
// 404 when it doesn't. That's our ground-truth validator.
const OEMBED = "https://soundcloud.com/oembed";

const COMBINING = /[̀-ͯ]/g;

export type HandleLookup =
  | { status: "valid"; handle: string; name: string }
  | { status: "notfound"; handle: string };

/** Accept `@handle`, `handle`, or a full profile URL; return the bare handle. */
export function normalizeHandle(input: string): string {
  let h = input.trim();
  const m = h.match(/soundcloud\.com\/([^/?#\s]+)/i);
  if (m) h = m[1];
  return h.replace(/^@/, "").trim().toLowerCase();
}

/** Strip accents + punctuation for forgiving name comparison. */
function normalizeName(s: string): string {
  return s.normalize("NFD").replace(COMBINING, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Look up one handle against oEmbed. */
export async function lookupHandle(rawHandle: string): Promise<HandleLookup> {
  const handle = normalizeHandle(rawHandle);
  if (!handle) return { status: "notfound", handle };
  const url = `${OEMBED}?format=json&url=${encodeURIComponent(
    `https://soundcloud.com/${handle}`,
  )}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { status: "notfound", handle };
    const data = await res.json();
    const name = typeof data?.author_name === "string" ? data.author_name : "";
    return { status: "valid", handle, name };
  } catch {
    return { status: "notfound", handle };
  }
}

/** Deterministic handle guesses from an artist name (no search, no AI). */
function candidateSlugs(name: string): string[] {
  const base = name
    .normalize("NFD")
    .replace(COMBINING, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, " ");
  if (!base) return [];
  return Array.from(
    new Set([
      base.replace(/\s+/g, ""),
      base.replace(/\s+/g, "-"),
      base.replace(/\s+/g, "_"),
    ]),
  );
}

/**
 * Resolve an artist name to a handle using only deterministic slug guesses,
 * each confirmed against oEmbed AND a display-name match — so we never accept a
 * same-slug stranger. Returns notfound when nothing confidently maps.
 */
export async function autoResolveArtist(name: string): Promise<HandleLookup> {
  const target = normalizeName(name);
  for (const slug of candidateSlugs(name)) {
    const r = await lookupHandle(slug);
    if (r.status === "valid" && normalizeName(r.name) === target) return r;
  }
  return { status: "notfound", handle: "" };
}
