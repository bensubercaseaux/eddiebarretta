import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { LiteYouTube } from "./LiteYouTube";
import { site } from "@/lib/site";

export function Watch() {
  const [featured, ...rest] = site.youtubeVideos;

  return (
    <section id="watch" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Watch
            </h2>
            <a
              href={site.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg"
            >
              More on YouTube
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <LiteYouTube id={featured} title="Eddie Barretta — featured set" />
        </Reveal>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {rest.map((id, i) => (
            <Reveal key={id} delay={0.15 + i * 0.08}>
              <LiteYouTube id={id} title={`Eddie Barretta — set ${i + 2}`} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
