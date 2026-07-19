import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, SoundcloudLogo } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PlayButton } from "@/components/player/PlayButton";
import { Tracklist } from "@/components/mixes/Tracklist";
import { formatMixDate } from "@/lib/mixes";
import { getMix, getMixes } from "@/lib/mixes-store";

const ORIGIN = "https://eddiebarretta.com";

export async function generateStaticParams() {
  const mixes = await getMixes();
  return mixes.map((mix) => ({ slug: mix.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mix = await getMix(slug);
  if (!mix) return { title: "Mix not found" };

  const description = mix.intro
    ? `${mix.intro} — a ${mix.durationLabel} house & trance mix by Eddie Barretta.`
    : `A ${mix.durationLabel} house & trance mix by Eddie Barretta, with full tracklist.`;

  return {
    title: mix.title,
    description,
    alternates: { canonical: `/mixes/${mix.slug}` },
    openGraph: {
      type: "music.song",
      url: `${ORIGIN}/mixes/${mix.slug}`,
      title: `${mix.title} | Eddie Barretta`,
      description,
      images: [{ url: mix.artwork, width: 1200, height: 1200, alt: mix.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${mix.title} | Eddie Barretta`,
      description,
      images: [mix.artwork],
    },
  };
}

/** Seconds → ISO 8601 duration, e.g. 3980 → "PT1H6M20S". */
function isoDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const body = `${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s ? `${s}S` : ""}`;
  return `PT${body || "0S"}`;
}

export default async function MixPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mix = await getMix(slug);
  if (!mix) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicRecording",
        "@id": `${ORIGIN}/mixes/${mix.slug}`,
        name: mix.title,
        url: `${ORIGIN}/mixes/${mix.slug}`,
        image: mix.artwork,
        datePublished: mix.date,
        duration: isoDuration(mix.durationSeconds),
        genre: ["House", "Trance"],
        inAlbum: { "@type": "MusicAlbum", name: "Transcend" },
        byArtist: {
          "@type": "MusicGroup",
          "@id": `${ORIGIN}/#eddie`,
          name: "Eddie Barretta",
        },
        audio: {
          "@type": "AudioObject",
          contentUrl: mix.streamUrl,
          encodingFormat: "audio/mpeg",
          duration: isoDuration(mix.durationSeconds),
        },
        sameAs: mix.permalink,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: ORIGIN },
          {
            "@type": "ListItem",
            position: 2,
            name: "Mixes",
            item: `${ORIGIN}/mixes`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: mix.title,
            item: `${ORIGIN}/mixes/${mix.slug}`,
          },
        ],
      },
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
        <div className="mx-auto max-w-5xl">
          <Link
            href="/mixes"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            All mixes
          </Link>

          <div className="mt-8 grid gap-8 md:grid-cols-[320px_1fr] md:gap-12 lg:grid-cols-[360px_1fr]">
            <div className="md:sticky md:top-24 md:self-start">
              <div className="relative aspect-square overflow-hidden rounded-card border border-line">
                <Image
                  src={mix.artwork}
                  alt={`${mix.title} — Transcend mix artwork`}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <PlayButton mix={mix} size="lg" />
                </div>
              </div>

              <a
                href={mix.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/50 hover:bg-surface-2"
              >
                <SoundcloudLogo size={18} />
                Play on SoundCloud
              </a>
            </div>

            <div className="min-w-0">
              <p className="font-display text-xs font-semibold uppercase tracking-wider text-accent-bright">
                Transcend mix
              </p>
              <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
                {mix.title}
              </h1>
              <p className="mt-3 text-sm text-faint">
                {formatMixDate(mix.date)} · {mix.durationLabel}
                {mix.tracks.length > 0 ? ` · ${mix.tracks.length} tracks` : ""}
              </p>

              {mix.intro && (
                <p className="mt-6 max-w-prose leading-relaxed text-muted">
                  {mix.intro}
                </p>
              )}

              {mix.tracks.length > 0 && (
                <div className="mt-8 border-t border-line pt-6">
                  <h2 className="mb-4 font-display text-lg font-bold">
                    Tracklist
                  </h2>
                  <Tracklist tracks={mix.tracks} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
