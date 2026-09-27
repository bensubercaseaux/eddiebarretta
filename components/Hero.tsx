"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Equalizer } from "./Equalizer";
import { site } from "@/lib/site";

// Ambient hero loop: an empty club, violet lasers through haze. Decorative only.
//
// Order matters for first paint. The poster is a normal image and paints with the
// page. The video mounts after the browser goes idle, so its megabyte never competes
// with the headline, and it fades in over the poster once it is actually playing.
// The poster is the loop's first frame, so the swap is invisible.
//
// No video at all for reduced motion or Save-Data: the poster stays as a still.
// If autoplay is refused (iOS Low Power Mode), the video never reports `playing`
// and the poster stays too.
//
// How the files were made: docs/hero-pilot/README.md
function HeroLoop() {
  const reduce = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (reduce !== false) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    // Safari has no requestIdleCallback; a short timeout is close enough.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setMounted(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setMounted(true), 300);
    return () => window.clearTimeout(id);
  }, [reduce]);

  useEffect(() => {
    const el = video.current;
    if (!mounted || !el) return;
    // React sets `muted` as a property after insertion, which is too late for some
    // autoplay checks. Set both forms, then ask to play.
    el.muted = true;
    el.defaultMuted = true;
    // Do not decode frames nobody can see.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <Image
        src="/hero/hero-poster-1080.jpg"
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover object-[72%_50%]"
      />
      {mounted && (
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          disablePictureInPicture
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover object-[72%_50%] transition-opacity duration-700 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        >
          <source media="(min-width: 900px)" src="/hero/hero-loop-1080.webm" type="video/webm" />
          <source media="(min-width: 900px)" src="/hero/hero-loop-1080.mp4" type="video/mp4" />
          <source src="/hero/hero-loop-720.webm" type="video/webm" />
          <source src="/hero/hero-loop-720.mp4" type="video/mp4" />
        </video>
      )}
      {/* Keeps the headline readable and fades the floor into the next section */}
      <div className="hero-scrim absolute inset-0" />
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.12,
        delayChildren: reduce ? 0 : 0.08,
      },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[86dvh] items-center overflow-hidden px-6 pb-10 pt-24"
    >
      <HeroLoop />

      <div className="mx-auto w-full max-w-6xl">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="mb-6 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-muted"
          >
            <Equalizer />
            House &amp; Trance · {site.location}
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-[clamp(2.5rem,10vw,6.5rem)] font-extrabold uppercase leading-[0.92] tracking-tight"
          >
            Eddie
            <br />
            Barretta
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted"
          >
            Euphoric house and trance sets that keep the floor moving, from
            beach bars to late-night lounges.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <a
              href="#music"
              className="rounded-full bg-accent px-7 py-3 font-medium text-white transition-transform duration-200 hover:bg-accent-bright active:scale-[0.97]"
            >
              Listen to mixes
            </a>
            <a
              href="#book"
              className="rounded-full border border-line px-7 py-3 font-medium text-fg transition-colors duration-200 hover:border-accent hover:text-accent-bright"
            >
              Book Eddie
            </a>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
