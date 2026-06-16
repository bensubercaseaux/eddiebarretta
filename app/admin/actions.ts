"use server";

import { redirect } from "next/navigation";
import { checkCredentials } from "@/lib/session";
import { startSession, endSession, isAuthenticated } from "@/lib/auth";
import {
  addShow,
  updateShow,
  deleteShow,
  isStoreConfigured,
} from "@/lib/shows-store";
import type { ShowInput } from "@/lib/shows";

export type FormState = { error?: string };

const NO_STORE =
  "No Blob store connected. Set BLOB_READ_WRITE_TOKEN to add or edit shows.";

function parseShow(formData: FormData): { show?: ShowInput; error?: string } {
  const date = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const venue = String(formData.get("venue") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const isPublic = formData.get("isPublic") != null;

  if (!date || !time || !name || !venue || !city) {
    return { error: "Date, time, name, venue, and city are all required." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: "Date must be in YYYY-MM-DD format." };
  }
  return { show: { date, time, name, venue, city, isPublic } };
}

// --- Auth -----------------------------------------------------------------

export async function login(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(username, password)) {
    return { error: "Invalid username or password." };
  }
  await startSession(username);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

// --- Shows ----------------------------------------------------------------

export async function createShow(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isAuthenticated())) redirect("/admin/login");
  if (!isStoreConfigured()) return { error: NO_STORE };
  const { show, error } = parseShow(formData);
  if (!show) return { error: error ?? "Invalid form." };
  await addShow(show);
  redirect("/admin");
}

export async function editShow(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isAuthenticated())) redirect("/admin/login");
  if (!isStoreConfigured()) return { error: NO_STORE };
  const { show, error } = parseShow(formData);
  if (!show) return { error: error ?? "Invalid form." };
  await updateShow(id, show);
  redirect("/admin");
}

export async function removeShow(id: string): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin/login");
  if (isStoreConfigured()) await deleteShow(id);
  redirect("/admin");
}
