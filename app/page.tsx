import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Music } from "@/components/Music";
import { Watch } from "@/components/Watch";
import { Shows } from "@/components/Shows";
import { Booking } from "@/components/Booking";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
import { splitShows } from "@/lib/shows";

const ORIGIN = "https://eddiebarretta.com";
const ACT_ID = `${ORIGIN}/#eddie`;

function buildJsonLd() {
  const { upcoming } = splitShows(new Date());

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicGroup",
        "@id": ACT_ID,
        name: site.name,
        alternateName: "DJ Eddie Barretta",
        genre: ["House", "Trance"],
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

export default function Home() {
  const jsonLd = buildJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
