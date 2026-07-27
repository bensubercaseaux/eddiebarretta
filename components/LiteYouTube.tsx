"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "@phosphor-icons/react";

// Click-to-load YouTube facade: renders a lightweight thumbnail + play button
// and only injects the (heavy) iframe once the visitor actually hits play. Cuts
// the third-party JS/network cost of the Watch section on initial load.
// Vertical (Shorts) videos use YouTube's true 9:16 poster (oar2.jpg) instead of
// the 16:9 hqdefault, so nothing gets cropped or letterboxed.
// Pass `onActivate` to hand the click off instead of embedding in place — the
// Watch shelf uses it to open the clip in a lightbox.
export function LiteYouTube({
  id,
  title,
  vertical = false,
  priority = false,
  onActivate,
}: {
  id: string;
  title: string;
  vertical?: boolean;
  priority?: boolean;
  onActivate?: () => void;
}) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-card border border-line bg-surface ${
        vertical ? "aspect-[9/16]" : "aspect-video"
      }`}
    >
      {active ? (
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1&playsinline=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => (onActivate ? onActivate() : setActive(true))}
          aria-label={`Play ${title}`}
          {...(onActivate ? { "aria-haspopup": "dialog" as const } : {})}
          className="group absolute inset-0 h-full w-full"
        >
          <Image
            src={`https://i.ytimg.com/vi/${id}/${vertical ? "oar2" : "hqdefault"}.jpg`}
            alt=""
            fill
            sizes={
              vertical
                ? "(max-width: 640px) 70vw, 260px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 700px"
            }
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-ink/20 transition-colors group-hover:bg-ink/10" />
          <span
            className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition-transform duration-200 group-hover:scale-105 ${
              vertical ? "h-13 w-13" : "h-16 w-16"
            }`}
          >
            <Play
              size={vertical ? 24 : 28}
              weight="fill"
              className="translate-x-[1px]"
            />
          </span>
        </button>
      )}
    </div>
  );
}
