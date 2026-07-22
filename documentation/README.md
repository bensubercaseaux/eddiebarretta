# Migration runbook — eddiebarretta.com

Everything needed to take the new Next.js site live on Vercel and move
`eddiebarretta.com` off Bandzoogle, with **zero downtime**. The old site keeps
serving until DNS is flipped at the very end (step 4).

Work the guides in order — each is a self-contained checklist.

| # | Step | Guide | Status |
|---|------|-------|--------|
| 1 | Deploy the app to Vercel | [01-deploy-to-vercel.md](01-deploy-to-vercel.md) | ☐ |
| 2 | Set environment variables | [02-environment-variables.md](02-environment-variables.md) | ☐ |
| 3 | Transfer the domain off Bandzoogle | [03-domain-transfer.md](03-domain-transfer.md) | ☐ |
| 4 | Point the domain at Vercel (DNS cutover) | [04-vercel-domain-and-dns.md](04-vercel-domain-and-dns.md) | ☐ |
| 5 | Send booking email from your domain (Resend) | [05-resend-email.md](05-resend-email.md) | ☐ |
| 6 | Set up the shows admin (`/admin`) | [06-admin-events.md](06-admin-events.md) | ☐ |

## The short version

1. Push to GitHub → import on Vercel → it deploys to a `*.vercel.app` URL. Test it.
2. Add `RESEND_API_KEY` (plus optional `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`,
   `NEXT_PUBLIC_GA_ID`) in Vercel.
3. Unlock the domain + get the auth code from Bandzoogle, transfer it to
   Cloudflare Registrar or Vercel Domains.
4. Add the domain in Vercel, set the DNS records it shows, wait for SSL.
5. Verify the live domain, the booking form, and email — then cancel Bandzoogle.

## Who does what

You drive everything inside **Bandzoogle / eNom / Vercel / Cloudflare / Resend /
Google Analytics** — those logins are yours. Claude can handle anything in this
repo and via the Vercel CLI.

## Reference

Not part of the migration — ongoing feature docs:

- [podcast-feed.md](podcast-feed.md) — the self-hosted Transcend podcast feed at
  `/podcast.rss`: what it is, how it auto-refreshes, and submitting it to
  Apple/Amazon/YouTube.
- [soundcloud-descriptions.md](soundcloud-descriptions.md) — copy-paste-ready mix
  descriptions for SoundCloud (one-time backfill snapshot).
- [google-analytics.md](google-analytics.md) — what GA4 tracks: mix-listening
  events (`mix_play` / `mix_progress` / `mix_complete`), booking-form leads, and
  the one-time GA admin setup.
- [new-show-checklist.md](new-show-checklist.md) — **start here when you book a
  show**: forward the text to `ben.subercaseaux+booking@gmail.com` and the
  daily agent does the rest; covers edge cases and troubleshooting.
- [text-bookings.md](text-bookings.md) — how the booking pipeline works under
  the hood (Gmail alias → daily routine → `POST /api/shows`).

## Key facts

- **Domain:** `eddiebarretta.com`
- **Current registrar:** eNom, via Bandzoogle (nameservers `*.sitezoogle.com`)
- **Past the 60-day transfer lock:** yes — it can move
- **Booking address:** `bookings@eddiebarretta.com`
- **Inquiries delivered to:** `ben.subercaseaux@gmail.com` (until changed via `CONTACT_TO_EMAIL`)
