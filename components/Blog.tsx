import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { posts, formatPostDate } from "@/lib/blog";

// Home-page teaser for the monthly EDM Trends blog — the latest three posts,
// rendered from lib/blog.ts so it updates automatically each month.
export function Blog() {
  const latest = posts.slice(0, 3);

  return (
    <section id="blog" className="px-6 pb-24 md:pb-32">
      <div className="mx-auto max-w-6xl border-t border-line pt-16">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-accent-bright">
                One post a month
              </p>
              <h2 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
                EDM Trends
              </h2>
            </div>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg"
            >
              Read the blog
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {latest.map((p, i) => (
            <Reveal key={p.slug} delay={0.05 * i}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col rounded-card border border-line bg-surface/40 p-6 transition-colors hover:border-accent/50"
              >
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-faint">
                  <span className="font-medium uppercase tracking-wider text-accent-bright">
                    {p.tag}
                  </span>
                  <span aria-hidden>·</span>
                  <time dateTime={p.date}>{formatPostDate(p.date)}</time>
                </p>
                <h3 className="mt-3 font-display text-lg font-bold text-fg transition-colors group-hover:text-accent-bright">
                  {p.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                  {p.excerpt}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
