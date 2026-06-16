import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllShows, isStoreConfigured } from "@/lib/shows-store";
import { splitShows, formatShowDate, type Show } from "@/lib/shows";
import { createShow, removeShow, logout } from "./actions";
import { ShowForm } from "./show-form";

export const metadata: Metadata = {
  title: "Shows dashboard",
  robots: { index: false, follow: false },
};

function ShowRow({ show }: { show: Show }) {
  const { weekday, month, day } = formatShowDate(show.date);
  return (
    <li className="flex items-center gap-5 rounded-[16px] border border-line bg-surface/40 p-5">
      <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-ink px-2 py-3 text-center">
        <span className="text-xs uppercase tracking-wide text-faint">{weekday}</span>
        <span className="font-display text-2xl font-bold leading-none text-fg">{day}</span>
        <span className="text-xs uppercase tracking-wide text-accent-bright">{month}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-fg">{show.name}</p>
          {show.isPublic ? (
            <span className="rounded-full border border-line px-2 py-0.5 text-[11px] uppercase tracking-wide text-faint">
              Public
            </span>
          ) : (
            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-amber-300">
              Private
            </span>
          )}
        </div>
        <p className="truncate text-sm text-muted">
          {show.venue} · {show.city}
        </p>
        <p className="mt-0.5 text-xs text-faint">{show.time}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href={`/admin/shows/${show.id}`}
          className="rounded-full border border-line px-4 py-2 text-sm text-fg transition-colors hover:border-accent hover:text-accent-bright"
        >
          Edit
        </Link>
        <form action={removeShow.bind(null, show.id)}>
          <button
            type="submit"
            className="rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-red-500/60 hover:text-red-300"
          >
            Delete
          </button>
        </form>
      </div>
    </li>
  );
}

export default async function AdminPage() {
  // Defense in depth — proxy.ts already guards, but never trust a single gate.
  if (!(await isAuthenticated())) redirect("/admin/login");

  const all = await getAllShows();
  const { upcoming, past } = splitShows(new Date(), all);
  const storeReady = isStoreConfigured();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-faint">Eddie Barretta</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">Shows</h1>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-fg"
          >
            Log out
          </button>
        </form>
      </header>

      {!storeReady && (
        <p className="mt-8 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          No Blob store connected yet — you&rsquo;re seeing the seed data and edits
          are disabled. Set <code>BLOB_READ_WRITE_TOKEN</code> (created when you add a
          Vercel Blob store) to manage live shows.
        </p>
      )}

      <section className="mt-10 rounded-[16px] border border-line bg-surface/40 p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold tracking-tight">Add a show</h2>
        <div className="mt-6">
          <ShowForm action={createShow} submitLabel="Add show" />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm uppercase tracking-[0.18em] text-faint">
          Upcoming ({upcoming.length})
        </h2>
        {upcoming.length > 0 ? (
          <ul className="mt-5 grid gap-4">
            {upcoming.map((s) => (
              <ShowRow key={s.id} show={s} />
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">No upcoming shows.</p>
        )}
      </section>

      {past.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm uppercase tracking-[0.18em] text-faint">
            Past ({past.length})
          </h2>
          <ul className="mt-5 grid gap-4">
            {past.map((s) => (
              <ShowRow key={s.id} show={s} />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
