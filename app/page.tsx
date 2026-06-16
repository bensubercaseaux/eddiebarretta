import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Music } from "@/components/Music";
import { Watch } from "@/components/Watch";
import { Shows } from "@/components/Shows";
import { Booking } from "@/components/Booking";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: site.name,
  genre: ["House", "Trance"],
  url: "https://eddiebarretta.com",
  image: "https://eddiebarretta.com/hero.png",
  description: site.bioShort,
  areaServed: site.serviceArea,
  location: { "@type": "Place", name: "Jacksonville, FL" },
  sameAs: [site.socials.instagram, site.socials.soundcloud, site.socials.youtube],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        <Hero />
        <About />
        <Music />
        <Watch />
        <Shows />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
