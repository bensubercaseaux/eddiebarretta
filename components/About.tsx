import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { site } from "@/lib/site";
import { venues } from "@/lib/venues";

const facts = [
  { label: "Sound", value: "House · Trance" },
  { label: "Based in", value: "Jacksonville Beach, FL" },
  { label: "Podcast", value: "Transcend" },
];

export function About() {
  return (
    <section id="about" className="px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            Made for the
            <br />
            dancefloor.
          </h2>
          <div className="mt-7 max-w-prose space-y-4 text-lg leading-relaxed text-muted">
            {site.bio.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:pt-4">
          <div className="space-y-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-line bg-surface/40">
              <Image
                src="/eddieb_profile_pic.webp"
                alt="Eddie Barretta DJing"
                fill
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-card border border-line bg-surface/40">
              <ul className="divide-y divide-line">
                {facts.map((f) => (
                  <li
                    key={f.label}
                    className="flex items-center justify-between gap-6 px-6 py-5"
                  >
                    <span className="text-sm uppercase tracking-[0.16em] text-faint">
                      {f.label}
                    </span>
                    <span className="text-right font-medium text-fg">
                      {f.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 max-w-6xl border-t border-line pt-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-display text-2xl font-bold tracking-tight">
              Played around town
            </h3>
            <Link
              href="/venues"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg"
            >
              All venues
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {venues.map((v) => (
              <li key={v.slug}>
                <Link
                  href={`/venues/${v.slug}`}
                  className="inline-block rounded-full border border-line bg-surface/40 px-4 py-2 text-sm text-muted transition-colors duration-200 hover:border-accent/60 hover:text-fg"
                >
                  {v.name}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
