import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { posts, formatPostDate, readingTime } from "@/lib/blog";

const ORIGIN = "https://eddiebarretta.com";

export const metadata: Metadata = {
  title: "EDM Trends — the Blog",
  description:
    "A monthly read on where the EDM and DJ scene is heading — sounds, tech, and nightlife culture — written from the booth by house & trance DJ Eddie Barretta.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${ORIGIN}/blog`,
    title: "EDM Trends — the Blog | Eddie Barretta",
    description:
      "A monthly read on where the EDM and DJ scene is heading — sounds, tech, and nightlife culture — written from the booth.",
  },
};

export default function BlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${ORIGIN}/blog`,
    name: "EDM Trends — the Eddie Barretta blog",
    description:
      "A monthly read on where the EDM and DJ scene is heading, written from the booth.",
    url: `${ORIGIN}/blog`,
    author: { "@type": "Person", name: "Eddie Barretta", url: ORIGIN },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${ORIGIN}/blog/${p.slug}`,
      datePublished: p.date,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="px-6 pb-24 pt-28 md:pt-32">
        <div className="mx-auto max-w-5xl">
          <header className="max-w-2xl">
            <p className="font-display text-xs font-semibold uppercase tracking-wider text-accent-bright">
              One post a month, from the booth
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-6xl">
              EDM Trends
            </h1>
            <p className="mt-4 text-muted">
              Where the scene is heading — the sounds taking over dancefloors,
              the tech reshaping the booth, and the way nightlife itself is
              changing. Written by a working house &amp; trance DJ, not a press
              release.
            </p>
          </header>

          <div className="mt-12 space-y-4">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col rounded-card border border-line bg-surface/40 p-6 transition-colors hover:border-accent/50"
              >
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-faint">
                  <span className="font-medium uppercase tracking-wider text-accent-bright">
                    {p.tag}
                  </span>
                  <span aria-hidden>·</span>
                  <time dateTime={p.date}>{formatPostDate(p.date)}</time>
                  <span aria-hidden>·</span>
                  {readingTime(p)} min read
                </p>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <h2 className="font-display text-2xl font-bold text-fg transition-colors group-hover:text-accent-bright">
                    {p.title}
                  </h2>
                  <ArrowUpRight
                    size={20}
                    className="mt-1 shrink-0 text-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                  {p.excerpt}
                </p>
              </Link>
            ))}
          </div>

          <p className="mt-12 text-xs text-faint">
            New post every month. For the mixes behind the words, head to the{" "}
            <Link
              href="/mixes"
              className="font-medium text-muted transition-colors hover:text-fg"
            >
              Transcend mix library
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
