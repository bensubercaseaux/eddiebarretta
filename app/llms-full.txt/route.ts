import { formatPostDate, posts } from "@/lib/blog";
import { faq, site } from "@/lib/site";
import { venueAddress, venues } from "@/lib/venues";
import { formatMixDate } from "@/lib/mixes";
import { getMixes } from "@/lib/mixes-store";
import { splitShows } from "@/lib/shows";
import { getPublicShows } from "@/lib/shows-store";

// Served at /llms-full.txt — the llms.txt convention's full-content companion:
// everything on the site (bio, FAQ, every venue with details, every Transcend
// mix with its tracklist, upcoming shows) in one plain-text document, so answer
// engines can ingest the whole site without crawling it. /llms.txt stays the
// concise index; this is the expansion it links to.
//
// Mixes come from the live SoundCloud feed and shows from Blob, so this can't
// be force-static like /llms.txt — the same 5m revalidate as /podcast.rss keeps
// it current without hitting the feed per-request.
export const revalidate = 300;

const ORIGIN = "https://eddiebarretta.com";

/** Lowercase for mid-sentence use, keeping "DJ" capitalized. */
const lower = (s: string) => s.toLowerCase().replace(/\bdj\b/g, "DJ");

export async function GET() {
  const [mixes, shows] = await Promise.all([getMixes(), getPublicShows()]);
  const { upcoming } = splitShows(new Date(), shows);

  const showsSection = upcoming.length
    ? upcoming
        .map(
          (s) => `- ${s.date}, ${s.time} — ${s.name} at ${s.venue}, ${s.city}`,
        )
        .join("\n")
    : `No public shows are currently announced. Booking inquiries: ${site.bookingEmail}`;

  const venuesSection = venues
    .map((v) =>
      [
        `### ${v.name}`,
        `- Page: ${ORIGIN}/venues/${v.slug}`,
        `- Type: ${v.type} in ${v.area}`,
        `- Address: ${venueAddress(v)}`,
        ...(v.website ? [`- Website: ${v.website}`] : []),
        `- Relationship: ${v.relation} — ${v.relationText}`,
        ``,
        v.summary,
      ].join("\n"),
    )
    .join("\n\n");

  const mixesSection = mixes
    .map((m) =>
      [
        `### ${m.title}`,
        `- Released: ${formatMixDate(m.date)} · Duration: ${m.durationLabel}`,
        `- Page: ${ORIGIN}/mixes/${m.slug}`,
        `- SoundCloud: ${m.permalink}`,
        ...(m.intro ? [``, m.intro] : []),
        ...(m.tracks.length
          ? [
              ``,
              `Tracklist:`,
              // Strip the [@handle] link tags — plain artist/title reads best here.
              ...m.tracks.map(
                (t, i) => `${i + 1}. ${t.replace(/\s*\[@[^\]]+\]/g, "")}`,
              ),
            ]
          : []),
      ].join("\n"),
    )
    .join("\n\n");

  const blogSection = posts
    .map((p) =>
      [
        `### ${p.title}`,
        `- Page: ${ORIGIN}/blog/${p.slug}`,
        `- Published: ${formatPostDate(p.date)} · Topic: ${p.tag}`,
        ``,
        ...p.intro,
        ...p.sections.flatMap((s) => [``, `**${s.heading}**`, ...s.paragraphs]),
        ``,
        p.outro,
      ].join("\n"),
    )
    .join("\n\n");

  const body = `# ${site.name} — full site content

> ${site.bioShort}

${site.name} is a ${lower(site.role)} based in ${site.location}, performing across ${site.serviceArea}. This document is the full-content companion to ${ORIGIN}/llms.txt, covering everything on ${ORIGIN}.

Genres: ${site.genres.join(", ")}

## About
${site.bio.join("\n\n")}

## Booking
- Email: ${site.bookingEmail}
- Instagram: ${site.socials.instagram}
- Available for: bar nights, residencies, private events, and parties
- Service area: ${site.serviceArea}

## Social & listening
- Instagram: ${site.socials.instagram}
- TikTok: ${site.socials.tiktok}
- SoundCloud: ${site.socials.soundcloud}
- YouTube: ${site.socials.youtube}
- Google: ${site.googleBusiness}

The Transcend podcast (Eddie's house & trance mix series) is distributed on:
- SoundCloud: ${site.podcast.soundcloud}
- Apple Podcasts: ${site.podcast.apple}
- Amazon Music: ${site.podcast.amazon}
- YouTube: ${site.podcast.youtube}
- iHeart: ${site.podcast.iheart}
- Podcast RSS: ${ORIGIN}/podcast.rss

## FAQ
${faq.map((f) => `**${f.question}**\n${f.answer}`).join("\n\n")}

## Upcoming shows
${showsSection}

## Venues Eddie has played
Directory: ${ORIGIN}/venues

${venuesSection}

## Transcend mixes
Library: ${ORIGIN}/mixes

${mixesSection}

## Blog — EDM Trends (one post a month)
Index: ${ORIGIN}/blog

${blogSection}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
