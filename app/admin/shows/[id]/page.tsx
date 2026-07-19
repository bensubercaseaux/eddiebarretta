import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllShows } from "@/lib/shows-store";
import { editShow } from "../../actions";
import { ShowForm } from "../../show-form";

export const metadata: Metadata = {
  title: "Edit show",
  robots: { index: false, follow: false },
};

export default async function EditShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  const show = (await getAllShows()).find((s) => s.id === id);
  if (!show) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/admin"
        className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
      >
        ← Back to shows
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
        Edit show
      </h1>

      <section className="mt-8 rounded-card border border-line bg-surface/40 p-6 sm:p-8">
        <ShowForm
          action={editShow.bind(null, id)}
          initial={show}
          submitLabel="Save changes"
        />
      </section>
    </main>
  );
}
