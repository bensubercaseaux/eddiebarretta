import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="grid min-h-[70vh] place-items-center px-6 pt-28">
        <div className="mx-auto max-w-lg text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-accent-bright">
            404
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Off the grid
          </h1>
          <p className="mt-4 text-muted">
            This page isn&rsquo;t here. The mix may have moved — browse the full
            Transcend library or head back home.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/mixes"
              className="rounded-full bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-bright"
            >
              Browse mixes
            </Link>
            <Link
              href="/"
              className="rounded-full border border-line px-6 py-3 font-medium text-fg transition-colors hover:border-accent hover:text-accent-bright"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
