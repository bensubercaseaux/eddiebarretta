// Central content + config. Edit here to update copy, links, and contact details.

export const site = {
  name: "Eddie Barretta",
  role: "House & Trance DJ",
  location: "Jacksonville Beach, FL",
  serviceArea: "Jacksonville, Jacksonville Beach & Northeast Florida",

  // Public booking address. Set up forwarding for this once you control the
  // domain (see README). The contact form below works immediately regardless.
  bookingEmail: "bookings@eddiebarretta.com",

  bioShort:
    "Euphoric house and trance sets that keep the dancefloor moving across the Jacksonville Beach scene, and host of the Transcend podcast.",

  bio: [
    "With an ear for infectious beats and a heart that beats in sync with the dancefloor, Eddie Barretta has built a reputation for sets that keep the energy soaring.",
    "From beach bars to late-night lounges across the Jacksonville Beach area, he turns every gig into something to remember, seamlessly blending tracks into a euphoric, keep-you-moving atmosphere.",
    "Always hunting for the hottest new records, Eddie keeps his sets fresh and dynamic. Whether you are a seasoned club-goer or a curious newcomer, expect pulsating beats and infectious energy from start to finish.",
  ],

  socials: {
    instagram: "https://instagram.com/djeddiebarretta",
    tiktok: "https://www.tiktok.com/@eddie_barretta",
    soundcloud: "https://soundcloud.com/eddie-barretta",
    youtube: "https://www.youtube.com/channel/UCoNhqZqV16sOxdxROqUMPHw",
  },

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

  // Google Business Profile / Knowledge Panel. Ties the site to the verified
  // Google listing — important for local SEO and entity reconciliation.
  googleBusiness:
    "https://www.google.com/search?kgmid=/g/11yzw30vry&q=Eddie+Barretta",

  // Venues Eddie has played around the Jacksonville area.
  venues: [
    "Living Room Lounge",
    "SIP Cocktail Bar",
    "Surfer Bar",
    "Dua Lounge",
    "Cataluna Lounge",
    "Lemon Bar",
    "Lucky's",
    "Myth",
  ],

  youtubeVideos: ["2TjrdaVfZ-4", "IjrgRdo6O-Y", "rhO2JklK0sQ"],
} as const;

// Root-relative anchors so the nav works from subpages (e.g. /mixes) too, not
// just the home page.
export const nav = [
  { label: "About", href: "/#about" },
  { label: "Music", href: "/#music" },
  { label: "Watch", href: "/#watch" },
  { label: "Shows", href: "/#shows" },
] as const;
