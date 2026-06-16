import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

export function Music() {
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
                Transcend Mixes — the latest house &amp; trance sessions, straight
                from the decks.
              </p>
            </div>
            <a
              href={site.socials.soundcloud}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg"
            >
              All mixes on SoundCloud
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="overflow-hidden rounded-[16px] border border-line bg-ink">
            <iframe
              title="Eddie Barretta — Transcend Mixes on SoundCloud"
              width="100%"
              height="450"
              allow="autoplay"
              loading="lazy"
              src={site.soundcloudPlaylistEmbed}
              className="block w-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
