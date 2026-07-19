"use client";

import Image from "next/image";
import Link from "next/link";
import { MusicNotes } from "@phosphor-icons/react";
import type { Mix } from "@/lib/mixes";
import { formatMixDate } from "@/lib/mixes";
import { PlayButton } from "@/components/player/PlayButton";
import { usePlayer } from "@/components/player/PlayerProvider";

// Compact mix card: artwork with a play overlay, meta below. The whole card
// links to the detail page (full tracklist); the play button plays in place.
export function MixCard({ mix, priority = false }: { mix: Mix; priority?: boolean }) {
  const { current, isPlaying } = usePlayer();
  const active = current?.id === mix.id;

  return (
    <div className="group relative overflow-hidden rounded-card border border-line bg-surface transition-colors hover:border-accent/40">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={mix.artwork}
          alt={`${mix.title} — Transcend mix artwork`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-80" />

        {/* Play button: always visible on the active mix, hover/focus otherwise */}
        <div
          className={`absolute bottom-3 right-3 transition-all duration-200 ${
            active
              ? "opacity-100"
              : "opacity-0 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:opacity-100"
          }`}
        >
          <PlayButton mix={mix} size="md" />
        </div>

        <span className="absolute bottom-3 left-3 rounded-full bg-ink/70 px-2 py-0.5 text-xs font-medium tabular-nums text-fg backdrop-blur">
          {mix.durationLabel}
        </span>
      </div>

      <div className="p-4">
        <Link
          href={`/mixes/${mix.slug}`}
          className="font-display text-lg font-bold leading-tight text-fg transition-colors hover:text-accent-bright"
        >
          {mix.title}
        </Link>
        <p className="mt-1 flex items-center gap-2 text-xs text-faint">
          <span>{formatMixDate(mix.date)}</span>
          {mix.tracks.length > 0 && (
            <>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <MusicNotes size={12} weight="fill" />
                {mix.tracks.length} tracks
              </span>
            </>
          )}
          {active && isPlaying && (
            <>
              <span aria-hidden>·</span>
              <span className="text-accent-bright">Playing</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
