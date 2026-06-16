# 6. Shows admin (`/admin`)

Manage gigs from a gated dashboard at **`/admin`** — no code deploy needed. Add,
edit, and delete shows; mark each **public** or **private**. Private shows are
hidden from the website (and from its structured data) and only ever visible in
the dashboard.

## How it works

- **Datastore:** a single private `shows.json` in **Vercel Blob**.
- **Public site:** reads the shows through a tagged cache, so the homepage stays
  static and fast. Every save triggers a background refresh — the public Shows
  section and JSON-LD update on the next visit, with no redeploy.
- **Auth:** a username/password login sets a signed, httpOnly session cookie;
  `proxy.ts` blocks `/admin/*` for anyone without a valid session.
- **Fallback:** with no Blob store connected, the site renders the seed shows
  from `lib/shows.ts` and the dashboard disables editing — so everything still
  runs locally before the migration.

## One-time setup

- [ ] **Create the Blob store:** Vercel → Storage → Create → **Blob**, and link
      it to the project. Vercel injects `BLOB_READ_WRITE_TOKEN` automatically.
- [ ] **Set the admin env vars** (see [02-environment-variables.md](02-environment-variables.md)):
  - [ ] `ADMIN_USERNAME`, `ADMIN_PASSWORD`
  - [ ] `AUTH_SECRET` — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Redeploy so the new env vars take effect.

## Local development

- [ ] `vercel env pull` to grab `BLOB_READ_WRITE_TOKEN` (and the rest) into
      `.env.local`, or set `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `AUTH_SECRET`
      by hand. Without the Blob token, the dashboard runs read-only on seed data.
- [ ] `npm run dev`, then open `http://localhost:3000/admin`.

## Using it

- [ ] Go to `/admin`, sign in.
- [ ] **Add a show** — date, time, event name, venue, city, and the
      **Public** checkbox. Uncheck Public to keep a gig off the website.
- [ ] **Edit / Delete** from the list. Past dates roll into "Past" automatically;
      future dates show under "Upcoming" on both the dashboard and the site.

## Notes

- `/admin` is `noindex` and excluded from the sitemap.
- The seed shows in `lib/shows.ts` are just the fallback. The first time you add
  or edit a show with a Blob store connected, live data takes over for good.
