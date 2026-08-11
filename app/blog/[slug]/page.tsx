import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/Nav";
import { Breadcrumbs, crumbsToJsonLd, type Crumb } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { posts, getPost, formatPostDate, readingTime, type Post } from "@/lib/blog";

const ORIGIN = "https://eddiebarretta.com";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `${ORIGIN}/blog/${post.slug}`,
      title: `${post.title} | Eddie Barretta`,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

// Drives both the visible trail and the BreadcrumbList — one array, so the
// markup and what the visitor sees can't drift apart.
function postCrumbs(post: Post): Crumb[] {
  return [
    { name: "Home", href: "/" },
    { name: "EDM Trends", href: "/blog" },
    { name: post.title, href: `/blog/${post.slug}` },
  ];
}

function buildJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        url: `${ORIGIN}/blog/${post.slug}`,
        isPartOf: { "@id": `${ORIGIN}/blog` },
        author: { "@type": "Person", name: "Eddie Barretta", url: ORIGIN },
        publisher: { "@type": "Person", name: "Eddie Barretta", url: ORIGIN },
        articleSection: post.tag,
      },
      crumbsToJsonLd(postCrumbs(post), ORIGIN),
    ],
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // Posts are newest-first, so "older" is the next index down the array.
  const i = posts.findIndex((p) => p.slug === post.slug);
  const newer = i > 0 ? posts[i - 1] : undefined;
  const older = i < posts.length - 1 ? posts[i + 1] : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(post)) }}
      />
      <Nav />
      <main className="px-6 pb-24 pt-28 md:pt-32">
        <article className="mx-auto max-w-3xl">
          <Breadcrumbs items={postCrumbs(post)} />

          <header className="mt-8">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-faint">
              <span className="font-medium uppercase tracking-wider text-accent-bright">
                {post.tag}
              </span>
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden>·</span>
              {readingTime(post)} min read
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              {post.title}
            </h1>
          </header>

          <div className="mt-8 space-y-5">
            {post.intro.map((para) => (
              <p key={para} className="text-lg leading-relaxed text-muted">
                {para}
              </p>
            ))}
          </div>

          {post.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="font-display text-2xl font-bold tracking-tight">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-5">
                {section.paragraphs.map((para) => (
                  <p key={para} className="leading-relaxed text-muted">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <p className="mt-10 rounded-card border border-line bg-surface/40 p-6 leading-relaxed text-fg">
            {post.outro}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/mixes"
              className="rounded-full bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-bright"
            >
              Hear it in a Transcend mix
            </Link>
            <Link
              href="/#book"
              className="group inline-flex items-center gap-1.5 rounded-full border border-line px-6 py-3 font-medium text-fg transition-colors hover:border-accent hover:text-accent-bright"
            >
              Book Eddie
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {(newer || older) && (
            <nav
              aria-label="More posts"
              className="mt-12 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
            >
              {older ? (
                <Link
                  href={`/blog/${older.slug}`}
                  className="group rounded-card border border-line bg-surface/40 p-5 transition-colors hover:border-accent/50"
                >
                  <span className="text-xs uppercase tracking-wider text-faint">
                    Previous month
                  </span>
                  <span className="mt-1 block font-display font-semibold text-fg transition-colors group-hover:text-accent-bright">
                    {older.title}
                  </span>
                </Link>
              ) : (
                <span aria-hidden className="hidden sm:block" />
              )}
              {newer && (
                <Link
                  href={`/blog/${newer.slug}`}
                  className="group rounded-card border border-line bg-surface/40 p-5 transition-colors hover:border-accent/50"
                >
                  <span className="text-xs uppercase tracking-wider text-faint">
                    Next month
                  </span>
                  <span className="mt-1 block font-display font-semibold text-fg transition-colors group-hover:text-accent-bright">
                    {newer.title}
                  </span>
                </Link>
              )}
            </nav>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
