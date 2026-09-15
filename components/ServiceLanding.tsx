import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin, Play } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/Nav";
import { Breadcrumbs, crumbsToJsonLd, type Crumb } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { venues, type Venue } from "@/lib/venues";
import { getMixes } from "@/lib/mixes-store";
import { formatMixDate, type Mix } from "@/lib/mixes";
import { site } from "@/lib/site";
import type { ServicePage } from "@/lib/services";

const ORIGIN = "https://eddiebarretta.com";
const ACT_ID = `${ORIGIN}/#eddie`;

export function serviceMetadata(page: ServicePage): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      type: "website",
      url: `${ORIGIN}/${page.slug}`,
      title: `${page.title} | Eddie Barretta`,
      description: page.description,
    },
  };
}

/** The sets that back the page up: live recordings from those venues, or the newest mixes. */
async function proofMixes(source: ServicePage["mixes"]): Promise<{ mix: Mix; label: string }[]> {
  const all = await getMixes();
  if (source === "latest") {
    return all.slice(0, 3).map((mix) => ({ mix, label: `Transcend · ${formatMixDate(mix.date)}` }));
  }
  return venues.flatMap((v) =>
    all
      .filter((m) => v.relatedMixSlugs?.includes(m.slug))
      .map((mix) => ({ mix, label: `Live from ${v.name}` })),
  );
}

function VenueGroup({ title, items }: { title: string; items: Venue[] }) {
  return (
    <div className="mt-6">
      <h3 className="text-xs font-medium uppercase tracking-wider text-faint">{title}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((v) => (
          <Link
            key={v.slug}
            href={`/venues/${v.slug}`}
            className="group flex flex-col rounded-card border border-line bg-surface/40 p-5 transition-colors hover:border-accent/50"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-display text-lg font-bold text-fg transition-colors group-hover:text-accent-bright">
                {v.name}
              </span>
              <ArrowUpRight
                size={18}
                className="shrink-0 text-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-faint">
              <MapPin size={13} weight="fill" className="text-accent-bright" />
              {v.area} · {v.type}
            </p>
            <p className="mt-3 text-sm text-muted">{v.relationText}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function ServiceLanding({ page }: { page: ServicePage }) {
  const url = `${ORIGIN}/${page.slug}`;
  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: page.crumb, href: `/${page.slug}` },
  ];
  const mixes = await proofMixes(page.mixes);
  const residencies = venues.filter((v) => v.relation === "Resident DJ");
  const sets = venues.filter((v) => v.relation !== "Resident DJ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.h1,
        serviceType: page.serviceType,
        description: page.description,
        url,
        // Named inline: Google doesn't resolve a bare @id to the provider's name.
        provider: { "@type": "MusicGroup", "@id": ACT_ID, name: site.name, url: ORIGIN },
        areaServed: site.serviceArea,
      },
      crumbsToJsonLd(crumbs, ORIGIN),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="px-6 pb-24 pt-28 md:pt-32">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={crumbs} />

          <header className="mt-8">
            <p className="font-display text-xs font-semibold uppercase tracking-wider text-accent-bright">
              {page.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">{page.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={site.bookingUrl}
                className="rounded-full bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-bright"
              >
                {page.cta}
              </Link>
              <Link
                href="/mixes"
                className="rounded-full border border-line px-6 py-3 font-medium text-fg transition-colors hover:border-accent hover:text-accent-bright"
              >
                Hear the mixes
              </Link>
            </div>
          </header>

          {page.details && (
            <section className="mt-14">
              <h2 className="font-display text-2xl font-bold">{page.details.heading}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {page.details.items.map((item) => (
                  <div key={item.title} className="rounded-card border border-line bg-surface/40 p-5">
                    <h3 className="font-display text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold">The sound</h2>
            <p className="mt-3 text-muted">{site.bio[1]}</p>
            <p className="mt-3 text-muted">{site.bio[2]}</p>
            {page.genresCaption && <p className="mt-5 text-sm text-faint">{page.genresCaption}</p>}
            <ul className={`${page.genresCaption ? "mt-3" : "mt-5"} flex flex-wrap gap-2`}>
              {site.genres
                .filter((g) => !page.hideGenres?.test(g))
                .map((g) => (
                  <li key={g} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                    {g}
                  </li>
                ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold">{page.venuesHeading}</h2>
            <VenueGroup title="Residencies" items={residencies} />
            <VenueGroup title="Featured & guest sets" items={sets} />
          </section>

          {mixes.length > 0 && (
            <section className="mt-14">
              <h2 className="font-display text-2xl font-bold">{page.mixesHeading}</h2>
              <div className="mt-5 space-y-3">
                {mixes.map(({ mix, label }) => (
                  <Link
                    key={mix.slug}
                    href={`/mixes/${mix.slug}`}
                    className="group flex items-center gap-4 rounded-card border border-line bg-surface p-4 transition-colors hover:border-accent/50"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-transform group-hover:scale-105">
                      <Play size={22} weight="fill" className="translate-x-[1px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs uppercase tracking-wider text-faint">{label}</span>
                      <span className="block font-display font-semibold text-fg">
                        {mix.title} · {mix.durationLabel}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="ml-auto shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-14 rounded-card border border-line bg-surface/40 p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold">How booking works</h2>
            <p className="mt-3 text-muted">
              Send the date, the location, and the type of night through the booking
              form, with a note on the vibe you want, and Eddie will get back to you.
              You can also message{" "}
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-bright underline-offset-4 hover:underline"
              >
                @djeddiebarretta
              </a>{" "}
              on Instagram.
            </p>
            {page.bookingNote && <p className="mt-3 text-muted">{page.bookingNote}</p>}
            <p className="mt-3 flex items-center gap-2 text-sm text-faint">
              <MapPin size={15} weight="fill" className="text-accent-bright" />
              {site.serviceArea}
            </p>
            <Link
              href={site.bookingUrl}
              className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-bright"
            >
              {page.cta}
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
