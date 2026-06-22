"use server";

import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import {
  validateHandle,
  resolveArtist,
  DEFAULT_MIN_FOLLOWERS,
  type HandleLookup,
} from "@/lib/soundcloud";

async function guard() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

// Bounded concurrency so a long tracklist doesn't fire 150 fetches at once.
async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

/** Validate handles the user typed/pasted (existence + name + follower count). */
export async function validateHandlesAction(
  handles: string[],
): Promise<HandleLookup[]> {
  await guard();
  return mapLimit(handles, 6, (h) => validateHandle(h));
}

/** Auto-resolve artist names via search, ranked by followers (>= minFollowers). */
export async function autoResolveAction(
  names: string[],
  minFollowers: number = DEFAULT_MIN_FOLLOWERS,
): Promise<HandleLookup[]> {
  await guard();
  return mapLimit(names, 5, (n) => resolveArtist(n, minFollowers));
}
