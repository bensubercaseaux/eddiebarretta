import { formatShowDate, type Show } from "@/lib/shows";

export function ShowCard({ show }: { show: Show }) {
  const { weekday, month, day } = formatShowDate(show.date);
  return (
    <div className="flex items-center gap-5 rounded-card border border-line bg-surface/40 p-5 transition-colors duration-200 hover:border-accent/60">
      <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-ink px-2 py-3 text-center">
        <span className="text-xs uppercase tracking-wide text-faint">{weekday}</span>
        <span className="font-display text-2xl font-bold leading-none text-fg">{day}</span>
        <span className="text-xs uppercase tracking-wide text-accent-bright">{month}</span>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-fg">{show.name}</p>
          {show.privateEvent && (
            <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[11px] uppercase tracking-wide text-faint">
              Private
            </span>
          )}
        </div>
        <p className="truncate text-sm text-muted">
          {show.venue} · {show.city}
        </p>
        <p className="mt-0.5 text-xs text-faint">{show.time}</p>
      </div>
    </div>
  );
}
