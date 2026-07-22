import { Reveal } from "./Reveal";
import { splitShows } from "@/lib/shows";
import { getPublicShows } from "@/lib/shows-store";
import { PastSets } from "./PastSets";
import { ShowCard } from "./ShowCard";

export async function Shows() {
  const { upcoming, past } = splitShows(new Date(), await getPublicShows());

  return (
    <section
      id="shows"
      className="border-t border-line bg-surface/30 px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Shows
            </h2>
            <a
              href="#book"
              className="rounded-full border border-line px-5 py-2 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent-bright"
            >
              Book Eddie
            </a>
          </div>
        </Reveal>

        {upcoming.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {upcoming.map((s, i) => (
              <Reveal key={`${s.date}-${i}`} delay={i * 0.06}>
                <ShowCard show={s} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="mt-8">
            <p className="text-muted">
              No public dates on the calendar right now. Want Eddie at your venue
              or event?{" "}
              <a href="#book" className="text-accent-bright underline-offset-4 hover:underline">
                Get a date booked.
              </a>
            </p>
          </Reveal>
        )}

        {past.length > 0 && <PastSets shows={past} />}
      </div>
    </section>
  );
}
