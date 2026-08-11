import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
import { getMixes } from "@/lib/mixes-store";
import { venues } from "@/lib/venues";

const ORIGIN = "https://eddiebarretta.com";

// Home + the mix library. Per-mix pages are generated from the live feed, so
// new uploads enter the sitemap automatically on the next revalidate.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mixes = await getMixes();

  // Only claim a lastmod we can actually stand behind (the mix feed dates).
  // Stamping `new Date()` on every build teaches Google to distrust the
  // field site-wide, so venue pages simply omit it.
  const latestMix = mixes[0] ? new Date(mixes[0].date) : undefined;

  return [
    {
      url: ORIGIN,
      lastModified: latestMix,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${ORIGIN}/mixes`,
      lastModified: latestMix,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...mixes.map((mix) => ({
      url: `${ORIGIN}/mixes/${mix.slug}`,
      lastModified: new Date(mix.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    {
      url: `${ORIGIN}/venues`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...venues.map((v) => ({
      url: `${ORIGIN}/venues/${v.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${ORIGIN}/blog`,
      // Posts land monthly, so the newest publish date is an honest lastmod.
      lastModified: posts[0] ? new Date(posts[0].date) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...posts.map((p) => ({
      url: `${ORIGIN}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
