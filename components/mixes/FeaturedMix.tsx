"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart } from "@phosphor-icons/react";
import type { Mix } from "@/lib/mixes";
import { formatMixDate } from "@/lib/mixes";
import { PlayButton } from "@/components/player/PlayButton";
import { Tracklist } from "./Tracklist";

const PREVIEW_COUNT = 8;

// The newest mix, showcased: big artwork + play, description, and the tracklist
// right there on the page (truncated with a toggle when it's long).
export function FeaturedMix({ mix }: { mix: Mix }) {
  const [showAll, setShowAll] = useState(false);
  const hasMore = mix.tracks.length > PREVIEW_COUNT;
  const visible = showAll ? mix.tracks : mix.tracks.slice(0, PREVIEW_COUNT);

  return (
    <div className="grid gap-8 rounded-card border border-line bg-surface p-5 sm:p-6 md:grid-cols-[300px_1fr] md:gap-10 lg:grid-cols-[340px_1fr]">
      <div className="md:sticky md:top-24 md:self-start">
        <div className="group relative aspect-square overflow-hidden rounded-[12px] border border-line">
          <Image
            src={mix.artwork}
            alt={`${mix.title} — Transcend mix artwork`}
            fill
            sizes="(max-width: 768px) 100vw, 340px"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <PlayButton mix={mix} size="lg" />
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-accent-bright">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-bright" />
          Latest mix
        </div>

        <h3 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
          {mix.title}
        </h3>
        <p className="mt-2 text-sm text-faint">
          {formatMixDate(mix.date)} · {mix.durationLabel}
          {mix.tracks.length > 0 ? ` · ${mix.tracks.length} tracks` : ""}
        </p>

        {mix.intro && (
          <p className="mt-4 max-w-prose whitespace-pre-line text-muted">
            {mix.intro}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link
            href={`/mixes/${mix.slug}`}
            className="group inline-flex items-center gap-1.5 font-medium text-fg transition-colors hover:text-accent-bright"
          >
            Mix details
            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <a
            href={mix.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group/like inline-flex items-center gap-1.5 font-medium text-muted transition-colors hover:text-accent-bright"
          >
            <Heart
              size={18}
              className="transition-transform duration-200 group-hover/like:scale-110"
            />
            Like on SoundCloud
          </a>
        </div>

        {mix.tracks.length > 0 && (
          <div className="mt-6 border-t border-line pt-5">
            <p className="mb-3 font-display text-xs font-semibold uppercase tracking-wider text-faint">
              Tracklist
            </p>
            <Tracklist tracks={visible} />
            {hasMore && (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="mt-3 text-sm font-medium text-accent-bright transition-colors hover:text-fg"
              >
                {showAll
                  ? "Show fewer"
                  : `Show all ${mix.tracks.length} tracks`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
