// Token-authenticated shows API for automation (e.g. the daily booking-texts
// agent). GET lists every show (public + private) so callers can dedupe before
// writing; POST adds one show. Humans use /admin — this exists for callers that
// can't hold the admin session cookie.

import { timingSafeEqual } from "node:crypto";
import { addShow, getAllShows, isStoreConfigured } from "@/lib/shows-store";
import type { ShowInput } from "@/lib/shows";

function isAuthorized(req: Request): boolean {
  const token = process.env.SHOWS_API_TOKEN;
  if (!token) return false;
  const provided = (req.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  const a = Buffer.from(provided);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Validate an incoming show payload; returns the error message if invalid. */
function parseShowInput(
  body: unknown,
): { input: ShowInput; error?: never } | { input?: never; error: string } {
  const o = (body ?? {}) as Record<string, unknown>;

  const date = typeof o.date === "string" ? o.date : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    return { error: 'date must be an ISO date like "2026-08-14"' };
  }
  for (const key of ["time", "name", "venue", "city"] as const) {
    if (typeof o[key] !== "string" || !(o[key] as string).trim()) {
      return { error: `${key} must be a non-empty string` };
    }
  }
  const url = o.url === undefined || o.url === "" ? undefined : o.url;
  if (url !== undefined && (typeof url !== "string" || !/^https?:\/\//.test(url))) {
    return { error: "url must be an http(s) link when provided" };
  }

  return {
    input: {
      date,
      time: (o.time as string).trim(),
      name: (o.name as string).trim(),
      venue: (o.venue as string).trim(),
      city: (o.city as string).trim(),
      // Automation defaults to visible; pass false for private gigs.
      isPublic: typeof o.isPublic === "boolean" ? o.isPublic : true,
      ...(url ? { url } : {}),
    },
  };
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return Response.json({ shows: await getAllShows() });
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isStoreConfigured()) {
    return Response.json({ error: "shows store not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "body must be JSON" }, { status: 400 });
  }

  const parsed = parseShowInput(body);
  if (parsed.error !== undefined) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }
  const input = parsed.input;

  // Same venue on the same date is almost certainly the same gig — refuse so a
  // re-run of the booking agent can't double-post.
  const existing = await getAllShows();
  if (existing.some((s) => s.date === input.date && s.venue.toLowerCase() === input.venue.toLowerCase())) {
    return Response.json(
      { error: `a show at ${input.venue} on ${input.date} already exists` },
      { status: 409 },
    );
  }

  await addShow(input);
  return Response.json({ ok: true, added: input }, { status: 201 });
}
