import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { PlayerProvider } from "@/components/player/PlayerProvider";
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

const description =
  "Eddie Barretta is a house and trance DJ in the Jacksonville Beach, FL area and host of the Transcend podcast. Book euphoric, dancefloor-driven sets across Northeast Florida.";

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
  alternates: { canonical: "/" },
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // GA4 measurement ID. Public by design, so it uses the NEXT_PUBLIC_ prefix.
  // Leave unset locally — analytics only loads where the var is configured.
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="grain min-h-[100dvh] bg-ink text-fg">
        <PlayerProvider>{children}</PlayerProvider>
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
