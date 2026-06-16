# 1. Deploy to Vercel

**Goal:** the site runs on a temporary `*.vercel.app` URL. This has **no effect
on the live Bandzoogle site** — it's a parallel deployment you can test freely.

## Steps

- [ ] Push this repo to GitHub (private is fine).
- [ ] Go to [vercel.com/new](https://vercel.com/new) and **import** the repo.
      (Or, from the repo root: `npm i -g vercel && vercel`.)
- [ ] The framework preset auto-detects **Next.js** — accept the defaults
      (build command `next build`; Vercel handles the output).
- [ ] Add environment variables **before** the first deploy —
      see [02-environment-variables.md](02-environment-variables.md).
- [ ] Deploy, then open the `*.vercel.app` URL and verify:
  - [ ] Hero, About (with the photo), Music/SoundCloud, and Shows all render
  - [ ] The booking form sends — submit a test message and confirm it arrives
  - [ ] `/robots.txt`, `/sitemap.xml`, and `/llms.txt` all load

## Notes

- Every push to the default branch redeploys **production**; pull requests get
  their own **preview** URLs automatically.
- You don't need the custom domain yet — that's steps 3–4. Test everything on
  the `*.vercel.app` URL first.
