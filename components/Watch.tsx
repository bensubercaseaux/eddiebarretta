import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { WatchShelf } from "./WatchShelf";
import { site } from "@/lib/site";
import { getWatchVideos } from "@/lib/videos-store";

// Vertical-clip shelf fed by the Watch playlist (lib/videos-store.ts). All
// clips are 9:16 Shorts — landscape uploads are filtered out at the feed
// level — so they render at their native aspect ratio in a horizontal
// snap-scroll strip that bleeds to the section edge.
export async function Watch() {
  const videos = await getWatchVideos();
  if (videos.length === 0) return null;

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

        <div className="mt-10">
          <WatchShelf videos={videos} />
        </div>
      </div>
    </section>
  );
}
