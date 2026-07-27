# The Watch shelf (YouTube playlist)

The clips in the **Watch** section of the homepage come straight from a YouTube
playlist — add, remove, or reorder there and the site follows. No code change, no
redeploy.

**Playlist:** "Site — Watch"
(`PLjisbdyvOZPBAy5NWNcvdolDuqBqu2sWX`, overridable with the
`YOUTUBE_WATCH_PLAYLIST_ID` env var)

The site reads the playlist's public RSS feed
(`youtube.com/feeds/videos.xml?playlist_id=…`), so playlist order is the shelf
order. Clicking a clip opens it in a full-screen player with the page dimmed
behind it; arrow keys and the on-screen arrows step through the shelf.

## Three rules that will otherwise confuse you

1. **Vertical clips only.** The feed doesn't say whether a video is portrait or
   landscape, so each one is probed for YouTube's 9:16 poster (`oar2.jpg`), which
   only exists for Shorts-shaped uploads. A landscape video in the playlist is
   **silently dropped** — it never appears on the shelf. If a clip you added
   isn't showing up, this is almost always why.
2. **The feed caps at 15 entries.** YouTube's playlist RSS only returns the first
   15, so the shelf can never be longer than that. Order the playlist with the
   ones you care about first.
3. **Changes take about 5–10 minutes.** The feed is cached for 5 minutes
   (`lib/videos-store.ts`), and the page itself for another 5.

If every clip gets filtered out, the Watch section hides itself rather than
rendering an empty strip.

## Pushing a change immediately

To skip the wait — after reordering the playlist for a gig, say:

```bash
curl -X POST "https://www.eddiebarretta.com/api/revalidate?tag=videos" \
  -H "Authorization: Bearer $SHOWS_API_TOKEN"
```

Expected reply: `{"ok":true,"tag":"videos"}`. Reload the homepage and the new
order is there.

`tag` also accepts `mixes` (the SoundCloud feed behind the Listen section) and
`shows`. The token is the same `SHOWS_API_TOKEN` used by the booking-texts agent
— it's in the repo's `.env.local` and in the Vercel env vars.

Notes:

- The endpoint is POST-only on purpose: a GET would be reachable by crawlers and
  link prefetchers.
- It expires the cache entry outright rather than marking it stale, so the very
  next page load shows the new content — you don't need to reload twice.
- If the token isn't set, the endpoint returns 401 and there's nothing to fix in
  code; check the Vercel env var.

The other way to force a refresh, if you'd rather not use a terminal: Vercel
dashboard → the project → Settings → Data Cache → Purge. That clears every
cached feed, not just the playlist.
