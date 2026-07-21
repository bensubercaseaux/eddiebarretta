# Transcend podcast feed (`/podcast.rss`)

The site serves its own copy of the Transcend podcast feed at
**`https://eddiebarretta.com/podcast.rss`**. This is the feed you submit to
Apple Podcasts, Amazon Music, and YouTube — not SoundCloud's raw feed.

## What it is

A live, lightly-rewritten copy of SoundCloud's RSS feed for the Transcend
mixes. On every request it fetches SoundCloud's feed and fixes two things:

1. **Episode notes → real HTML.** SoundCloud publishes descriptions as plain
   text. Apple/Amazon/YouTube render notes as HTML and collapse plain line
   breaks (and strip bullets) into one run-on paragraph. Our feed rewrites each
   description into proper HTML: everything in one `<p>`, a `<br />` per track
   line, and a `<br /><br />` (blank line) between the intro and the tracklist.
   Bare `<br>`s *between* `<p>` blocks get stripped by Amazon (ones inside a
   `<p>` are honored), and raw newlines in the markup show up as stray spaces in
   some apps — hence one paragraph, no literal newlines. It also drops the
   `[@handle]` tags, which are meaningless in podcast apps.
2. **Cover art.** The show artwork is set to `public/transcend.jpg` instead of
   the SoundCloud avatar.

Everything else — episode titles, dates, GUIDs, per-episode artwork, and most
importantly each episode's audio `<enclosure>` — is passed through untouched.

Code: [`app/podcast.rss/route.ts`](../app/podcast.rss/route.ts).

## Does it still count plays on SoundCloud?

**Yes.** We only rewrite the *text* of the feed. Each episode's audio URL still
points at SoundCloud (`feeds.soundcloud.com/stream/…`), so when someone presses
play in Apple or Amazon, the audio streams *from SoundCloud* and is served and
counted by SoundCloud exactly as before. We host the feed, not the audio.

## Does it refresh automatically when I upload a new mix?

**Yes — no code change, no redeploy.** Just upload the mix to SoundCloud as
usual. Then:

- SoundCloud updates its own feed (new episodes appear there within minutes,
  even for scheduled releases).
- Our `/podcast.rss` re-reads SoundCloud every 5 minutes, so the new episode
  shows up in our feed within ~5–10 minutes.
- The website's **Listen** section and **/mixes** pages use the same 5-minute
  cache, so the new mix appears on the site in the same window.
- Apple/Amazon/YouTube then re-poll our feed on *their* schedule (Apple is
  usually within a day; you can force it in Apple Podcasts Connect → your show →
  **Refresh**).

You do **not** need to add bullets in the SoundCloud description anymore — the
feed builds the bulleted tracklist itself. Just keep the format the site
expects: an intro line, a blank line, then one track per line.

## Pointing the podcast platforms at this feed

In each platform's dashboard, set/replace the RSS feed URL with
`https://eddiebarretta.com/podcast.rss`:

- **Apple** — Podcasts Connect → your show → edit the RSS feed URL
- **Amazon Music for Podcasters** — update the feed URL
- **YouTube Studio** — Podcasts / RSS settings → update the feed URL

GUIDs are preserved, so existing episodes map 1:1 — no duplicates. The feed also
includes `<itunes:new-feed-url>` so Apple treats our URL as canonical.

## Changing things

Everything lives in [`app/podcast.rss/route.ts`](../app/podcast.rss/route.ts):

| To change… | Edit |
|---|---|
| The cover art | Replace `public/transcend.jpg` (square, 1400–3000px, no transparency) |
| The source feed | `FEED_URL` |
| How fast new mixes appear (default 5m) | `export const revalidate` (seconds) |
| The published feed URL | `SELF_URL` |

## Troubleshooting

- **Notes look like one paragraph in a podcast app** — that app is reading
  `<itunes:summary>` (plain text) instead of `<description>` (HTML). Most modern
  apps use `<description>`. Nothing to fix on our end.
- **New episode isn't showing** — give it ~10 minutes (our cache), then hit
  Refresh in the platform's dashboard. Confirm it's live on SoundCloud first.
- **Cover art not updating** — podcast apps cache artwork aggressively; it can
  take a while. Confirm `https://eddiebarretta.com/transcend.jpg` loads.
