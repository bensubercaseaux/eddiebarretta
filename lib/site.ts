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

  // SoundCloud "Transcend Mixes" playlist (id 2188375376), brand violet.
  soundcloudPlaylistEmbed:
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2188375376&color=%236900ff&auto_play=false&hide_related=false&show_comments=true&show_user=false&show_reposts=false&show_teaser=true",

  youtubeVideos: ["2TjrdaVfZ-4", "IjrgRdo6O-Y", "rhO2JklK0sQ"],
} as const;

export const nav = [
  { label: "About", href: "#about" },
  { label: "Music", href: "#music" },
  { label: "Watch", href: "#watch" },
  { label: "Shows", href: "#shows" },
] as const;
