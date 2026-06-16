export type Show = {
  /** ISO date, e.g. "2026-02-28" */
  date: string;
  /** Display time, e.g. "6:00 - 10:00 PM" */
  time: string;
  name: string;
  venue: string;
  city: string;
  /** Optional ticket / event link */
  url?: string;
};

// ----------------------------------------------------------------------------
// Add upcoming gigs at the top. Anything with a date in the future shows under
// "Upcoming"; past dates roll into "Recent sets" automatically.
// ----------------------------------------------------------------------------
export const shows: Show[] = [
  { date: "2026-02-28", time: "6:00 - 10:00 PM", name: "Sunset Party", venue: "SIP Cocktail Bar", city: "Jacksonville" },
  { date: "2026-02-27", time: "5:00 - 9:00 PM", name: "Happy Hour", venue: "Surfer Bar", city: "Jacksonville Beach" },
  { date: "2026-02-14", time: "6:00 - 10:00 PM", name: "Sunset Party", venue: "SIP Cocktail Bar", city: "Jacksonville" },
  { date: "2026-02-13", time: "9:00 PM", name: "Eddie Barretta (DJ Set)", venue: "VooSwar", city: "Atlantic Beach" },
];

export function splitShows(now: Date) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const upcoming: Show[] = [];
  const past: Show[] = [];
  for (const s of shows) {
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
