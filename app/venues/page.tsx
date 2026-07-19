import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { venues } from "@/lib/venues";

const ORIGIN = "https://eddiebarretta.com";

export const metadata: Metadata = {
  title: "Venues — Where Eddie Barretta Plays",
  description:
    "Bars, rooftops, lounges, and nightclubs across Jacksonville and the Beaches where DJ Eddie Barretta has held residencies and played sets.",
  alternates: { canonical: "/venues" },
  openGraph: {
    type: "website",
    url: `${ORIGIN}/venues`,
    title: "Venues — Where Eddie Barretta Plays | Jacksonville & the Beaches",
    description:
      "Bars, rooftops, lounges, and nightclubs across Jacksonville and the Beaches where DJ Eddie Barretta has played.",
  },
};

export default function VenuesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Venues where Eddie Barretta plays",
    numberOfItems: venues.length,
    itemListElement: venues.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${ORIGIN}/venues/${v.slug}`,
      name: v.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="px-6 pb-24 pt-28 md:pt-32">
        <div className="mx-auto max-w-5xl">
          <header className="max-w-2xl">
            <p className="font-display text-xs font-semibold uppercase tracking-wider text-accent-bright">
              Jacksonville &amp; the Beaches
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-6xl">
              Venues
            </h1>
            <p className="mt-4 text-muted">
              Rooftops, beach bars, lounges, and nightclubs where Eddie Barretta
              has held residencies and played house &amp; trance across Northeast
              Florida.
            </p>
          </header>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {venues.map((v) => (
              <Link
                key={v.slug}
                href={`/venues/${v.slug}`}
                className="group flex flex-col rounded-card border border-line bg-surface/40 p-5 transition-colors hover:border-accent/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl font-bold text-fg transition-colors group-hover:text-accent-bright">
                    {v.name}
                  </h2>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-faint">
                  <MapPin size={13} weight="fill" className="text-accent-bright" />
                  {v.area} · {v.type}
                </p>
                <p className="mt-3 line-clamp-3 text-sm text-muted">{v.summary}</p>
                <span className="mt-3 inline-block text-xs font-medium uppercase tracking-wider text-accent-bright">
                  {v.relation}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
