"use client";

import { useState } from "react";
import Link from "next/link";
import { useScroll, useMotionValueEvent } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { nav, site } from "@/lib/site";
import { Social } from "./Social";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-ink/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-[72px]">
        <Link
          href="/#top"
          className="font-display text-lg font-bold tracking-tight text-fg"
        >
          Eddie Barretta
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm text-muted transition-colors duration-200 hover:text-fg"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Social className="-mr-1" size={18} />
          <Link
            href="/#book"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-transform duration-200 hover:bg-accent-bright active:scale-[0.97]"
          >
            Book Eddie
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-full text-fg transition-colors hover:bg-surface lg:hidden"
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-ink/95 backdrop-blur-md lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 text-base text-muted transition-colors hover:bg-surface hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex items-center justify-between px-2">
              <Social size={20} />
              <a
                href={`mailto:${site.bookingEmail}`}
                className="text-sm text-muted"
              >
                {site.bookingEmail}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
