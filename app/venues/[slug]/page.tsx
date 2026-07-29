import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, MapPin, Play } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/Nav";
import { Breadcrumbs, crumbsToJsonLd, type Crumb } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { venues, getVenue, venueAddress, type Venue } from "@/lib/venues";
import { getMix } from "@/lib/mixes-store";
import { site } from "@/lib/site";

const ORIGIN = "https://eddiebarretta.com";

export function generateStaticParams() {
  return venues.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = getVenue(slug);
  if (!v) return { title: "Venue not found" };

  const title = `DJ at ${v.name} — ${v.area}`;
  const description = `${v.name} is a ${v.type.toLowerCase()} in ${v.area}. ${v.relationText} Book Eddie Barretta or hear a set.`;
  return {
    title,
    description,
    alternates: { canonical: `/venues/${v.slug}` },
    openGraph: {
      type: "website",
      url: `${ORIGIN}/venues/${v.slug}`,
      title: `${title} | Eddie Barretta`,
      description,
    },
  };
}

// Drives both the visible trail and the BreadcrumbList — one array, so the
// markup and what the visitor sees can't drift apart.
function venueCrumbs(v: Venue): Crumb[] {
  return [
    { name: "Home", href: "/" },
    { name: "Venues", href: "/venues" },
    { name: v.name, href: `/venues/${v.slug}` },
  ];
}

function buildJsonLd(v: Venue) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Place",
        name: v.name,
        description: v.summary,
        address: {
          "@type": "PostalAddress",
          ...(v.street ? { streetAddress: v.street } : {}),
          addressLocality: v.locality,
          addressRegion: v.region,
          ...(v.postalCode ? { postalCode: v.postalCode } : {}),
          addressCountry: "US",
        },
        ...(v.website ? { url: v.website } : {}),
      },
      crumbsToJsonLd(venueCrumbs(v), ORIGIN),
    ],
  };
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = getVenue(slug);
  if (!v) notFound();

  const mix = v.relatedMixSlug ? await getMix(v.relatedMixSlug) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(v)) }}
      />
      <Nav />
      <main className="px-6 pb-24 pt-28 md:pt-32">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={venueCrumbs(v)} />

          <div className="mt-8">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-accent-bright">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-bright" />
              {v.relation}
            </div>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              {v.name}
            </h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-faint">
              <MapPin size={15} weight="fill" className="text-accent-bright" />
              {venueAddress(v)}
              <span aria-hidden>·</span>
              {v.type}
            </p>
          </div>

          <p className="mt-8 text-lg leading-relaxed text-muted">{v.summary}</p>

          <div className="mt-6 rounded-card border border-line bg-surface/40 p-5">
            <h2 className="font-display text-lg font-bold">
              Eddie Barretta at {v.name}
            </h2>
            <p className="mt-2 text-muted">{v.relationText}</p>
          </div>

          {mix && (
            <Link
              href={`/mixes/${mix.slug}`}
              className="group mt-6 flex items-center gap-4 rounded-card border border-line bg-surface p-4 transition-colors hover:border-accent/50"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-transform group-hover:scale-105">
                <Play size={22} weight="fill" className="translate-x-[1px]" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs uppercase tracking-wider text-faint">
                  Live from {v.name}
                </span>
                <span className="block font-display font-semibold text-fg">
                  {mix.title} · {mix.durationLabel}
                </span>
              </span>
              <ArrowUpRight
                size={18}
                className="ml-auto text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#book"
              className="rounded-full bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-bright"
            >
              Book Eddie for your venue
            </Link>
            {v.website && (
              <a
                href={v.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-full border border-line px-6 py-3 font-medium text-fg transition-colors hover:border-accent hover:text-accent-bright"
              >
                Visit {v.name}
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            )}
          </div>

          <p className="mt-8 text-xs text-faint">
            Venue details are provided for reference; {v.name} is independently
            operated. For the latest hours and events, visit{" "}
            {v.website ? "their official site" : "the venue directly"}.
          </p>

          <p className="mt-2 text-xs text-faint">
            Looking to book a house &amp; trance DJ in {v.locality}? Eddie Barretta
            plays bars, rooftops, lounges, and private events across{" "}
            {site.serviceArea}.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
