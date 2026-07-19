import { Reveal } from "./Reveal";
import { splitShows, formatShowDate, type Show } from "@/lib/shows";
import { getPublicShows } from "@/lib/shows-store";

function ShowCard({ show }: { show: Show }) {
  const { weekday, month, day } = formatShowDate(show.date);
  return (
    <div className="flex items-center gap-5 rounded-card border border-line bg-surface/40 p-5 transition-colors duration-200 hover:border-accent/60">
      <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-ink px-2 py-3 text-center">
        <span className="text-xs uppercase tracking-wide text-faint">{weekday}</span>
        <span className="font-display text-2xl font-bold leading-none text-fg">{day}</span>
        <span className="text-xs uppercase tracking-wide text-accent-bright">{month}</span>
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-fg">{show.name}</p>
        <p className="truncate text-sm text-muted">
          {show.venue} · {show.city}
        </p>
        <p className="mt-0.5 text-xs text-faint">{show.time}</p>
      </div>
    </div>
  );
}

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

        {past.length > 0 && (
          <div className="mt-14">
            <Reveal>
              <h3 className="text-sm uppercase tracking-[0.18em] text-faint">
                Recent sets
              </h3>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {past.map((s, i) => (
                <Reveal key={`${s.date}-${i}`} delay={i * 0.05}>
                  <ShowCard show={s} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
