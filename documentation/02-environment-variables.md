# 2. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (and in
`.env.local` for local dev — copy `.env.example`). `.env*` is gitignored, so
nothing here is committed.

| Var | Required | Exposed to | Notes |
|-----|----------|------------|-------|
| `RESEND_API_KEY` | Yes (prod) | Server only | From [resend.com/api-keys](https://resend.com/api-keys). Without it, dev logs the submission and fakes success; prod returns a friendly error. |
| `CONTACT_TO_EMAIL` | No | Server only | Where booking inquiries land. Defaults to `ben.subercaseaux@gmail.com`. |
| `CONTACT_FROM_EMAIL` | No | Server only | Defaults to Resend's onboarding sender (zero setup). Switch to `Eddie Barretta <bookings@eddiebarretta.com>` once Resend verifies the domain — see [05-resend-email.md](05-resend-email.md). |
| `NEXT_PUBLIC_GA_ID` | No | **Browser** | GA4 Measurement ID (`G-XXXXXXXXXX`), from GA Admin → Data Streams → your web stream. Analytics only loads when this is set, so local dev stays out of your reports. |

## Tips

- After changing a var in Vercel, **redeploy** for it to take effect.
- Apply each var to the right environments (Production / Preview / Development).
- `NEXT_PUBLIC_` vars ship to the browser **by design** — only put non-secret
  values there. A GA Measurement ID is fine; an API key is not.

## Local setup

```bash
cp .env.example .env.local
# fill in RESEND_API_KEY (and optionally NEXT_PUBLIC_GA_ID), then restart `npm run dev`
```
