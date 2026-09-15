// Hire-intent landing pages (/bar-lounge-dj, /private-event-dj). Search impressions
// on the venue pages come from people looking for the bar itself; these pages are
// for people looking to book a DJ. Copy is built only from facts elsewhere in the
// repo (site.ts, venues.ts, the booking form) plus what Eddie stated about private
// parties (2026-09-15): hired for his sound, requests ahead of time in his genres,
// no client playlists, house foundation with no trance, 80s/90s only as house
// remixes, own equipment or the venue's PA, quotes on request with travel included.
// No prices, packages or claims beyond that.

export type ServicePage = {
  /** Route segment, e.g. "bar-lounge-dj". */
  slug: string;
  /** <title> segment; the root layout appends " | Eddie Barretta" (17 chars), so keep ≤ 43. */
  title: string;
  /** Meta description, ≤ 155 chars. */
  description: string;
  /** Breadcrumb label for the current page. */
  crumb: string;
  eyebrow: string;
  h1: string;
  intro: string;
  /** schema.org Service.serviceType. */
  serviceType: string;
  /** Optional cards right under the intro — only facts Eddie has stated. */
  details?: { heading: string; items: { title: string; body: string }[] };
  /** Genre chips to leave out on this page. */
  hideGenres?: RegExp;
  /** Line above the genre chips. */
  genresCaption?: string;
  venuesHeading: string;
  /** "venues": the live sets recorded at those venues; "latest": the newest mixes. */
  mixes: "venues" | "latest";
  mixesHeading: string;
  /** Extra line in the "How booking works" box. */
  bookingNote?: string;
  cta: string;
  footerLabel: string;
  ogTitle: string;
  ogSubtitle: string;
};

export const servicePages = {
  barLounge: {
    slug: "bar-lounge-dj",
    title: "Bar & Lounge DJ in Jacksonville Beach, FL",
    description:
      "House & trance DJ Eddie Barretta has held residencies at SIP, Living Room Lounge and Dua Lounge. Book him for your Jacksonville-area bar or lounge.",
    crumb: "Bar & lounge DJ",
    eyebrow: "Residencies & bar nights",
    h1: "Bar & lounge DJ for Jacksonville & the Beaches",
    intro:
      "Eddie Barretta is a house & trance DJ based in Jacksonville Beach, FL. He has held residencies at a rooftop cocktail bar and two lounges, and played featured sets at beach bars and nightclubs across Jacksonville and the Beaches.",
    serviceType: "House & trance DJ for bars, lounges, and residencies",
    venuesHeading: "Where he has held residencies and played sets",
    mixes: "venues",
    mixesHeading: "Recorded live in those rooms",
    cta: "Book Eddie for your venue",
    footerLabel: "Bar & lounge DJ",
    ogTitle: "Bar & lounge DJ",
    ogSubtitle: "Residencies & bar nights · Jacksonville & the Beaches",
  },
  privateEvent: {
    slug: "private-event-dj",
    title: "Private Event DJ in Jacksonville, FL",
    description:
      "Hire house DJ Eddie Barretta for private parties in Jacksonville & Northeast Florida. His own equipment, requests in his style. Contact for a quote.",
    crumb: "Private event DJ",
    eyebrow: "Private parties & events",
    h1: "Private event DJ in Jacksonville",
    intro:
      "Eddie Barretta plays private parties of every kind across Jacksonville, Jacksonville Beach & Northeast Florida. You're booking his sound: house music at the foundation, with 80s and 90s favorites reworked to keep the energy up all night.",
    serviceType: "House music DJ for private parties and events",
    details: {
      heading: "What to expect",
      items: [
        {
          title: "You're hiring his sound",
          body: "Book Eddie for the music he plays. The foundation is house, the same energy he brings to bars and lounges. He doesn't play trance at private parties.",
        },
        {
          title: "Requests, sent ahead of time",
          body: "Send your requests before the party. They need to fit the genres he plays: he doesn't follow a set playlist handed to him.",
        },
        {
          title: "80s & 90s, in house form",
          body: "Plenty of 80s and 90s favorites, all as house remixes that keep the dance floor moving. He doesn't play the originals.",
        },
        {
          title: "Equipment covered",
          body: "Eddie brings his own equipment. If your venue has a PA, he plugs his controller straight into it.",
        },
        {
          title: "Quotes & travel",
          body: "Every party is quoted individually. He travels, and the distance is factored into the quote.",
        },
      ],
    },
    hideGenres: /trance/i,
    genresCaption: "What he plays at private parties, with house as the foundation:",
    venuesHeading: "Rooms he has played",
    mixes: "latest",
    mixesHeading: "Hear what a set sounds like",
    bookingNote: "Contact Eddie for a quote. Travel is factored in.",
    cta: "Book Eddie for your event",
    footerLabel: "Private event DJ",
    ogTitle: "Private event DJ",
    ogSubtitle: "House music for private parties · Jacksonville & Northeast Florida",
  },
} satisfies Record<string, ServicePage>;
