"use server";

import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { lookupHandle, autoResolveArtist, type HandleLookup } from "@/lib/soundcloud";

async function guard() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

/** Validate handles the user typed/pasted. Order matches the input array. */
export async function validateHandlesAction(
  handles: string[],
): Promise<HandleLookup[]> {
  await guard();
  return Promise.all(handles.map((h) => lookupHandle(h)));
}

/** Best-effort auto-resolve a list of artist names. Order matches the input. */
export async function autoResolveAction(
  names: string[],
): Promise<HandleLookup[]> {
  await guard();
  return Promise.all(names.map((n) => autoResolveArtist(n)));
}
