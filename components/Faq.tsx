import { Reveal } from "./Reveal";
import { faq } from "@/lib/site";

// Visible counterpart to the FAQPage JSON-LD on the home page — both render
// from the same `faq` data in lib/site.ts.
export function Faq() {
  return (
    <section id="faq" className="px-6 pb-24 md:pb-32">
      <div className="mx-auto max-w-6xl border-t border-line pt-16">
        <Reveal>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            FAQ
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {faq.map((item, i) => (
            <Reveal key={item.question} delay={0.05 * i}>
              <div className="h-full rounded-card border border-line bg-surface/40 p-6">
                <h3 className="font-display text-lg font-bold">
                  {item.question}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{item.answer}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
