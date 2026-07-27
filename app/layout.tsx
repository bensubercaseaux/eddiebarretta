import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { PlayerProvider } from "@/components/player/PlayerProvider";
import { getMixes } from "@/lib/mixes-store";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// Keep under ~155 chars so Google doesn't truncate it mid-sentence.
const description =
  "Eddie Barretta is a house and trance DJ in Jacksonville Beach, FL, and host of the Transcend podcast. Book him for bars, residencies, and private events.";

export const metadata: Metadata = {
  metadataBase: new URL("https://eddiebarretta.com"),
  title: {
    default: "Eddie Barretta | House & Trance DJ in Jacksonville Beach, FL",
    template: "%s | Eddie Barretta",
  },
  description,
  keywords: [
    "Eddie Barretta",
    "DJ",
    "house music",
    "trance music",
    "Jacksonville DJ",
    "Jacksonville Beach DJ",
    "Transcend podcast",
    "book a DJ",
  ],
  alternates: {
    canonical: "/",
    // AI/LLM resource pack (Geordy) — <link rel="alternate"> tags in <head>
    // pointing crawlers at the generated files on the ai. subdomain. Geordy's
    // verifier looks for these in the head.
    types: {
      "text/markdown": "https://ai.eddiebarretta.com/index.md",
      "application/yaml": "https://ai.eddiebarretta.com/index.yaml",
      "application/ld+json": "https://ai.eddiebarretta.com/index.schema.json",
      "application/rss+xml": "https://ai.eddiebarretta.com/index.xml",
      "text/plain": [
        { url: "https://ai.eddiebarretta.com/llms.txt", title: "llms.txt" },
        { url: "https://ai.eddiebarretta.com/humans.txt", title: "humans.txt" },
      ],
      "application/json": [
        { url: "https://ai.eddiebarretta.com/index.manifest.json", title: "Manifest" },
        { url: "https://ai.eddiebarretta.com/index.og.json", title: "OG" },
      ],
    },
  },
  // og:image / twitter:image come from the file-based opengraph-image.tsx
  // generators (branded, per-route), so no static image is set here.
  openGraph: {
    type: "website",
    url: "https://eddiebarretta.com",
    title: "Eddie Barretta | House & Trance DJ in Jacksonville Beach, FL",
    description,
    siteName: "Eddie Barretta",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eddie Barretta | House & Trance DJ in Jacksonville Beach, FL",
    description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // GA4 measurement ID. Public by design, so it uses the NEXT_PUBLIC_ prefix.
  // Leave unset locally — analytics only loads where the var is configured.
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // Play queue for the site-wide player (auto-advance when a mix ends). The
  // player only needs card-level fields, so drop each mix's intro/tracklist —
  // otherwise every page would ship every tracklist in its RSC payload.
  const queue = (await getMixes()).map((mix) => ({
    ...mix,
    intro: "",
    tracks: [],
  }));

  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="grain min-h-[100dvh] bg-ink text-fg">
        <PlayerProvider queue={queue} autoStart>
          {children}
        </PlayerProvider>
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
