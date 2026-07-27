"use client";

import Image from "next/image";
import Link from "next/link";
import { SoundcloudLogo, SpeakerSimpleSlash, X } from "@phosphor-icons/react";
import { formatClock } from "@/lib/mixes";
import { usePlayer } from "./PlayerProvider";
import { PlayButton } from "./PlayButton";

function Scrubber({
  value,
  max,
  onSeek,
}: {
  value: number;
  max: number;
  onSeek: (seconds: number) => void;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <input
      type="range"
      min={0}
      max={max || 0}
      step={1}
      value={Math.min(value, max || 0)}
      onChange={(e) => onSeek(Number(e.target.value))}
      aria-label="Seek within mix"
      className="player-range h-1.5 w-full cursor-pointer appearance-none rounded-full"
      style={{
        background: `linear-gradient(to right, var(--accent) ${pct}%, var(--line) ${pct}%)`,
      }}
    />
  );
}

export function NowPlayingBar() {
  const { current, currentTime, duration, isMuted, seek, unmute, dismiss } =
    usePlayer();
  if (!current) return null;

  const max = duration || current.durationSeconds || 0;

  return (
    <div className="motion-safe:animate-slide-up fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-6">
        <Link
          href={`/mixes/${current.slug}`}
          className="group flex min-w-0 items-center gap-3"
        >
          <Image
            src={current.artwork}
            alt=""
            width={48}
            height={48}
            className="h-11 w-11 rounded-md border border-line object-cover sm:h-12 sm:w-12"
          />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-fg transition-colors group-hover:text-accent-bright">
              {current.title}
            </p>
            <p className="truncate text-xs text-faint">
              Transcend · {current.durationLabel}
            </p>
          </div>
        </Link>

        <PlayButton mix={current} size="sm" className="shadow-none" />

        {/* The arrival autoplay is silent by browser mandate, so this is the
            only thing telling the visitor sound is on offer. It sits beside the
            play button rather than in the icon cluster on the right, where it
            would read as a minor control. */}
        {isMuted && (
          <button
            type="button"
            onClick={unmute}
            aria-label={`Turn on sound for ${current.title}`}
            className="animate-sound-pulse inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3 py-2 text-xs font-semibold text-white transition-transform duration-200 hover:scale-105 hover:bg-accent-bright active:scale-95 sm:px-4 sm:text-sm"
          >
            <SpeakerSimpleSlash size={16} weight="fill" />
            <span className="hidden sm:inline">Tap for sound</span>
            <span className="sm:hidden">Sound</span>
          </button>
        )}

        <div className="hidden flex-1 items-center gap-3 md:flex">
          <span className="w-11 text-right text-xs tabular-nums text-faint">
            {formatClock(currentTime)}
          </span>
          <Scrubber value={currentTime} max={max} onSeek={seek} />
          <span className="w-11 text-xs tabular-nums text-faint">
            {formatClock(max)}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <a
            href={current.permalink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${current.title} on SoundCloud`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <SoundcloudLogo size={20} />
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close player"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Full-width scrubber on mobile, where the inline one is hidden. */}
      <div className="flex items-center gap-2 px-4 pb-2 md:hidden">
        <span className="w-10 text-right text-[11px] tabular-nums text-faint">
          {formatClock(currentTime)}
        </span>
        <Scrubber value={currentTime} max={max} onSeek={seek} />
        <span className="w-10 text-[11px] tabular-nums text-faint">
          {formatClock(max)}
        </span>
      </div>
    </div>
  );
}
