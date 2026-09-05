# EDM Trends blog — the monthly post

The site has a blog at `/blog` ("EDM Trends"): one post a month on where the
EDM / DJ scene is heading — sounds, booth tech, nightlife culture. It launched
with three backfilled posts (June–August 2026).

## Where everything lives

Posts are **data, not files**: they live in [`lib/blog.ts`](../lib/blog.ts) as
an array, newest first. Everything else renders from that one array
automatically:

- `/blog` — the listing page (`app/blog/page.tsx`)
- `/blog/<slug>` — each post (`app/blog/[slug]/page.tsx`), with BlogPosting
  JSON-LD and breadcrumbs
- The **home-page "EDM Trends" section** (`components/Blog.tsx`) — latest 3 posts
- The **nav and footer** "Blog" links (`lib/site.ts` → `nav`)
- `sitemap.xml`, `/llms.txt`, and `/llms-full.txt`

So publishing a post = adding one entry to `lib/blog.ts`. No other file needs
touching.

## Publishing the monthly post

1. Pick the trend. One clear industry/scene trend per post — genre movements,
   booth technology, how nightlife itself is changing. Written in Eddie's
   voice, from the booth, not like a press release.
2. Add a new object to the **top** of `posts` in `lib/blog.ts`:
   - `slug` — kebab-case, becomes the URL; don't change it after publishing.
   - `title`, `date` (ISO `YYYY-MM-DD`), `tag` (reuse an existing tag when it
     fits: "Sound & genres", "Tech & craft", "Scene & culture").
   - `excerpt` — 1–2 sentences; doubles as the meta description.
   - `intro` (1–2 paragraphs), `sections` (2–4, each with a `heading` and
     paragraphs), `outro` — one line tying the trend back to Eddie's sets.
   - `sources` — 2–4 real articles (title, publisher, URL) backing the trend;
     rendered as a "Further reading" block and as `citation` JSON-LD.
     **URLs must be actual pages found via web search — never invented.**
3. `npm run build` locally to confirm, then push — Vercel deploys, and the
   sitemap/home page/llms files pick the post up on the next build.

## The automated monthly draft

`.github/workflows/blog-draft.yml` runs `scripts/blog-draft.mts` on the 1st of each month at
13:00 UTC (and on demand from the Actions tab). Each run:

1. Researches the past month's EDM / DJ industry news with Claude and the web-search tool, and
   picks one trend not already covered in `lib/blog.ts`.
2. Writes the post in Eddie's voice — the guide the agent reads is [`lib/blog-voice.md`](../lib/blog-voice.md),
   which mirrors the checklist below — with 2–5 verified sources from that research.
3. Prepends the new entry to `posts` in `lib/blog.ts`, commits it straight to `main`
   (since 2026-09-05; the validator is the gate and the review notes go to the run summary).
   Dispatch the workflow with the `review` input for the old `blog/draft-<slug>` branch and PR.

To review: read the PR diff (it is one entry in `lib/blog.ts`), fix anything that needs fixing in
the PR, then merge — Vercel deploys and the listing page, post page, home-page section, sitemap
and llms files all pick it up. If a month's draft isn't wanted, close the PR and delete the branch.

The run needs an `ANTHROPIC_API_KEY` repository secret. To draft locally:

```bash
ANTHROPIC_API_KEY=… npx tsx scripts/blog-draft.mts --dry-run
```

The shared architecture behind this script — it is the same file in five of Ben's repos — is
documented in the umbrella repo's `docs/blog-pipeline.md`.

## Voice checklist

- First person, working-DJ perspective; ties back to the Jacksonville /
  Jax Beach scene or the Transcend series where it's natural.
- Claims about the industry stay general and defensible — trends, not
  fabricated statistics or invented quotes.
- ~600–900 words (the pages show a computed "min read" label).
