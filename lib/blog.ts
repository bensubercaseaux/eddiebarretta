// The Trends blog: one post a month on where the EDM / DJ scene is heading,
// written from the booth. Posts live here as data (like lib/venues.ts) so the
// listing page, post pages, sitemap, and llms.txt all render from one source.
// To publish a new post, add it to the TOP of `posts` (newest first) — see
// documentation/blog-posts.md for the monthly workflow.

export type PostSection = {
  heading: string;
  paragraphs: string[];
};

/** A real, verified article backing the post — never invent these. */
export type PostSource = {
  title: string;
  /** Publication name, e.g. "Mixmag". */
  publisher: string;
  url: string;
};

export type Post = {
  slug: string;
  title: string;
  /** ISO publish date, e.g. "2026-08-10". One post per month. */
  date: string;
  /** Short topic label shown on cards, e.g. "Sound & genres". */
  tag: string;
  /** 1–2 sentences for cards and the meta description. */
  excerpt: string;
  /** Opening paragraphs, rendered before the first section heading. */
  intro: string[];
  sections: PostSection[];
  /** One-liner that closes the post, tying the trend back to Eddie's sets. */
  outro: string;
  /** Rendered as a "Further reading" block; URLs must be verified real pages. */
  sources?: PostSource[];
};

export const posts: Post[] = [
  {
    slug: "bar-circuit-djs-get-real-gear",
    title: "The Bar-Circuit DJ Finally Gets Real Gear",
    date: "2026-09-05",
    tag: "Tech & craft",
    excerpt: "AlphaTheta's biggest DJX lineup in years was built around all-in-one systems for DJs who work small rooms, not headline stages — and a security notice the same week showed what that new connectivity actually costs.",
    intro: [
      "Every DJX for the last few years has felt like a flagship showcase, all big CDJs and big-room thinking. This year the story at AlphaTheta's booth was different. Their biggest DJX yet was built around gear for the rooms most working DJs actually play, and the same week brought a reminder that all that new connectivity comes with a cost.",
    ],
    sections: [
      {
        heading: "All-in-one gear stops being an afterthought",
        paragraphs: [
          "DJX ran August 10 to 13 in Atlantic City, and AlphaTheta showed up with more new gear on the floor than in any previous year, including two products making their Atlantic City debut: the CDJ-1500X and the XDJ-AN. The XDJ-AN is the one that matters if you don't play main stages. AlphaTheta is positioning it as a genuine all-in-one system, aimed squarely at mobile and solo DJs who want fewer boxes in the bag, not a scaled-down club rig.",
          "That's a real shift in emphasis. Since last year's DJX, AlphaTheta has shipped the CDJ-3000X flagship player, the SLAB Serato Studio controller, the RMX-IGNITE effector, the compact DJM-V5 mixer, and now the CDJ-1500X and XDJ-AN. That's a lot of hardware in twelve months, and a good chunk of it is built for smaller setups rather than the two-CDJ, big-mixer club standard. Reporting on the show framed it plainly: new players, new all-in-one systems, new mixer options, all aimed at DJs who work in real rooms, not just headline stages.",
          "I feel this one directly. Nobody's rolling a full club rig into Lucky's or Sip or the Living Room Lounge. You're working a booth built for a bar, not a main room, and for a long time the gear didn't really acknowledge that middle tier existed. You either bought club hardware and hauled it every night, or you settled for something that felt like a toy next to it. A manufacturer building an all-in-one system with that kind of intention, and putting it front and center at its biggest trade show, is an admission that most working DJs don't play arenas most nights, and never will, and that's fine.",
        ],
      },
      {
        heading: "Connected gear, new stakes",
        paragraphs: [
          "The trade-off is that this gear isn't just smaller, it's more networked. All-in-one systems and modern mixers lean on the same protocols that let CDJs talk to each other, sync libraries, and pull tracks over a shared connection. Four days after DJX wrapped, AlphaTheta posted an important notice about a security vulnerability in PRO DJ LINK, the protocol its gear uses to network with itself in the booth.",
          "That notice landing right on the heels of a showcase built around connected, all-in-one hardware is the part worth sitting with. A DJ booth used to be about as low-tech a network as exists: cables, a mixer, maybe a laptop. Now it's an actual network, with all the upside that brings and, as of this month, a documented reminder that networks need patching like anything else.",
          "Practically, that means firmware updates aren't just about new features anymore. Checking for an update before a gig used to be about unlocking a waveform color or a new performance mode. Increasingly it's basic booth hygiene, the same way you'd think twice about which venue Wi-Fi your laptop joins before you plug in.",
        ],
      },
      {
        heading: "What it means for the rest of us",
        paragraphs: [
          "None of this shows up on a flyer, but it changes what a bar or lounge can reasonably ask a DJ to bring. If the gear built for that tier keeps improving, venues that book the Jax Beach and Atlantic Beach circuit get to expect a fuller, more capable setup without asking anyone to load in a club rig for a Tuesday night crowd of forty people. That's good for the rooms and good for the DJs working them, as long as everyone treats the network side of the booth with the same care they give the sound.",
        ],
      },
    ],
    outro: "I'm still deciding what lives in the Transcend road case next, but for the first time in a while, the gear built for a bar-sized room feels like it was actually designed for one, patch notes and all.",
    sources: [
      {
        title: "Pioneer DJ and AlphaTheta Bring the Beats to DJX 2026",
        publisher: "Rekkerd.org",
        url: "https://rekkerd.org/pioneer-dj-and-alphatheta-bring-the-beats-to-djx-2026/",
      },
      {
        title: "AlphaTheta Brings New DJ Gear to DJX",
        publisher: "Magnetic Magazine",
        url: "https://magneticmag.com/2026/08/alphatheta-brings-new-dj-gear-to-djx/",
      },
      {
        title: "Important Notice: Security Vulnerability in PRO DJ LINK",
        publisher: "AlphaTheta",
        url: "https://alphatheta.com/en/information/",
      },
    ],
  },
  {
    slug: "nightlife-is-moving-earlier",
    title: "Nightlife Is Moving Earlier — and Dance Music Is Better for It",
    date: "2026-08-10",
    tag: "Scene & culture",
    excerpt:
      "Day parties, coffee raves, and sunset slots are pulling dance music out of the 2 a.m. ghetto. Why the industry's clock is shifting, and what it means for DJs and the rooms that book them.",
    intro: [
      "For most of dance music's history, the assumption was simple: the later, the better. Peak time meant 1 a.m. The headliner went on when normal people were asleep. If you were dancing in daylight, it was Ibiza or it was a festival.",
      "That assumption is quietly dying. The fastest-growing formats in the scene right now — day parties, coffee raves, early-evening club nights that wrap by midnight — all start when the sun is still up. It's one of the biggest structural shifts the industry has seen in years, and almost nobody planned it.",
    ],
    sections: [
      {
        heading: "The crowd changed first",
        paragraphs: [
          "Younger crowds simply drink less than the generations before them, and venues have felt it at the bar register. A room that once made its margin on 1 a.m. rounds now sees guests who want the music, the room, and the social energy — but also want to be in bed at a reasonable hour and at the gym the next morning.",
          "Promoters followed the crowd. Morning and daytime dance events built around coffee, juice, or nothing at all have gone from novelty to a real circuit in cities across the US and Europe. The music is the same house and melodic sound you'd hear at midnight; only the clock moved.",
        ],
      },
      {
        heading: "Venues are reprogramming the early slot",
        paragraphs: [
          "For venues, the early evening used to be dead inventory — background playlists until the night crowd showed up. Now it's a bookable product. Sunset rooftop sets, happy-hour house nights, and 7-to-11 parties let a room sell two audiences in one day, and give DJs a slot where the dancefloor peaks at 9 p.m. instead of 1 a.m.",
          "Beach towns are naturally built for this. A rooftop over the water at golden hour doesn't need to apologize for not being a warehouse at 3 a.m. — the sunset is the production budget. The Jacksonville Beach scene I play in has been living this shift for a while: some of the best-reacting floors I see all week happen before dinner time.",
        ],
      },
      {
        heading: "Playing early is its own craft",
        paragraphs: [
          "An early crowd is a more sober, more attentive crowd, and it will not be bullied into dancing by sheer BPM. The energy arc is different: you earn the floor with groove and melody rather than drops, hold a longer warm-up, and treat the peak as a wave you build twice — once before sunset, once after dark.",
          "That's a return to classic DJ craft, honestly. Reading a room that isn't chemically committed to dancing makes you a better selector, and it rewards the melodic, vocal-forward end of house and trance that can feel wasted on a 2 a.m. crowd.",
        ],
      },
    ],
    outro:
      "The best slot in dance music used to be the one nobody was awake for. Increasingly, it's the one with a sunset behind the decks — and that suits a beach-town house and trance DJ just fine.",
    sources: [
      {
        title: "The New Nightlife: Gen Z's “Soft Clubbing” Proves the Party Isn't Over, It's Evolving",
        publisher: "Eventbrite",
        url: "https://www.eventbrite.com/blog/press/newsroom/the-new-nightlife-gen-zs-soft-clubbing/",
      },
      {
        title: "Coffee raves are reinventing the café experience, but will they last?",
        publisher: "Perfect Daily Grind",
        url: "https://perfectdailygrind.com/2025/11/coffee-raves-reinventing-cafes-gen-z/",
      },
    ],
  },
  {
    slug: "stems-changed-the-dj-booth",
    title: "Stems Quietly Rewired the DJ Booth",
    date: "2026-07-13",
    tag: "Tech & craft",
    excerpt:
      "Real-time stem separation went from party trick to standard equipment across Serato, rekordbox, and standalone gear. How on-the-fly acapellas and instrumentals are changing what a DJ set even is.",
    intro: [
      "Every few years a technology actually changes what happens in the booth. Sync was one. Hot cues were one. The latest is real-time stem separation — the ability to isolate or kill the vocals, drums, or melody of any track, live, mid-mix.",
      "What started as a machine-learning party trick is now built into essentially every major platform — Serato, rekordbox, djay, VirtualDJ, and standalone players — and it has moved from novelty to expectation faster than any booth tech I can remember.",
    ],
    sections: [
      {
        heading: "Every track is now four tracks",
        paragraphs: [
          "The core shift is simple: a DJ no longer plays records, they play components of records. Drop the drums out of one track and lay its vocal over another's instrumental, and you've made a mashup that never existed until that moment, in front of the crowd.",
          "Done well, this is genuinely new creative territory. A vocal from a 2003 trance anthem over a 2026 afro house groove is the kind of moment that used to take a producer a weekend in the studio; now it's a performance decision. The instant-acapella era means the best sets increasingly contain music you cannot hear anywhere else — not even on that DJ's own releases.",
        ],
      },
      {
        heading: "The gimmick trap",
        paragraphs: [
          "The failure mode is just as new. Stem tricks are seductive, and a set can turn into a demo reel: vocals yanked in and out every 30 seconds, mashups that ignore key and energy, artificial-sounding separations pushed way past what the algorithm can cleanly do.",
          "The discipline that's emerging among DJs who use stems well is the same one that governed scratching and FX before: the trick serves the groove, not the other way around. If the crowd notices the technology instead of the moment, it didn't work. Two or three earned stem moments a night land harder than twenty.",
        ],
      },
      {
        heading: "The industry hasn't caught up",
        paragraphs: [
          "There's an unresolved business layer under all this. Labels sell official acapellas and stem packs; real-time separation makes every track's stems available without asking. Live in a club, that's the same gray zone DJ culture has always lived in. In recorded and streamed mixes, it's murkier, and the licensing conversation is only starting.",
          "Meanwhile, producers are adapting on the creative side — some now mix their releases knowing separation will be run on them, keeping vocals cleaner in the stereo field so they survive extraction. When artists start producing for the algorithm that will take their track apart, the technology has fully arrived.",
        ],
      },
    ],
    outro:
      "I've been folding stem moments into my Transcend sets where they earn their place — a vocal held over a new groove, a breakdown stripped to melody. The tech is new; the rule is old: play the room, not the toy.",
    sources: [
      {
        title: "Real-Time Stems Separation Comes To Serato DJ Software",
        publisher: "Digital DJ Tips",
        url: "https://www.digitaldjtips.com/real-time-stems-separation-comes-to-serato-dj-software/",
      },
      {
        title: "Serato Stems: what DJs are doing with real-time stem separation added to Serato DJ",
        publisher: "DJ TechTools",
        url: "https://djtechtools.com/2022/10/11/serato-stems-what-djs-are-doing-with-real-time-stem-separation-added-to-serato-dj/",
      },
      {
        title: "DJ Stems Compared: Serato vs VirtualDJ vs rekordbox vs djay vs Traktor vs Engine DJ",
        publisher: "The DJ Mixtape",
        url: "https://thedjmixtape.com/virtualdj-stems-vs-serato-stems-vs-rekordbox-stems/",
      },
    ],
  },
  {
    slug: "the-trance-revival-is-real",
    title: "The Trance Revival Is Real — and It's Bigger Than Nostalgia",
    date: "2026-06-15",
    tag: "Sound & genres",
    excerpt:
      "Trance is having its biggest moment in a decade: melodic techno headliners chasing 138, classic anthems resurfacing for a generation that never heard them, and euphoria back in fashion on the main floor.",
    intro: [
      "For years, admitting you loved trance was dance music's guilty pleasure. The genre that owned the early 2000s spent a decade filed under 'cheese' while tech house and techno ran the clubs. That era is over: trance's DNA is suddenly everywhere, and the industry has noticed.",
      "This isn't just the veterans' scene sustaining itself. The revival is being driven from outside — by melodic techno's biggest names, by younger producers discovering supersaws, and by crowds who weren't born when the classics dropped.",
    ],
    sections: [
      {
        heading: "Melodic techno backed into trance",
        paragraphs: [
          "The stadium-scale melodic techno wave — the Afterlife-style sound built on huge emotional breakdowns and cinematic melody — kept edging faster and more euphoric until the line between it and trance basically dissolved. Headliners in that world now openly reach for trance classics and trance energy at peak time, and their massive young audiences are following the thread back to the source.",
          "At the same time, the harder end of the spectrum went through its own rediscovery: hard trance and hard dance sounds have been pulled into techno rooms by a wave of young DJs who treat 150 BPM euphoria as new music, not throwback. When both the melodic and hard ends of the underground converge on your genre, that's not a nostalgia cycle — that's a revival.",
        ],
      },
      {
        heading: "The classics found a second life",
        paragraphs: [
          "Short-form video did for trance what it did for so many catalog sounds: put 25-year-old anthems in front of teenagers as if they were new. Piano breakdowns and uplifting builds are natively suited to the 30-second emotional-payoff format, and edits of classic anthems keep going viral, sending streams of the originals climbing.",
          "The institutions are meeting the moment — anniversary tours, classics-only events, and festival mainstages programming uplifting sets that would have been unthinkable bookings five years ago. Euphoria is commercially safe again.",
        ],
      },
      {
        heading: "What it means at floor level",
        paragraphs: [
          "For working DJs, the practical change is that the trance moment now lands in ordinary rooms. A vocal trance record or a big uplifting breakdown mid-set — something I'd once save for a trance-literate crowd — now gets one of the strongest reactions of the night from a general bar or club floor. Crowds are openly hungry for melody and release after years of tool-track minimalism.",
          "My advice to other selectors: don't treat it as a novelty drop. Blend the eras — a classic anthem into a modern melodic groove, trance energy at house tempo — and the floor takes the emotion without the history lesson.",
        ],
      },
    ],
    outro:
      "I named my mix series Transcend for a reason — the euphoric end of house and trance never stopped working on a dancefloor. It's just nice that the industry remembered.",
    sources: [
      {
        title: "Trance reborn: The sound is back and big as ever",
        publisher: "Mixmag",
        url: "https://mixmag.net/feature/trance-reborn-the-sound-is-back-and-big-as-ever",
      },
      {
        title: "The enduring appeal of trance",
        publisher: "DJ Mag",
        url: "https://djmag.com/content/enduring-appeal-trance",
      },
      {
        title: "The cupids of clubland: DJ HEARTSTRING will make you fall in love on the dancefloor",
        publisher: "Mixmag",
        url: "https://mixmag.net/feature/dj-heartstring-interview-cover-feature-berlin-trance-techno-dance-music",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/** "Aug 10, 2026" — for cards and bylines (UTC so the day never shifts). */
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Rounded-up minutes at ~220 wpm, for the "X min read" label. */
export function readingTime(post: Post): number {
  const words = [
    post.title,
    ...post.intro,
    ...post.sections.flatMap((s) => [s.heading, ...s.paragraphs]),
    post.outro,
  ]
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}
