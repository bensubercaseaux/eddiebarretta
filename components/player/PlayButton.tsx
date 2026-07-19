"use client";

import { Pause, Play, SpinnerGap } from "@phosphor-icons/react";
import type { Mix } from "@/lib/mixes";
import { usePlayer } from "./PlayerProvider";

// Circular play/pause toggle bound to a single mix. Reused on the section
// cards (overlaying the artwork) and on the mix detail page (large, inline).

const SIZES = {
  sm: { box: "h-10 w-10", icon: 18 },
  md: { box: "h-12 w-12", icon: 22 },
  lg: { box: "h-16 w-16", icon: 28 },
} as const;

export function PlayButton({
  mix,
  size = "md",
  className = "",
}: {
  mix: Mix;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const { current, isPlaying, isLoading, toggle } = usePlayer();
  const active = current?.id === mix.id;
  const playing = active && isPlaying;
  const loading = active && isLoading;
  const { box, icon } = SIZES[size];

  return (
    <button
      type="button"
      onClick={() => toggle(mix)}
      aria-pressed={playing}
      aria-label={playing ? `Pause ${mix.title}` : `Play ${mix.title}`}
      className={`inline-flex ${box} shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition-transform duration-200 hover:scale-105 hover:bg-accent-bright active:scale-95 ${className}`}
    >
      {loading ? (
        <SpinnerGap size={icon} weight="bold" className="animate-spin" />
      ) : playing ? (
        <Pause size={icon} weight="fill" />
      ) : (
        <Play size={icon} weight="fill" className="translate-x-[1px]" />
      )}
    </button>
  );
}
