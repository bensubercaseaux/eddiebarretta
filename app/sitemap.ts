import type { MetadataRoute } from "next";

// Single-page site (anchored sections live on "/"). Add new routes here as the
// site grows.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://eddiebarretta.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
