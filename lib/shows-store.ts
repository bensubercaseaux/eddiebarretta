import "server-only";
import { get, put } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";
import { SEED_SHOWS, type Show, type ShowInput } from "./shows";

// Single private JSON file in Vercel Blob is the datastore. Private matters:
// it also holds unlisted (isPublic: false) gigs that must never be reachable
// by URL. Reads go through unstable_cache (tagged) so the public site stays
// static-fast; every write calls revalidateTag to refresh it with no redeploy.

const BLOB_PATH = "shows.json";
const TAG = "shows";

/** True once a Blob store is wired up (Vercel injects BLOB_READ_WRITE_TOKEN). */
export function isStoreConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Read straight from Blob, bypassing every cache. null = unconfigured/empty. */
async function readFromBlob(): Promise<Show[] | null> {
  if (!isStoreConfigured()) return null;
  const res = await get(BLOB_PATH, { access: "private", useCache: false });
  if (!res || res.statusCode !== 200) return null;
  const data = await new Response(res.stream).json();
  return Array.isArray(data) ? (data as Show[]) : [];
}

async function writeToBlob(list: Show[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(list, null, 2), {
    access: "private",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
  revalidateTag(TAG, "max");
}

// Tagged, cached read for the public site. Daily revalidate keeps the
// upcoming/past split honest even with no edits; revalidateTag handles edits.
const getCachedShows = unstable_cache(
  async (): Promise<Show[]> => (await readFromBlob()) ?? SEED_SHOWS,
  ["shows:all"],
  { tags: [TAG], revalidate: 86400 },
);

/** Public site: only shows flagged public. */
export async function getPublicShows(): Promise<Show[]> {
  return (await getCachedShows()).filter((s) => s.isPublic);
}

/** Admin: everything, read fresh (never cached) so edits act on current data. */
export async function getAllShows(): Promise<Show[]> {
  return (await readFromBlob()) ?? SEED_SHOWS;
}

export async function addShow(input: ShowInput): Promise<void> {
  const list = await getAllShows();
  await writeToBlob([...list, { ...input, id: crypto.randomUUID() }]);
}

export async function updateShow(id: string, input: ShowInput): Promise<void> {
  const list = await getAllShows();
  await writeToBlob(list.map((s) => (s.id === id ? { ...input, id } : s)));
}

export async function deleteShow(id: string): Promise<void> {
  const list = await getAllShows();
  await writeToBlob(list.filter((s) => s.id !== id));
}
