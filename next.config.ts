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
};

export default nextConfig;
