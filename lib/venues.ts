// Venues where Eddie Barretta has performed, in the Jacksonville / Beaches area.
// Facts (type, address, official site) are researched, not invented. Each drives
// a /venues/[slug] SEO page and links to Eddie's live set there when one exists.

export type Venue = {
  slug: string;
  name: string;
  /** Neighborhood / city for display. */
  area: string;
  /** Short venue type, e.g. "Rooftop cocktail bar". */
  type: string;
  /** Eddie's relationship to the room. */
  relation: "Resident DJ" | "Featured set" | "Guest set";
  /** One line on Eddie's connection to the venue. */
  relationText: string;
  /** 1–2 factual sentences describing the venue. */
  summary: string;
  street?: string;
  locality: string;
  region: string;
  postalCode?: string;
  website?: string;
  /** Instagram handle without the @. */
  instagram?: string;
  /** Slug of Eddie's live mix recorded here, if any (see lib/mixes). */
  relatedMixSlug?: string;
};

export const venues: Venue[] = [
  {
    slug: "living-room-lounge",
    name: "Living Room Lounge",
    area: "Atlantic Beach",
    type: "Upscale cocktail lounge",
    relation: "Resident DJ",
    relationText:
      "Eddie held a DJ residency at Living Room Lounge, keeping the room moving with house and trance.",
    summary:
      "Living Room Lounge is an upscale cocktail lounge on the second floor of Coop 303 in Atlantic Beach. Plush, gold-gilded furniture replaces traditional tables for a cozy, elevated vibe, with a resident DJ setting the mood over handcrafted cocktails and late-night bites.",
    locality: "Atlantic Beach",
    region: "FL",
    website: "https://www.coop303.com/living-room-lounge",
    instagram: "thelivingroomab",
    relatedMixSlug: "live-living-room-lounge-extended-set",
  },
  {
    slug: "sip-cocktail-bar",
    name: "SIP Cocktail Bar",
    area: "Downtown Jacksonville",
    type: "Rooftop cocktail bar",
    relation: "Resident DJ",
    relationText:
      "Eddie held a residency at SIP, soundtracking rooftop sunsets over the St. Johns River.",
    summary:
      "SIP is a rooftop cocktail bar perched atop Decca Live at 323 E Bay Street in downtown Jacksonville, known for high-end craft cocktails and sweeping St. Johns River sunset views. Decca Live, the live-music and concert venue below, has hosted national touring acts.",
    street: "323 E Bay St",
    locality: "Jacksonville",
    region: "FL",
    postalCode: "32202",
    website: "https://www.sipontheroof.com/",
    relatedMixSlug: "live-sip",
  },
  {
    slug: "surfer-the-bar",
    name: "Surfer [The Bar]",
    area: "Jacksonville Beach",
    type: "Beachside bar & live-music venue",
    relation: "Featured set",
    relationText:
      "Eddie has played featured sets in Surfer's high-energy upstairs club room.",
    summary:
      "Surfer [The Bar] is SURFER magazine's flagship bar in the heart of Jacksonville Beach — a multi-level spot with several bars, a wraparound deck, a live-music stage, and a restored 1960s Airstream serving tacos. The relaxed downstairs and patio give way to an upstairs dance floor where DJs spin house and remixes on weekends.",
    street: "200 1st St N",
    locality: "Jacksonville Beach",
    region: "FL",
    postalCode: "32250",
    website: "https://surferthebar.com/",
    relatedMixSlug: "live-surfer-bar",
  },
  {
    slug: "dua-lounge",
    name: "Dua Lounge",
    area: "Baymeadows, Jacksonville",
    type: "Mediterranean restaurant & lounge",
    relation: "Resident DJ",
    relationText:
      "Eddie held a residency at Dua, layering house grooves over the late-night lounge.",
    summary:
      "Dua Restaurant & Lounge on Baymeadows Road pairs a Mediterranean-inspired menu with a lively late-night lounge — creative cocktails, hookah on the patio, and DJ sets that build the room's energy long after dinner.",
    street: "8532 Baymeadows Rd",
    locality: "Jacksonville",
    region: "FL",
    postalCode: "32256",
    website: "https://www.dualoungejax.com/",
    relatedMixSlug: "live-dua-lounge",
  },
  {
    slug: "cataluna-lounge",
    name: "Cataluna Lounge",
    area: "Southside, Jacksonville",
    type: "Modern Mediterranean lounge",
    relation: "Featured set",
    relationText:
      "Eddie has played featured sets at Cataluna, from downtempo openers to peak-time electronic.",
    summary:
      "Cataluna is a modern Mediterranean lounge on Philips Highway, all gold tones and warm, opulent lighting. Resident DJs open with downtempo sounds over small plates and cocktails before the room shifts into electronic music, bottle service, and artist performances toward its 2 AM close (21+).",
    street: "8206 Philips Hwy",
    locality: "Jacksonville",
    region: "FL",
    postalCode: "32256",
    website: "https://www.catalunajax.com/",
    instagram: "catalunalounge",
  },
  {
    slug: "lemon-bar",
    name: "Lemon Bar",
    area: "Neptune Beach",
    type: "Oceanfront beach bar",
    relation: "Featured set",
    relationText:
      "Eddie has played featured beachfront sets at the Lemon Bar.",
    summary:
      "The Lemon Bar sits right on the Atlantic in the courtyard of the Seahorse Oceanfront Inn in Neptune Beach — an iconic, seasonal beach bar (roughly mid-February through Thanksgiving weekend) known for oceanfront views and beach-inspired cocktails like Goombay Smashes and Rum Runners.",
    street: "2 Lemon St",
    locality: "Neptune Beach",
    region: "FL",
    postalCode: "32266",
    website: "https://www.lemonbarjax.com/",
    relatedMixSlug: "live-lemon-bar",
  },
  {
    slug: "myth-nightclub",
    name: "Myth Nightclub",
    area: "Downtown Jacksonville",
    type: "Nightclub",
    relation: "Featured set",
    relationText: "Eddie has played featured sets in Myth's main room.",
    summary:
      "Myth is a downtown Jacksonville nightclub billed as the city's premier nightlife destination, with an LED video ceiling, craft cocktails, and high-energy themed nights like its Ignite Fridays UV parties. It's paired with the adjoining Element Bistro & Craft Cocktail Lounge.",
    street: "333 E Bay St, Suite 105",
    locality: "Jacksonville",
    region: "FL",
    postalCode: "32202",
    website: "https://mythexperience.com/",
  },
  {
    slug: "luckys-bar",
    name: "Lucky's",
    area: "Jacksonville Beach",
    type: "Bar & live-music spot",
    relation: "Guest set",
    relationText: "Eddie has DJ'd at Lucky's in Jax Beach.",
    summary:
      "Lucky's is an upscale-yet-approachable bar in Jacksonville Beach (in the former Shim Sham Room space), known for its “world-famous chicken & waffles,” bar games like bumper pool and ping-pong, an outdoor patio, and space for live music and DJs.",
    street: "333 1st St N, #150",
    locality: "Jacksonville Beach",
    region: "FL",
    postalCode: "32250",
    instagram: "luckysjaxbch",
  },
];

export function getVenue(slug: string): Venue | null {
  return venues.find((v) => v.slug === slug) ?? null;
}

/** Full display address, e.g. "323 E Bay St, Jacksonville, FL 32202". */
export function venueAddress(v: Venue): string {
  return [v.street, `${v.locality}, ${v.region}${v.postalCode ? ` ${v.postalCode}` : ""}`]
    .filter(Boolean)
    .join(", ");
}
