export type Show = {
  /** Stable id (uuid). */
  id: string;
  /** ISO date, e.g. "2026-02-28" */
  date: string;
  /** Display time, e.g. "6:00 - 10:00 PM" */
  time: string;
  name: string;
  venue: string;
  city: string;
  /** Private shows are hidden from the public site (admin-only). */
  isPublic: boolean;
  /** Optional ticket / event link */
  url?: string;
};

/** Everything except the server-generated id — what an add/edit form provides. */
export type ShowInput = Omit<Show, "id">;

// ----------------------------------------------------------------------------
// Fallback used when no Vercel Blob store is configured (e.g. local dev before
// the migration). Once BLOB_READ_WRITE_TOKEN is set, the live data in Blob
// takes over and this is ignored. See lib/shows-store.ts.
// ----------------------------------------------------------------------------
export const SEED_SHOWS: Show[] = [
  { id: "seed-1", date: "2026-02-28", time: "6:00 - 10:00 PM", name: "Sunset Party", venue: "SIP Cocktail Bar", city: "Jacksonville", isPublic: true },
  { id: "seed-2", date: "2026-02-27", time: "5:00 - 9:00 PM", name: "Happy Hour", venue: "Surfer Bar", city: "Jacksonville Beach", isPublic: true },
  { id: "seed-3", date: "2026-02-14", time: "6:00 - 10:00 PM", name: "Sunset Party", venue: "SIP Cocktail Bar", city: "Jacksonville", isPublic: true },
  { id: "seed-4", date: "2026-02-13", time: "9:00 PM", name: "Eddie Barretta (DJ Set)", venue: "VooSwar", city: "Atlantic Beach", isPublic: true },
];

export function splitShows(now: Date, list: Show[]) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const upcoming: Show[] = [];
  const past: Show[] = [];
  for (const s of list) {
    const t = new Date(`${s.date}T00:00:00`).getTime();
    (t >= today ? upcoming : past).push(s);
  }
  upcoming.sort((a, b) => a.date.localeCompare(b.date));
  past.sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}

/** IANA zone for all shows — Eddie plays Northeast Florida. */
const SHOW_TZ = "America/New_York";

/** UTC offset (e.g. "-04:00") for a calendar date in the show timezone. */
function tzOffset(date: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SHOW_TZ,
    timeZoneName: "longOffset",
  }).formatToParts(new Date(`${date}T12:00:00Z`));
  const name = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
  return name.match(/GMT([+-]\d{2}:\d{2})/)?.[1] ?? "-05:00";
}

/** "6:30 PM"-style token → minutes since midnight, or null if unparseable. */
function parseClock(
  token: string,
  fallbackMeridiem?: string,
): number | null {
  const m = token.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  const mer = (m[3] ?? fallbackMeridiem)?.toUpperCase();
  if (h < 1 || h > 12 || min > 59) return null;
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

/**
 * Schema.org startDate/endDate for a show. Parses display times like
 * "6:00 - 10:00 PM" or "9:00 PM" into ISO datetimes with the correct
 * EST/EDT offset; falls back to the bare date when the time is unparseable.
 */
export function showSchedule(s: Show): { startDate: string; endDate?: string } {
  const tokens = s.time.match(/\d{1,2}(?::\d{2})?\s*(?:AM|PM)?/gi) ?? [];
  const endToken = tokens.length > 1 ? tokens[tokens.length - 1] : null;
  const endMer = endToken?.match(/AM|PM/i)?.[0];

  // In ranges like "6:00 - 10:00 PM" the start inherits the end's meridiem.
  let start = tokens[0] ? parseClock(tokens[0], endMer) : null;
  if (start === null) return { startDate: s.date };

  let end = endToken ? parseClock(endToken) : null;
  if (end !== null) {
    if (end <= start) end += 24 * 60; // crosses midnight
    if (end - start > 12 * 60) {
      // Implausibly long set — the inherited meridiem was wrong ("11:00 - 1:00 AM").
      start += 12 * 60;
      if (end - start <= 0) end += 24 * 60;
      if (start >= 24 * 60) {
        start -= 24 * 60;
        end -= 24 * 60;
      }
    }
  }

  const clock = (mins: number) =>
    `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}:00`;
  const nextDay = (date: string) =>
    new Date(new Date(`${date}T00:00:00Z`).getTime() + 86_400_000)
      .toISOString()
      .slice(0, 10);

  const startDate = `${s.date}T${clock(start)}${tzOffset(s.date)}`;
  if (end === null) return { startDate };

  const endDay = end >= 24 * 60 ? nextDay(s.date) : s.date;
  return {
    startDate,
    endDate: `${endDay}T${clock(end % (24 * 60))}${tzOffset(endDay)}`,
  };
}

export function formatShowDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    month: d.toLocaleDateString("en-US", { month: "short" }),
    day: d.toLocaleDateString("en-US", { day: "numeric" }),
  };
}
