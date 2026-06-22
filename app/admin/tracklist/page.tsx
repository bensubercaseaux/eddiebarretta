import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { TracklistTool } from "./tracklist-tool";

export const metadata: Metadata = {
  title: "Tracklist tool",
  robots: { index: false, follow: false },
};

export default async function TracklistPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/admin"
        className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
      >
        ← Back to shows
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
        Tracklist tool
      </h1>
      <p className="mt-2 max-w-prose text-muted">
        Paste a mix tracklist, resolve each artist to their SoundCloud handle
        (verified against SoundCloud, so no dead links), and copy the annotated
        version back into your mix description.
      </p>

      <div className="mt-10">
        <TracklistTool />
      </div>
    </main>
  );
}
