"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Equalizer } from "./Equalizer";
import { site } from "@/lib/site";

function Vinyl({ priority = false }: { priority?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="relative aspect-square w-full"
      initial={{ rotate: 0 }}
      animate={{ rotate: reduce ? 0 : 360 }}
      transition={
        reduce
          ? { duration: 0 }
          : { repeat: Infinity, ease: "linear", duration: 22 }
      }
    >
      <Image
        src="/hero.png"
        alt="Eddie Barretta — EB logo on a vinyl record"
        fill
        priority={priority}
        sizes="(min-width: 1024px) 40vw, 80vw"
        className="rounded-full object-cover"
      />
    </motion.div>
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
      className="relative flex min-h-[100dvh] items-center overflow-hidden px-6 pb-16 pt-24"
    >
      {/* Violet glow */}
      <div
        className="glow animate-glow pointer-events-none absolute -top-24 left-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 lg:left-[72%]"
        aria-hidden="true"
      />
      {/* Mobile brand watermark */}
      <div className="pointer-events-none absolute inset-0 -z-10 grid place-items-center opacity-15 lg:hidden">
        <div className="w-[22rem] max-w-[80vw]">
          <Vinyl />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
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
            Euphoric house and trance sets that keep the floor moving. Resident
            at SIP Cocktail Bar.
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

        {/* Desktop split asset */}
        <div className="hidden lg:flex lg:justify-center">
          <div className="relative w-[clamp(20rem,28vw,32rem)]">
            <Vinyl priority />
          </div>
        </div>
      </div>
    </section>
  );
}
