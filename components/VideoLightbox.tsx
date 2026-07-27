"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";

// Full-screen player for the Watch shelf: the clip plays large and centered
// while the rest of the page is dimmed and blurred behind it. Portalled to
// <body> because the shelf's cards sit inside a transformed ancestor (Reveal's
// translateY) and an overflow-x-auto scroller — a `fixed` child of either would
// be positioned/clipped relative to that ancestor instead of the viewport.
//
// z-55 is deliberate: above the nav and now-playing bar (both z-50), below the
// film grain (z-60) so the overlay keeps the same texture as the rest of the
// site. Grain is pointer-events:none, so it never eats a click.
//
// The overlay element itself carries role="dialog"/aria-modal, not the video
// panel — the close and prev/next controls are pinned to the viewport rather
// than the panel, and aria-modal on the panel would hide them from assistive
// tech along with the rest of the page.

// Matches Reveal's curve so the modal feels like the same site.
const EASE = [0.16, 1, 0.3, 1] as const;

const CONTROL =
  "flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface/90 text-fg backdrop-blur transition-[color,border-color,transform] duration-150 hover:border-accent hover:text-accent-bright active:scale-97";

export function VideoLightbox({
  videos,
  index,
  onIndexChange,
  onClose,
}: {
  videos: { id: string; title: string }[];
  /** Index of the open clip, or null when closed. */
  index: number | null;
  onIndexChange: (next: number) => void;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = index !== null;
  // Bundled so the JSX below narrows the clip and its position together.
  const current = index === null ? null : { at: index, video: videos[index] };

  const step = useCallback(
    (dir: 1 | -1) => {
      if (index === null || videos.length < 2) return;
      // Wrap, so arrowing past either end keeps going rather than dead-ending.
      onIndexChange((index + dir + videos.length) % videos.length);
    },
    [index, videos.length, onIndexChange],
  );

  // Lock page scroll while open, compensating for the scrollbar's width so the
  // page underneath doesn't jump sideways as it disappears.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [open]);

  // Move focus in on open and hand it back to the card that opened it on close,
  // so keyboard and screen-reader users aren't dropped at the top of the page.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => opener?.focus?.();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        step(e.key === "ArrowRight" ? 1 : -1);
        return;
      }
      if (e.key !== "Tab") return;
      // Keep Tab inside the overlay.
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      const inside = dialogRef.current?.contains(active) ?? false;
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, step]);

  // No mounted flag needed: the shelf always starts closed, so both the server
  // render and the first client render produce nothing either side of the
  // portal — there's no markup to mismatch.
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {current && (
        <motion.div
          key="watch-lightbox"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${current.video.title} — video player`}
          className="fixed inset-0 z-[55]"
          // The exit animation lives on this element — AnimatePresence's direct
          // child — because that's what gates unmount. With `exit` only on
          // nested children the overlay never came back off the page, which left
          // a hidden, still-playing YouTube iframe in the DOM after close.
          // Exit is quicker than enter: the user has already decided to go.
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.16, ease: EASE } }}
          transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
        >
          <div
            // Dim *and* blur — dimming alone still leaves the shelf legible
            // behind the clip, and the blur is what actually pushes it back.
            className="absolute inset-0 bg-ink/80 backdrop-blur-md"
            onClick={onClose}
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              className="pointer-events-auto flex flex-col items-center"
              // Never scale from 0 — a small offset plus opacity reads as the
              // panel arriving rather than materialising out of nothing. No
              // `exit` here: the parent's fade covers leaving, and an exit on a
              // nested child is what stalled unmount before.
              initial={reduce ? false : { opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.24, ease: EASE }}
            >
              {/* Width is derived from the height cap so a 9:16 clip always
                  fits the viewport without letterboxing inside the card. */}
              <div className="relative w-[min(92vw,calc(78dvh*9/16))] overflow-hidden rounded-card border border-line bg-surface shadow-2xl shadow-ink/60">
                <div className="aspect-[9/16]">
                  {/* Keyed by id so stepping to the next clip remounts the embed
                      and autoplays it. No transition on the swap — arrow keys
                      get pressed repeatedly, and animating that feels laggy. */}
                  <iframe
                    key={current.video.id}
                    title={current.video.title}
                    src={`https://www.youtube-nocookie.com/embed/${current.video.id}?rel=0&autoplay=1&playsinline=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>

              <div className="mt-3 flex max-w-[min(92vw,26rem)] flex-col items-center gap-0.5 text-center">
                <p className="text-sm text-fg">{current.video.title}</p>
                {videos.length > 1 && (
                  <p className="text-xs text-faint">
                    {current.at + 1} of {videos.length}
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Controls are pinned to the viewport, not the panel, so they never
              crowd a tall 9:16 clip on a small screen. */}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className={`absolute right-3 top-3 md:right-6 md:top-6 ${CONTROL}`}
          >
            <X size={20} weight="bold" />
          </button>

          {videos.length > 1 &&
            (
              [
                { dir: -1, label: "Previous video", Icon: CaretLeft, pos: "left-2 md:left-6" },
                { dir: 1, label: "Next video", Icon: CaretRight, pos: "right-2 md:right-6" },
              ] as const
            ).map(({ dir, label, Icon, pos }) => (
              <button
                key={dir}
                type="button"
                onClick={() => step(dir)}
                aria-label={label}
                className={`absolute top-1/2 -translate-y-1/2 ${pos} ${CONTROL}`}
              >
                <Icon size={20} weight="bold" />
              </button>
            ))}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
