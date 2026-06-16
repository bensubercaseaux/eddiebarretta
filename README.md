# eddiebarretta.com

Personal site for **Eddie Barretta** — House & Trance DJ in Jacksonville, FL.
Built with Next.js + Tailwind, deployed on Vercel. Replaces the old Bandzoogle site.

---

## Local development

```bash
npm install
cp .env.example .env.local   # fill in values (see "Contact form" below)
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build` (production build), `npm run start` (serve the build),
`npm run lint`.

## Editing content (no design work needed)

Almost everything lives in two files:

- **`lib/site.ts`** — name, bio, residency, social links, booking email, the SoundCloud
  playlist embed, and the list of YouTube video IDs.
- **`lib/shows.ts`** — gig list. Add new gigs to the `shows` array. Anything dated in the
  future shows under **Upcoming**; past dates roll into **Recent sets** automatically.

Images live in `public/`. `public/hero.png` is the EB vinyl logo (also used as the
favicon `app/icon.png` and the social-share image). Drop in real performance photos and
swap them in the relevant component when you have them.

## Contact form (Resend)

The booking form posts to `app/api/contact/route.ts`, which emails you via
[Resend](https://resend.com). It has a honeypot + server-side validation.

Environment variables (set locally in `.env.local` and in Vercel → Project → Settings →
Environment Variables):

| Var | Required | Notes |
|-----|----------|-------|
| `RESEND_API_KEY` | yes (prod) | From resend.com/api-keys. Without it, dev logs submissions and returns success; prod returns a friendly error. |
| `CONTACT_TO_EMAIL` | no | Where inquiries are delivered. Defaults to `ben.subercaseaux@gmail.com`. |
| `CONTACT_FROM_EMAIL` | no | Defaults to Resend's `onboarding@resend.dev` (works with zero setup). Switch to `Eddie Barretta <bookings@eddiebarretta.com>` once the domain is verified in Resend. |

---

## Deploy + take over the domain

The site can go live on Vercel with **zero downtime** — the Bandzoogle site keeps serving
until you flip DNS at the very end. Do the steps in order.

### A. Deploy to Vercel (no downtime)

1. Push this repo to GitHub (or deploy straight from the CLI).
2. Import the repo at [vercel.com/new](https://vercel.com/new) (or run `vercel`).
3. Add the env vars from the table above to the Vercel project.
4. Deploy. Confirm everything works on the temporary `*.vercel.app` URL (open the form,
   send a test message, check it arrives).

### B. Reclaim the domain (registration → an account you own)

`eddiebarretta.com` is currently registered **through Bandzoogle** (registrar eNom,
nameservers `*.sitezoogle.com`). It is past the 60-day new-registration lock, so it can move.

5. In your **Bandzoogle** dashboard → domain settings: **unlock** the domain, **turn off
   WHOIS privacy**, and request the **EPP / authorization (auth) code**.
6. Start an **inbound transfer** at a registrar you control:
   - **Cloudflare Registrar** (at-cost, recommended), or
   - **Vercel Domains** (simplest — DNS is then automatic).
   Paste the auth code. Approve the confirmation email. Transfers take up to ~5 days and add
   +1 year of registration. The site stays up the whole time.

### C. Point DNS at Vercel (the cutover)

7. In Vercel → Project → **Domains**, add `eddiebarretta.com` and `www`. Vercel shows the
   exact records:
   - On **Cloudflare** DNS: `A  @  76.76.21.21` and `CNAME  www  cname.vercel-dns.com`
     (set the records to **DNS-only / grey cloud**, not proxied).
   - On **Vercel Domains**: nothing to do, it's wired automatically.
8. Wait for Vercel to show the domain as **Valid** and issue the SSL certificate. The site
   now serves from Vercel instead of Bandzoogle.

### D. Email "from" your domain + decommission Bandzoogle

9. In **Resend** → Domains, add `eddiebarretta.com` and create the DKIM/SPF records it gives
   you in your DNS. Once verified, set `CONTACT_FROM_EMAIL="Eddie Barretta
   <bookings@eddiebarretta.com>"` in Vercel. (Optional: set up forwarding for
   `bookings@eddiebarretta.com` so replies reach your inbox.)
10. Confirm the live domain, the form, and email all work, then **cancel the Bandzoogle plan**.

> You drive the steps inside Bandzoogle / eNom / Vercel / Cloudflare (logins are yours);
> Claude can help with everything in this repo and the Vercel CLI.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Motion · Phosphor Icons · Resend.
