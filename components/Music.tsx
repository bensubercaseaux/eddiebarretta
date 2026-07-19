import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { FeaturedMix } from "./mixes/FeaturedMix";
import { MixCard } from "./mixes/MixCard";
import { PodcastSubscribe } from "./mixes/PodcastSubscribe";
import { site } from "@/lib/site";
import { getMixes } from "@/lib/mixes-store";

// How many recent mixes to show in the grid beneath the featured one. The full
// library lives at /mixes.
const GRID_COUNT = 6;

export async function Music() {
  const mixes = await getMixes();
  const [featured, ...rest] = mixes;
  const grid = rest.slice(0, GRID_COUNT);

  return (
    <section
      id="music"
      className="border-t border-line bg-surface/30 px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                Listen
              </h2>
              <p className="mt-3 max-w-md text-muted">
                Transcend — the latest house &amp; trance sessions, straight from
                the decks. Full tracklists included.
              </p>
            </div>
            <a
              href={site.socials.soundcloud}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg"
            >
              Follow on SoundCloud
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </Reveal>

        {featured ? (
          <>
            <Reveal delay={0.1} className="mt-10">
              <FeaturedMix mix={featured} />
            </Reveal>

            {grid.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                {grid.map((mix, i) => (
                  <Reveal key={mix.id} delay={0.1 + i * 0.06}>
                    <MixCard mix={mix} />
                  </Reveal>
                ))}
              </div>
            )}

            <Reveal className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/mixes"
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/50 hover:bg-surface-2"
              >
                Browse all {mixes.length} mixes
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Reveal>

            <Reveal className="mt-8">
              <PodcastSubscribe />
            </Reveal>
          </>
        ) : (
          // Feed unavailable — keep a working path to the music.
          <Reveal delay={0.1} className="mt-10">
            <a
              href={site.socials.soundcloud}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-bright"
            >
              Listen on SoundCloud
              <ArrowUpRight size={18} />
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
