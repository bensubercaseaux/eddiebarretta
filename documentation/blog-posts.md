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
3. `npm run build` locally to confirm, then push — Vercel deploys, and the
   sitemap/home page/llms files pick the post up on the next build.

## Voice checklist

- First person, working-DJ perspective; ties back to the Jacksonville /
  Jax Beach scene or the Transcend series where it's natural.
- Claims about the industry stay general and defensible — trends, not
  fabricated statistics or invented quotes.
- ~600–900 words (the pages show a computed "min read" label).
