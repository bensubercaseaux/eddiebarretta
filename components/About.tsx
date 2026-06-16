import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

const facts = [
  { label: "Residency", value: "SIP Cocktail Bar · Decca Live" },
  { label: "Sound", value: "House · Trance" },
  { label: "Based in", value: "Jacksonville, FL" },
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
          <div className="overflow-hidden rounded-[16px] border border-line bg-surface/40">
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
        </Reveal>
      </div>
    </section>
  );
}
