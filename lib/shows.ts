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

export function formatShowDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    month: d.toLocaleDateString("en-US", { month: "short" }),
    day: d.toLocaleDateString("en-US", { day: "numeric" }),
  };
}
