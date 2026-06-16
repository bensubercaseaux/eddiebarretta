import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
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
  openGraph: {
    type: "website",
    url: "https://eddiebarretta.com",
    title: "Eddie Barretta | House & Trance DJ in Jacksonville Beach, FL",
    description,
    siteName: "Eddie Barretta",
    images: [{ url: "/hero.png", width: 1024, height: 1024, alt: "Eddie Barretta" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eddie Barretta | House & Trance DJ in Jacksonville Beach, FL",
    description,
    images: ["/hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="grain min-h-[100dvh] bg-ink text-fg">{children}</body>
    </html>
  );
}
