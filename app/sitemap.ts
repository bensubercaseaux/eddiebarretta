import type { MetadataRoute } from "next";
import { getMixes } from "@/lib/mixes-store";
import { venues } from "@/lib/venues";

const ORIGIN = "https://eddiebarretta.com";

// Home + the mix library. Per-mix pages are generated from the live feed, so
// new uploads enter the sitemap automatically on the next revalidate.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mixes = await getMixes();

  return [
    {
      url: ORIGIN,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${ORIGIN}/mixes`,
      lastModified: mixes[0] ? new Date(mixes[0].date) : new Date(),
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
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...venues.map((v) => ({
      url: `${ORIGIN}/venues/${v.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
