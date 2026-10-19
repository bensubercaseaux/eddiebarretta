import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { AnswerBlock } from "@/components/AnswerBlock";
import { About } from "@/components/About";
import { Music } from "@/components/Music";
import { Watch } from "@/components/Watch";
import { Shows } from "@/components/Shows";
import { Booking } from "@/components/Booking";
import { Faq } from "@/components/Faq";
import { Blog } from "@/components/Blog";
import { Footer } from "@/components/Footer";
import { faq, site } from "@/lib/site";
import { showSchedule, splitShows, type Show } from "@/lib/shows";
import { getPublicShows } from "@/lib/shows-store";
import { venues, type Venue } from "@/lib/venues";

const ORIGIN = "https://eddiebarretta.com";
const ACT_ID = `${ORIGIN}/#eddie`;
const ACT_IMAGE = `${ORIGIN}/hero.png`;

// Shows store the venue as free text ("Surfer Bar"); match it to the researched
// venue record ("Surfer [The Bar]") so Event markup can carry a street address.
const venueKey = (name: string) =>
  name.toLowerCase().replace(/\bthe\b/g, "").replace(/[^a-z0-9]/g, "");
function findVenue(name: string): Venue | undefined {
  const key = venueKey(name);
  if (key.length < 3) return undefined; // "The" would prefix-match every venue
  return venues.find((v) => {
    const vk = venueKey(v.name);
    return vk === key || vk.startsWith(key) || key.startsWith(vk);
  });
}

// Primary navigation, exposed as SiteNavigationElement so search engines can see
// the site's sections/pages explicitly — the structure Google draws on for the
// "jump to section" sitelinks under a listing. Includes the home-page anchors
// plus the real sub-pages (/mixes, /venues), which are strong sitelink targets.
const NAV_SECTIONS = [
  { name: "About", url: `${ORIGIN}/#about` },
  { name: "Music", url: `${ORIGIN}/#music` },
  { name: "Watch", url: `${ORIGIN}/#watch` },
  { name: "Shows", url: `${ORIGIN}/#shows` },
  { name: "Book", url: `${ORIGIN}/#book` },
  { name: "FAQ", url: `${ORIGIN}/#faq` },
  { name: "Mixes", url: `${ORIGIN}/mixes` },
  { name: "Venues", url: `${ORIGIN}/venues` },
  { name: "Blog", url: `${ORIGIN}/blog` },
];

function buildJsonLd(shows: Show[]) {
  const { upcoming } = splitShows(new Date(), shows);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicGroup",
        "@id": ACT_ID,
        name: site.name,
        alternateName: "DJ Eddie Barretta",
        genre: [...site.genres],
        url: ORIGIN,
        image: `${ORIGIN}/hero.png`,
        description: site.bioShort,
        areaServed: site.serviceArea,
        ...(site.phone ? { telephone: site.phone.e164 } : {}),
        // Hours belong on the booking ContactPoint: MusicGroup is an
        // Organization, which has no openingHoursSpecification of its own.
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "booking",
          ...(site.phone ? { telephone: site.phone.e164 } : {}),
          email: site.bookingEmail,
          url: `${ORIGIN}/#book`,
          hoursAvailable: site.lineHours.spec.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
            opens: h.opens,
            closes: h.closes,
          })),
        },
        location: {
          "@type": "Place",
          name: "Jacksonville Beach, FL",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Jacksonville Beach",
            addressRegion: "FL",
            addressCountry: "US",
          },
        },
        makesOffer: {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "DJ booking",
            serviceType:
              "House & trance DJ for bars, clubs, residencies, and private events",
          },
          areaServed: site.serviceArea,
        },
        sameAs: [
          site.socials.instagram,
          site.socials.tiktok,
          site.socials.soundcloud,
          site.socials.youtube,
          ...(site.googleMapsUrl ? [site.googleMapsUrl] : []),
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${ORIGIN}/#website`,
        url: ORIGIN,
        name: site.name,
        description: site.bioShort,
        publisher: { "@id": ACT_ID },
      },
      ...NAV_SECTIONS.map((s) => ({
        "@type": "SiteNavigationElement",
        name: s.name,
        url: s.url,
      })),
      ...upcoming.map((s) => {
        const v = findVenue(s.venue);
        return {
          "@type": "Event",
          name: `${site.name} — ${s.name}`,
          description: `${site.role} ${site.name} live at ${s.venue}, ${s.city} (${s.time}).`,
          image: ACT_IMAGE,
          ...showSchedule(s),
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode:
            "https://schema.org/OfflineEventAttendanceMode",
          // Google's Events report doesn't resolve a bare @id — the performer
          // needs its own name.
          performer: {
            "@type": "MusicGroup",
            "@id": ACT_ID,
            name: site.name,
            url: ORIGIN,
          },
          organizer: {
            "@type": "Organization",
            name: v?.name ?? s.venue,
            ...(v?.website ? { url: v.website } : {}),
          },
          location: {
            "@type": "Place",
            name: s.venue,
            address: {
              "@type": "PostalAddress",
              ...(v?.street ? { streetAddress: v.street } : {}),
              addressLocality: s.city,
              addressRegion: "FL",
              ...(v?.postalCode ? { postalCode: v.postalCode } : {}),
              addressCountry: "US",
            },
          },
          url: s.url ?? `${ORIGIN}/#shows`,
        };
      }),
      {
        // Mirrors the visible <Faq /> section — both render from lib/site.ts.
        "@type": "FAQPage",
        "@id": `${ORIGIN}/#faq`,
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };
}

export default async function Home() {
  const jsonLd = buildJsonLd(await getPublicShows());

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        <Hero>
          <AnswerBlock />
        </Hero>
        <About />
        <Music />
        <Watch />
        <Shows />
        <Booking />
        <Blog />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
