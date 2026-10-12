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

- **`lib/site.ts`** — name, bio, residency, social links, booking email, and the list of
  YouTube video IDs.
- **`lib/shows.ts`** — gig list. Add new gigs to the `shows` array. Anything dated in the
  future shows under **Upcoming**; past dates roll into **Recent sets** automatically.

**Mixes are fully automatic.** The Listen section and the `/mixes` pages are built live
from your SoundCloud RSS feed (`lib/mixes-store.ts`) — upload a mix to SoundCloud with a
description/tracklist and it appears on the site within the hour, no code change or
redeploy. The site caches the feed for an hour (`unstable_cache`, tag `mixes`).

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
| `CONTACT_TO_EMAIL` | no | Where inquiries are delivered. Defaults to `site.bookingEmail` (booking@eddiebarretta.com, which forwards to Ben's inbox via Cloudflare Email Routing). |
| `CONTACT_FROM_EMAIL` | no | Defaults to Resend's `onboarding@resend.dev` (works with zero setup). Switch to `Eddie Barretta <noreply@eddiebarretta.com>` once the domain is verified in Resend. Send-only; the public booking inbox is booking@eddiebarretta.com. |

---

## Phone line (Twilio)

Eddie's number is answered by `app/api/voice/*` and `app/api/sms` (helpers in
`lib/twilio.ts`, ported from askben). A call rings `FORWARD_TO_NUMBER` with the
line as caller ID and a whisper ("Eddie Barretta booking call from …, press 1 to
accept"); if nobody presses 1, the caller gets the line's voicemail and the
transcript + recording link are emailed to `booking@eddiebarretta.com`. Texts are
emailed there too; nothing is ever texted back (the number has no 10DLC campaign).
Every webhook checks `X-Twilio-Signature`; with the env unset, calls hear a short
"use the booking form or email booking@" message.

1. **Twilio console → the number → Configure:**
   - Voice, "A call comes in": Webhook, `HTTP POST`, `https://eddiebarretta.com/api/voice`
   - Messaging, "A message comes in": Webhook, `HTTP POST`, `https://eddiebarretta.com/api/sms`
2. **Vercel → Project → Settings → Environment Variables (Production):**

   | Var | Notes |
   |-----|-------|
   | `TWILIO_AUTH_TOKEN` | Auth token of the Twilio (sub)account that owns the number. |
   | `TWILIO_NUMBER` | The number, E.164 (`+1904…`). |
   | `FORWARD_TO_NUMBER` | The phone calls ring through to, E.164. Env only, never in the repo. |

   Voicemail and text emails use the contact form's `RESEND_API_KEY` and
   `CONTACT_FROM_EMAIL`; the latter must be on the verified eddiebarretta.com
   domain, since Resend's onboarding sender only delivers to the account owner.
3. Redeploy, call the number, then set `site.phone` in `lib/site.ts`
   (`{ display: "(904) 555-0123", e164: "+19045550123" }`). That one field shows
   the number in the booking section, the service pages, llms.txt and the JSON-LD.

---

## Analytics (Google Analytics 4)

Page views load through [`@next/third-parties`](https://nextjs.org/docs/app/guides/third-party-libraries#google-analytics) in `app/layout.tsx`. The tag only renders when the measurement ID is set, so local dev stays out of your reports by default.

| Var | Required | Notes |
|-----|----------|-------|
| `NEXT_PUBLIC_GA_ID` | no | GA4 Measurement ID (`G-XXXXXXXXXX`), from GA Admin → Data Streams → your web stream. Set it in Vercel for production; leave unset locally. |

---

## Deploy + take over the domain

The full step-by-step migration runbook lives in **[`documentation/`](documentation/)** —
deploy to Vercel, environment variables, transferring the domain off Bandzoogle, the DNS
cutover, and Resend email, each as its own checklist. Start at
**[documentation/README.md](documentation/README.md)**.

The site goes live with **zero downtime**: the Bandzoogle site keeps serving until DNS is
flipped at the very end.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Motion · Phosphor Icons · Resend.
