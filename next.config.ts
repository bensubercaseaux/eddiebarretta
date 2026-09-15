import type { NextConfig } from "next";

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
  async redirects() {
    return [{ source: "/home", destination: "/", permanent: true }];
  },
};

export default nextConfig;
