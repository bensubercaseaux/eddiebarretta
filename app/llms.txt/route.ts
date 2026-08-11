import { formatPostDate, posts } from "@/lib/blog";
import { site } from "@/lib/site";
import { venues } from "@/lib/venues";

// Served at /llms.txt — a concise, LLM-friendly index of the site so answer
// engines can describe and cite Eddie accurately. Generated from lib/site.ts
// and lib/venues.ts so it never drifts from the rest of the site. The full
// expansion (every mix, tracklist, venue detail, FAQ) lives at /llms-full.txt.
export const dynamic = "force-static";

const ORIGIN = "https://eddiebarretta.com";

/** Lowercase for mid-sentence use, keeping "DJ" capitalized. */
const lower = (s: string) => s.toLowerCase().replace(/\bdj\b/g, "DJ");

export function GET() {
  const body = `# ${site.name}

> ${site.bioShort}

${site.name} is a ${lower(site.role)} based in ${site.location}, performing across ${site.serviceArea}.

Genres: ${site.genres.join(", ")}

## About
${site.bio.join("\n\n")}

## Pages
- [Home](${ORIGIN}/): bio, latest mixes, upcoming shows, booking
- [Mixes](${ORIGIN}/mixes): the Transcend mix library — every mix with a native player and full tracklist, each at ${ORIGIN}/mixes/<slug>
- [Venues](${ORIGIN}/venues): venues Eddie has played, each at ${ORIGIN}/venues/<slug>
- [Blog — EDM Trends](${ORIGIN}/blog): monthly posts on where the EDM / DJ scene is heading, each at ${ORIGIN}/blog/<slug>
- [Full site content for LLMs](${ORIGIN}/llms-full.txt)

## Music — the Transcend podcast
Transcend is Eddie's house & trance mix series / podcast. Listen on:
- SoundCloud: ${site.socials.soundcloud}
- Apple Podcasts: ${site.podcast.apple}
- Amazon Music: ${site.podcast.amazon}
- YouTube: ${site.podcast.youtube}
- iHeart: ${site.podcast.iheart}
- Podcast RSS: ${ORIGIN}/podcast.rss

## Booking
- Email: ${site.bookingEmail}
- Instagram: ${site.socials.instagram}
- Available for: bar nights, residencies, private events, and parties
- Service area: ${site.serviceArea}

## Social
- Instagram: ${site.socials.instagram}
- TikTok: ${site.socials.tiktok}
- SoundCloud: ${site.socials.soundcloud}
- YouTube: ${site.socials.youtube}
- Google: ${site.googleBusiness}

## Blog — EDM Trends (monthly)
${posts
  .map(
    (p) =>
      `- [${p.title}](${ORIGIN}/blog/${p.slug}) (${formatPostDate(p.date)}): ${p.excerpt}`,
  )
  .join("\n")}

## Venues played
${venues
  .map(
    (v) =>
      `- [${v.name}](${ORIGIN}/venues/${v.slug}): ${v.type} in ${v.area} — ${lower(v.relation)}`,
  )
  .join("\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
