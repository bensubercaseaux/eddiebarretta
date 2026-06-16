import type { MetadataRoute } from "next";

// Allow every crawler, including AI answer engines (GPTBot, ClaudeBot,
// PerplexityBot, etc.) — we want this site cited by answer engines.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://eddiebarretta.com/sitemap.xml",
    host: "https://eddiebarretta.com",
  };
}
