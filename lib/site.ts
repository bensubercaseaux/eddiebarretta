// Central content + config. Edit here to update copy, links, and contact details.

// Public booking inbox. Forwards to Ben's Gmail through Cloudflare Email
// Routing (since 2026-10-12), so the personal address is never published.
const BOOKING_EMAIL = "booking@eddiebarretta.com";

// Eddie's Twilio line (calls ring through, voicemail and texts go to the
// booking inbox; see README "Phone line"). The only switch: null renders no
// phone anywhere; set { display: "(904) 555-0123", e164: "+19045550123" } to
// show it in the booking sections, the booking FAQ, llms.txt and the JSON-LD.
const PHONE: { display: string; e164: string } | null = { display: "(904) 867-8008", e164: "+19048678008" };

export const site = {
  name: "Eddie Barretta",
  role: "House & Trance DJ",
  location: "Jacksonville Beach, FL",
  // Ben, 2026-10-18: "2 years djing in Jacksonville". A year, not a count, so
  // the sentence doesn't go stale. Venue-level dates stay in lib/venues.ts.
  // Before that, about two years in Atlanta in his early 20s (Ben, same day);
  // no year given, so the copy says "early 20s", never a computed date.
  jacksonvilleSince: 2024,
  serviceArea: "Jacksonville, Jacksonville Beach & Northeast Florida",

  // The on-site form is the preferred way to book (it asks for date, venue and
  // event type). Root-relative so it works from subpages too.
  bookingUrl: "/#book",

  bookingEmail: BOOKING_EMAIL,
  phone: PHONE,

  // When the line is answered — the same hours as the Google Business Profile
  // (set 2026-10-19; Ben: "weekdays 6pm EST to Midnight and all day on
  // weekends"). Eastern time. Feeds the booking ContactPoint's hoursAvailable
  // and llms.txt; change both places together with the profile.
  lineHours: {
    summary: "weekdays 6 PM to midnight, all day on weekends (Eastern)",
    spec: [
      { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "18:00", closes: "00:00" },
      { days: ["Saturday", "Sunday"], opens: "00:00", closes: "23:59" },
    ],
  },

  bioShort:
    "Euphoric house and trance sets that keep the dancefloor moving across the Jacksonville Beach scene, and host of the Transcend podcast.",

  bio: [
    "With an ear for infectious beats and a heart that beats in sync with the dancefloor, Eddie Barretta has built a reputation for sets that keep the energy soaring.",
    "From beach bars to late-night lounges across the Jacksonville Beach area, he turns every gig into something to remember, seamlessly blending tracks into a euphoric, keep-you-moving atmosphere.",
    "Always hunting for the hottest new records, Eddie keeps his sets fresh and dynamic. Whether you are a seasoned club-goer or a curious newcomer, expect pulsating beats and infectious energy from start to finish.",
  ],

  // Genres Eddie plays. House & Trance are the flagship; the rest round out the
  // palette. Shown in the About section and in structured data.
  genres: [
    "House",
    "Trance",
    "Tech House",
    "Latin House",
    "Melodic House",
    "Afro House",
    "Dance",
    "Funky House",
    "Vocal House",
    "Tropical House",
  ],

  socials: {
    instagram: "https://instagram.com/djeddiebarretta",
    tiktok: "https://www.tiktok.com/@eddie_barretta",
    soundcloud: "https://soundcloud.com/eddie-barretta",
    youtube: "https://www.youtube.com/channel/UCoNhqZqV16sOxdxROqUMPHw",
  },

  // One-line description of the Transcend podcast. Shared by the FAQ below and
  // the channel text of /podcast.rss, so the feed never drifts from the site.
  podcastSummary:
    "Transcend is Eddie Barretta's mix series and podcast, featuring his latest house and trance DJ sets with full tracklists.",

  // How to book, in one sentence. Shared by the FAQ below (visible and
  // FAQPage JSON-LD) and /podcast.rss. Form first; phone only while PHONE is set.
  bookingSummary: `You can book Eddie for bar nights, residencies, private events, and parties using the booking form at eddiebarretta.com/#book (the quickest way), ${
    PHONE ? `by calling or texting ${PHONE.display}, ` : ""
  }by emailing ${BOOKING_EMAIL}, or by messaging @djeddiebarretta on Instagram.`,

  // The <itunes:owner> email in /podcast.rss. Apple Podcasts and Spotify send
  // ownership-verification codes here, so it must be a working inbox, and the
  // feed is public, so whatever goes here is published. null = pass through the
  // address on the SoundCloud account; a string replaces it (the booking inbox).
  podcastOwnerEmail: BOOKING_EMAIL as string | null,

  // Where the Transcend podcast (the SoundCloud RSS feed) is distributed.
  // Listeners can subscribe on any of these; new mixes appear automatically.
  podcast: {
    apple:
      "https://podcasts.apple.com/us/podcast/transcend/id1678351064",
    amazon:
      "https://music.amazon.com/podcasts/3ac70ad2-8a98-4d09-8f00-3cf99cde7350/transcend",
    youtube:
      "https://www.youtube.com/playlist?list=PLjisbdyvOZPD3tiXrQ2rJeBAoGfqjl2GI",
    iheart: "https://www.iheart.com/podcast/339189693/",
    soundcloud: "https://soundcloud.com/eddie-barretta",
  },

  // The Google Business Profile's Google Maps URL (the profile's own share link,
  // maps.google.com/?cid=… or maps.app.goo.gl/…), listed in sameAs and llms.txt
  // to tie the site to the verified listing. null renders nothing. Not a
  // google.com/search?kgmid=… URL: that is a search results page, not a profile.
  googleMapsUrl: "https://maps.google.com/?cid=10134799322354659552" as string | null,

  // Google's "write a review" form for the same profile (place ID
  // ChIJ87WczXrvNIYR4LDRhkkKpow, from the Places API 2026-10-19). /review
  // redirects here (next.config.ts), so eddiebarretta.com/review is the link to
  // send clients after a gig.
  googleReviewUrl:
    "https://search.google.com/local/writereview?placeid=ChIJ87WczXrvNIYR4LDRhkkKpow",
} as const;

// Single source for the home-page FAQ: renders in the visible <Faq /> section
// AND feeds the FAQPage JSON-LD, so the markup always matches on-page content
// (a Google structured-data requirement).
export const faq = [
  {
    question: "What kind of music does Eddie Barretta play?",
    answer:
      "Eddie Barretta is a house and trance DJ known for euphoric, dancefloor-driven sets, blending tech house, melodic house, and vocal trance.",
  },
  {
    question: "Where is Eddie Barretta based?",
    answer:
      "Eddie is based in the Jacksonville Beach, FL area and performs across Jacksonville and Northeast Florida.",
  },
  {
    question: "How can I book Eddie Barretta to DJ my event?",
    answer: site.bookingSummary,
  },
  {
    question: "What is the Transcend podcast?",
    answer: site.podcastSummary,
  },
] as const;

// Root-relative anchors so the nav works from subpages (e.g. /mixes) too, not
// just the home page.
export const nav = [
  { label: "About", href: "/#about" },
  { label: "Music", href: "/#music" },
  { label: "Mixes", href: "/mixes" },
  { label: "Watch", href: "/#watch" },
  { label: "Shows", href: "/#shows" },
  { label: "Venues", href: "/venues" },
  { label: "Blog", href: "/blog" },
] as const;
