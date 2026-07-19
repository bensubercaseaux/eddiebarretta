import type { Mix } from "@/lib/mixes";
import { parseTrackParts } from "@/lib/mixes";

// Numbered tracklist, two columns on wider screens. Artist names that carry a
// SoundCloud @handle become links to that profile (new tab). Server-safe (no
// client hooks) so both the featured mix and the detail page can render it.
export function Tracklist({
  tracks,
  className = "",
}: {
  tracks: Mix["tracks"];
  className?: string;
}) {
  if (tracks.length === 0) return null;

  return (
    <ol className={`grid gap-x-8 gap-y-2 sm:grid-cols-2 ${className}`}>
      {tracks.map((track, i) => (
        <li key={`${i}-${track}`} className="flex gap-3 text-sm">
          <span className="w-5 shrink-0 text-right font-display text-xs tabular-nums text-faint">
            {i + 1}
          </span>
          <span className="text-muted">
            {parseTrackParts(track).map((part, j) =>
              part.href ? (
                <a
                  key={j}
                  href={part.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg underline decoration-accent/50 decoration-1 underline-offset-2 transition-colors hover:text-accent-bright hover:decoration-accent-bright"
                >
                  {part.text}
                </a>
              ) : (
                <span key={j}>{part.text}</span>
              ),
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}
