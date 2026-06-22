import "server-only";

// We use only SoundCloud's PUBLIC, crawler-facing surfaces — no official API
// key (registration is closed) and NOT the unofficial api-v2. Specifically:
//   1. oEmbed         — validate a known handle (200 + author_name, or 404)
//   2. profile page   — read the public `soundcloud:follower_count` meta tag
//   3. people search  — the server-rendered <h2><a href="/handle">Name</a></h2>
// All three are public HTML/JSON meant for crawlers. They can change shape; when
// they do, resolution degrades to "enter manually", never to a wrong link.

const OEMBED = "https://soundcloud.com/oembed";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const COMBINING = /[̀-ͯ]/g;

// Latin letters NFD can't decompose (the diacritic is fused into the glyph), so
// they'd otherwise be stripped — e.g. "ZENØN" → "zenn" instead of "zenon".
const FOLD: Record<string, string> = {
  ø: "o", æ: "ae", œ: "oe", ł: "l", đ: "d", ð: "d", þ: "th", ß: "ss",
  ı: "i", ŋ: "n", ħ: "h", ŧ: "t", ĸ: "k",
};

export const DEFAULT_MIN_FOLLOWERS = 500;

export type HandleLookup =
  | { status: "valid"; handle: string; name: string; followers: number | null }
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
  return s
    .normalize("NFD")
    .replace(COMBINING, "")
    .toLowerCase()
    .replace(/[øæœłđðþßıŋħŧĸ]/g, (c) => FOLD[c] ?? c)
    .replace(/[^a-z0-9]/g, "");
}

/** ASCII-fold a name for the search query — SoundCloud matches "ZENON", not "ZENØN". */
function searchQuery(s: string): string {
  return s
    .normalize("NFD")
    .replace(COMBINING, "")
    .replace(/[øæœłđðþßıŋħŧĸ]/gi, (c) => FOLD[c.toLowerCase()] ?? c)
    .trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));
}

/** Validate a specific handle via oEmbed (existence + real display name). */
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
    return { status: "valid", handle, name, followers: null };
  } catch {
    return { status: "notfound", handle };
  }
}

/** Read the public follower count from a profile page's meta tag. */
export async function fetchFollowers(handle: string): Promise<number | null> {
  const h = normalizeHandle(handle);
  if (!h) return null;
  try {
    const res = await fetch(`https://soundcloud.com/${h}`, {
      cache: "no-store",
      headers: { "user-agent": UA },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m =
      html.match(/soundcloud:follower_count" content="(\d+)"/) ||
      html.match(/"followers_count":(\d+)/);
    return m ? parseInt(m[1], 10) : null;
  } catch {
    return null;
  }
}

/** Validate a handle AND attach its follower count (for manual entries). */
export async function validateHandle(rawHandle: string): Promise<HandleLookup> {
  const r = await lookupHandle(rawHandle);
  if (r.status !== "valid") return r;
  return { ...r, followers: await fetchFollowers(r.handle) };
}

/** Search SoundCloud people; return server-rendered results in relevance order. */
export async function searchPeople(
  name: string,
): Promise<{ handle: string; name: string }[]> {
  try {
    const res = await fetch(
      `https://soundcloud.com/search/people?q=${encodeURIComponent(name)}`,
      { cache: "no-store", headers: { "user-agent": UA } },
    );
    if (!res.ok) return [];
    const html = await res.text();
    const re = /<h2><a href="\/([^"/]+)">([^<]+)<\/a><\/h2>/g;
    const out: { handle: string; name: string }[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) && out.length < 10) {
      out.push({ handle: m[1].toLowerCase(), name: decodeEntities(m[2]).trim() });
    }
    return out;
  } catch {
    return [];
  }
}

/**
 * Resolve an artist name to a handle via real search, then disambiguate by
 * follower count. Only same-name results are considered; the most-followed one
 * wins, and it must clear minFollowers — otherwise we hand it back for manual
 * entry rather than guess.
 */
export async function resolveArtist(
  name: string,
  minFollowers: number = DEFAULT_MIN_FOLLOWERS,
): Promise<HandleLookup> {
  const target = normalizeName(name);
  if (!target) return { status: "notfound", handle: "" };

  const results = await searchPeople(searchQuery(name));
  const matches = results.filter((r) => normalizeName(r.name) === target).slice(0, 4);
  if (!matches.length) return { status: "notfound", handle: "" };

  const enriched = await Promise.all(
    matches.map(async (c) => ({ ...c, followers: (await fetchFollowers(c.handle)) ?? 0 })),
  );
  enriched.sort((a, b) => b.followers - a.followers);
  const best = enriched[0];

  if (best && best.followers >= minFollowers) {
    return { status: "valid", handle: best.handle, name: best.name, followers: best.followers };
  }
  return { status: "notfound", handle: "" };
}
