"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { Reveal } from "./Reveal";
import { LiteYouTube } from "./LiteYouTube";
import { VideoLightbox } from "./VideoLightbox";

// Horizontal snap-scroll strip of 9:16 clips. The scrollbar is hidden, so
// desktop mouse users get paging arrows (touch/trackpad users just swipe);
// each arrow fades out at its end of the strip. Clicking a card plays it in a
// lightbox rather than inline, so a 9:16 clip gets real height instead of a
// 208px-wide card.
export function WatchShelf({
  videos,
}: {
  videos: { id: string; title: string }[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = scrollerRef.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    // Nearly a full viewport per click; the 96px overlap keeps one card in
    // view across the jump for continuity.
    el?.scrollBy({
      left: dir * (el.clientWidth - 96),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="scrollbar-none -mx-6 flex snap-x gap-4 overflow-x-auto scroll-px-6 px-6 pb-2"
      >
        {videos.map((video, i) => (
          <Reveal
            key={video.id}
            delay={Math.min(0.1 + i * 0.06, 0.4)}
            className="w-52 shrink-0 snap-start sm:w-60"
          >
            <LiteYouTube
              id={video.id}
              title={video.title}
              vertical
              onActivate={() => setOpenIndex(i)}
            />
            <p className="mt-2.5 truncate text-sm text-muted">{video.title}</p>
          </Reveal>
        ))}
      </div>

      {(
        [
          { dir: -1, enabled: canLeft, label: "Scroll videos left", Icon: CaretLeft, pos: "-left-3" },
          { dir: 1, enabled: canRight, label: "Scroll videos right", Icon: CaretRight, pos: "-right-3" },
        ] as const
      ).map(({ dir, enabled, label, Icon, pos }) => (
        <button
          key={dir}
          type="button"
          onClick={() => page(dir)}
          aria-label={label}
          className={`absolute top-1/2 ${pos} hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface/90 text-fg shadow-lg shadow-ink/40 backdrop-blur transition-all duration-200 hover:border-accent hover:text-accent-bright md:flex ${
            enabled ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Icon size={20} weight="bold" />
        </button>
      ))}

      <VideoLightbox
        videos={videos}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </div>
  );
}
