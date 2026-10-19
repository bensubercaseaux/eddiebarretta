import type { NextConfig } from "next";
import { site } from "./lib/site";

const nextConfig: NextConfig = {
  images: {
    // SoundCloud mix artwork (served oversized at 3000px; the optimizer
    // downscales it to the sizes we actually render).
    remotePatterns: [
      { protocol: "https", hostname: "i1.sndcdn.com" },
      { protocol: "https", hostname: "**.sndcdn.com" },
      // YouTube thumbnail posters for the click-to-load Watch section.
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  // /home is an old URL Google still crawls (Search Console "Not found (404)", 2026-09-15).
  // /review is the short link for asking clients for a Google review; temporary,
  // so browsers don't cache it if the profile ever changes.
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/review", destination: site.googleReviewUrl, permanent: false },
    ];
  },
};

export default nextConfig;
