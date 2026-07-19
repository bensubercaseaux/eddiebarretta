import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { MixCard } from "@/components/mixes/MixCard";
import { PodcastSubscribe } from "@/components/mixes/PodcastSubscribe";
import { getMixes } from "@/lib/mixes-store";

const ORIGIN = "https://eddiebarretta.com";

export const metadata: Metadata = {
  title: "Mixes — Transcend Sessions",
  description:
    "The full Transcend mix library from Eddie Barretta — house & trance DJ sets with complete tracklists. Stream every session.",
  alternates: { canonical: "/mixes" },
  openGraph: {
    type: "website",
    url: `${ORIGIN}/mixes`,
    title: "Mixes — Transcend Sessions | Eddie Barretta",
    description:
      "The full Transcend mix library from Eddie Barretta — house & trance DJ sets with complete tracklists.",
  },
};

export default async function MixesPage() {
  const mixes = await getMixes();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Transcend Mixes",
    url: `${ORIGIN}/mixes`,
    about: { "@id": `${ORIGIN}/#eddie` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: mixes.length,
      itemListElement: mixes.map((mix, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${ORIGIN}/mixes/${mix.slug}`,
        name: mix.title,
      })),
    },
  };

  return (
    <>
      {mixes.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Nav />
      <main className="px-6 pb-24 pt-28 md:pt-32">
        <div className="mx-auto max-w-6xl">
          <header className="max-w-2xl">
            <p className="font-display text-xs font-semibold uppercase tracking-wider text-accent-bright">
              Transcend
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-6xl">
              Mixes
            </h1>
            <p className="mt-4 text-muted">
              Every Transcend session — house &amp; trance sets recorded live and
              in the studio, each with its full tracklist. Hit play on any mix and
              it follows you around the site.
            </p>
          </header>

          <PodcastSubscribe className="mt-10" />

          {mixes.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {mixes.map((mix, i) => (
                <MixCard key={mix.id} mix={mix} priority={i < 4} />
              ))}
            </div>
          ) : (
            <p className="mt-12 text-muted">
              Mixes are temporarily unavailable. Listen on{" "}
              <a
                className="text-accent-bright underline underline-offset-4"
                href="https://soundcloud.com/eddie-barretta"
                target="_blank"
                rel="noopener noreferrer"
              >
                SoundCloud
              </a>
              .
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
