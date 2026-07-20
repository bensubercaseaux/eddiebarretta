import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Music } from "@/components/Music";
import { Watch } from "@/components/Watch";
import { Shows } from "@/components/Shows";
import { Booking } from "@/components/Booking";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
import { splitShows, type Show } from "@/lib/shows";
import { getPublicShows } from "@/lib/shows-store";

const ORIGIN = "https://eddiebarretta.com";
const ACT_ID = `${ORIGIN}/#eddie`;

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
  { name: "Mixes", url: `${ORIGIN}/mixes` },
  { name: "Venues", url: `${ORIGIN}/venues` },
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
          site.googleBusiness,
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
      ...upcoming.map((s) => ({
        "@type": "Event",
        name: `${site.name} — ${s.name}`,
        startDate: s.date,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode:
          "https://schema.org/OfflineEventAttendanceMode",
        performer: { "@id": ACT_ID },
        location: {
          "@type": "Place",
          name: s.venue,
          address: {
            "@type": "PostalAddress",
            addressLocality: s.city,
            addressRegion: "FL",
            addressCountry: "US",
          },
        },
        ...(s.url ? { url: s.url } : {}),
      })),
      {
        "@type": "FAQPage",
        "@id": `${ORIGIN}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What kind of music does Eddie Barretta play?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Eddie Barretta is a house and trance DJ known for euphoric, dancefloor-driven sets.",
            },
          },
          {
            "@type": "Question",
            name: "Where is Eddie Barretta based?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Eddie is based in the Jacksonville Beach, FL area and performs across Jacksonville and Northeast Florida.",
            },
          },
          {
            "@type": "Question",
            name: "How can I book Eddie Barretta to DJ my event?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `You can book Eddie for bar nights, residencies, private events, and parties by emailing ${site.bookingEmail} or messaging @djeddiebarretta on Instagram.`,
            },
          },
          {
            "@type": "Question",
            name: "What is the Transcend podcast?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Transcend is Eddie Barretta's mix series and podcast, featuring his latest house and trance DJ sets.",
            },
          },
        ],
      },
    ],
  };
}

// AI/LLM resource pack published by Geordy at ai.eddiebarretta.com (separate
// A record → Geordy CDN). This Dataset tag points AI crawlers at the generated
// files. `dateModified` is copied from Geordy's snippet — refresh it (or
// re-copy the tag) whenever Geordy regenerates the pack.
const AI_HOST = "https://ai.eddiebarretta.com";
const AI_DATASET_MODIFIED = "2026-07-19";
const AI_FILES = [
  { name: "YAML Configuration", path: "index.yaml", type: "application/yaml" },
  { name: "Markdown Documentation", path: "index.md", type: "text/markdown" },
  { name: "LLMs Configuration (llms.txt)", path: "llms.txt", type: "text/plain" },
  { name: "Schema JSON", path: "index.schema.json", type: "application/ld+json" },
  { name: "RSS Feed", path: "index.xml", type: "application/rss+xml" },
  { name: "Manifest.json", path: "index.manifest.json", type: "application/json" },
  { name: "Humans.txt", path: "humans.txt", type: "text/plain" },
  { name: "OG.json", path: "index.og.json", type: "application/json" },
] as const;

function buildAiDatasetJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "AI/LLM Resource Pack",
    dateModified: AI_DATASET_MODIFIED,
    hasPart: AI_FILES.map((f) => ({
      "@type": "DataDownload",
      name: f.name,
      contentUrl: `${AI_HOST}/${f.path}`,
      encodingFormat: f.type,
      additionalProperty: [
        { "@type": "PropertyValue", name: "audience", value: "LLM" },
        { "@type": "PropertyValue", name: "updateFrequency", value: "weekly" },
      ],
    })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildAiDatasetJsonLd()),
        }}
      />
      <Nav />
      <main>
        <Hero />
        <About />
        <Music />
        <Watch />
        <Shows />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
