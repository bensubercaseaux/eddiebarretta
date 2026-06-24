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

// One artist / one handle per call. The client drives these sequentially with a
// delay between calls, so we never burst requests at SoundCloud.

export async function resolveArtistAction(
  name: string,
  minFollowers: number = DEFAULT_MIN_FOLLOWERS,
): Promise<HandleLookup> {
  await guard();
  return resolveArtist(name, minFollowers);
}

export async function validateHandleAction(handle: string): Promise<HandleLookup> {
  await guard();
  return validateHandle(handle);
}
