# GEO Analysis — eddiebarretta.com (re-run)

Audited 2026-10-12, afternoon (~18:30 UTC). This re-runs this morning's audit (`docs/seo-audits/2026-10-12-geo.md`, 64/100) after the fixes shipped today. Analysis only: no repo files were changed.

Method: the same as this morning. Raw HTML was fetched without JavaScript through the plugin's `render_page.py` (11 page templates) and parsed with `parse_html.py`. I also fetched `robots.txt`, `sitemap.xml`, `/llms.txt`, `/llms-full.txt` and `/podcast.rss`, and requested the homepage as OAI-SearchBot, PerplexityBot, Claude-SearchBot and GPTBot. Off-site sources: SoundCloud's profile and its RSS feed, the Apple lookup API, the Apple and iHeart listings, `ai.eddiebarretta.com`, a Bing `site:` query, and web searches. Search Console and GA4 were queried for the same 90-day window as this morning. Raw fetches are in `raw/`, `html/` and `parsed/` next to this file.

Not measured: actual citation share in ChatGPT, Perplexity, AI Overviews or AI Mode (DataForSEO / SE Ranking aren't set up), the Search Console "Search generative AI" setting (the API doesn't expose it), and the Google Business Profile (taken from Ben's manual check).

Scoring uses the morning's weights and standards. Dimensions with no new evidence keep the morning's score, so the two numbers can be compared directly. Per Google's AI optimization guide, these scores are heuristics. They are not Google signals.

---

## 0. What changed since this morning

### Today's fixes, checked against the live site

| Claimed change | Live? | Evidence |
|---|---|---|
| `/podcast.rss` channel description and subtitle now come from the site | **Yes** | The channel `<description>` opens "Transcend is Eddie Barretta's mix series and podcast, featuring his latest house and trance DJ sets with full tracklists", followed by the site's About copy ("…across the Jacksonville Beach area…"). "Tech House" and "Melodic Techno" no longer appear in the channel text. The `<itunes:subtitle>` is the Transcend sentence. |
| Feed owner email is `booking@eddiebarretta.com`, with no personal Gmail anywhere in the feed | **Yes** | The feed contains only two email addresses: `booking@eddiebarretta.com` (`<itunes:owner>`) and SoundCloud's own `feeds@soundcloud.com` (`<webMaster>`). There's no Gmail address. **New finding:** 9 older episode descriptions (Electrify, Awakening, Overdrive, Sonos, Transitions, Live @ SIP, Vivacity, Propulsion, Nostalgia) still read "DJ Eddie Barretta (*owner's legal name*)". That text appears in the feed, on those 9 mix pages and in `llms-full.txt` (§5). |
| Lumina tracklist has 18 tracks and Aura has 15 | **Yes** | The `/mixes/lumina` page header says "18 tracks" and the tracklist starts at "Sintar". Aura shows "15 tracks". The homepage "Latest mix" card and `llms-full.txt` agree. |
| Links and the Dataset JSON-LD pointing at `ai.eddiebarretta.com` removed | **Yes** | No `<link rel="alternate">` on any of the 11 fetched pages, no Dataset node, and no `ai.eddiebarretta.com` string in the HTML, llms files or feed. **But the pack itself is still live** (HTTP 200, robots allows everything, still shows Currents from Jul 14 as the latest mix) **and Bing has it indexed**: `ai.eddiebarretta.com/index.md` is the #3 result for `site:eddiebarretta.com` (§2). |
| `llms.txt` lists the booking email and phone | **Yes** | A "Booking" block lists the form, `booking@eddiebarretta.com`, the call/text line and Instagram. The morning's "there is no public booking email" sentence is gone. |
| MusicGroup JSON-LD has `telephone` | **Yes** on the homepage (`#eddie`, E.164 format) | The MusicGroup nodes on `/bar-lounge-dj` and `/private-event-dj` don't carry it. Those pages show the number as text with a `tel:` link. |
| **NOT changed (per the brief):** SoundCloud bio still says "Tech House … Melodic Techno" | **It HAS changed** | SoundCloud's live `og:description` and its RSS channel description now read: "Eddie Barretta is a house and trance DJ based in Jacksonville Beach, FL, playing euphoric, dancefloor-driven sets that blend tech house, melodic house, and vocal trance…". The bio then lists past residencies at Living Room Lounge, SIP and Dua, plus featured sets at Myth, Lemon Bar, Surfer Bar and Cataluna. That now matches the site. **The bio still ends with "Bookings & Inquiries:" followed by the personal Gmail address**, and SoundCloud's own feed still has that Gmail as `<itunes:email>`. Ben should look at the profile to confirm it is the version he meant to save. |
| **NOT changed:** homepage has no factual opening paragraph | Confirmed unchanged | The About section still opens "With an ear for infectious beats…" |
| Verified Google Business Profile (DJ service, 5.0★, 2 reviews) | Not verifiable from here | Taken from Ben's manual check. The morning local audit couldn't find a GBP. |

### Podcast directories

- **Apple Podcasts** pulls `https://eddiebarretta.com/podcast.rss` (the `feedUrl` in Apple's lookup API), not SoundCloud's feed. Its listing **already shows the new description** ("…featuring his latest house and trance DJ sets…"). There's no "melodic techno" and no Gmail address.
- **iHeart** also already shows the new description.
- **Amazon Music and Podder** render with JavaScript, so their text couldn't be read by a raw fetch. Search-engine snippets of the Podder page still show the old bio and the Gmail address (see below).

### Third-party indexes still show the old bio

Three name searches run through this session's web-search tool, a non-Google index of the kind AI assistants use, came back with the **pre-change** SoundCloud bio ("North Florida-based… Tech House… Melodic Techno") and with GigSalad's "vocal house" description. One summary also repeated the Gmail address from the Podder listing and warned it "may be a different person's address". In those summaries, SoundCloud's newest mixes date from "March to June 2026", which suggests that index's copy is months old. **The source is fixed, but these indexes haven't re-crawled it yet.** Bing and Google will catch up on their own schedules. Expect weeks, not days, for the copies held by third-party AI search indexes.

---

## 1. GEO Readiness Score: **69 / 100** (morning: 64)

| Criterion | Weight | Morning | Now | Change and why |
|---|---|---|---|---|
| Citability | 25 | 14 | **15** | **+1 (a).** The track counts are fixed, so the most original data on the site (tracklists, repeated in `llms-full.txt` and the homepage card) no longer misstates itself. The podcast feed now opens with a definitional "Transcend is…" sentence. Still open: the homepage has no factual opening block, and the About copy is adjectives, not facts |
| Structural readability | 20 | 15 | **15** | No change. Same templates, same headings |
| Multi-modal | 15 | 11 | **11** | No change |
| Authority & brand | 20 | 7 | **10** | **+2 (a):** the biggest contradiction is fixed at the source. SoundCloud now says house & trance, Jacksonville Beach, and past residencies, and Apple and iHeart carry the site's own podcast text. The site, feed and llms.txt now share one booking identity (`booking@` plus a phone line). **+1 (b):** a verified Google Business Profile with reviews exists, which the morning audit couldn't see. Still costing points: GigSalad ("vocal house") and cueup ("currently resident at SIP"); the personal Gmail address in SoundCloud's bio and feed; stale third-party indexes; no author entity for the blog; no Wikipedia, Reddit or press presence |
| Technical accessibility | 20 | 17 | **18** | **+2 (a):** the stale pack is no longer advertised from every page head, and the self-contradicting Dataset node is gone. **−1 (b):** the pack is still live and crawlable, and Bing has it indexed (#3 for `site:eddiebarretta.com`). Bing feeds Copilot and DuckDuckGo, and ChatGPT search uses it too. The morning audit didn't check Bing |
| **Total** | 100 | **64** | **69** | **+5** |

### How the +5 splits

| Bucket | Points | What |
|---|---|---|
| **(a) Real changes shipped today** | **+5** | Tracklists fixed (+1 citability). SoundCloud bio, feed text and one contact identity (+2 authority). Stale pack unlinked and Dataset node removed (+2 technical) |
| **(b) Facts the first audit couldn't see** | **0 net** | +1 for the verified GBP with 5.0★ and 2 reviews (authority). −1 because Bing indexes the stale `ai.` pack (technical). Two smaller facts were not scored because they fall inside the noise band: the PodcastSeries node already existed on `/mixes` (since 2026-07-19; the morning audit said it was missing), and 9 older episode descriptions carry the owner's legal name (a privacy question, not a GEO penalty) |
| **(c) Scoring noise / judgment** | **0 assigned** | Dimensions with no new evidence were held at the morning's values. Each dimension is roughly a ±1 judgment call, so a fresh scorer could land anywhere from about 67 to 71. The firmest part of the delta is technical +2, a binary fix. The softest is authority: the source is fixed, but AI indexes haven't picked it up yet, so a stricter reader could hold it at +1 until they do |

---

## 2. Platform breakdown (qualitative, not a measured citation score)

| Platform | Morning | Now | Evidence |
|---|---|---|---|
| **Google AI Overviews** | Moderate | Moderate | Fed by the Googlebot index. Search Console data ends on 10-10, so **no data yet covers today's changes**. 90-day numbers are unchanged: homepage 100 impressions at position 5.0, 9 clicks; venue pages carry most impressions. Brand queries are still near zero ("barretta" 1 impression, "dj barrett" 1). There's no `nosnippet` and no `X-Robots-Tag` on any fetched page |
| **Google AI Mode** | Moderate–weak | **Moderate** | AI Mode weights entity authority. A verified GBP (DJ service, reviews), the Knowledge Graph ID in `sameAs`, and SoundCloud now agreeing with the site all point one way. GigSalad and cueup still disagree |
| **ChatGPT Search** | Small | Small | GA4: chatgpt.com sent 5 sessions in 90 days, all engaged, still the only AI referrer. ChatGPT search leans partly on Bing, which indexes the site's real pages and also the stale `ai.` pack |
| **Perplexity** | Weak | Weak | No perplexity.ai referrals. No Reddit presence found |
| **Bing Copilot** | Not checked | **Partly checked** | `site:eddiebarretta.com` on Bing (and on DuckDuckGo, which uses Bing) returns the homepage, `/mixes`, both service pages, venue and mix pages, **and `ai.eddiebarretta.com/index.md` at #3**. Bing brand-query scrapes returned generic "eddie" results, so they aren't usable. Bing Webmaster Tools not checked |
| **Other AI search indexes** (this session's web-search tool) | — | **Weak** | Three name queries ("Eddie Barretta DJ Jacksonville", "\"Eddie Barretta\" DJ", "eddiebarretta.com house trance DJ Jacksonville Beach") returned SoundCloud, GigSalad, cueup and Podder, but **not eddiebarretta.com**, even with the domain in the query. The summaries still describe tech house / melodic techno or vocal house, and say "trance isn't mentioned". This is the clearest live picture of what an AI assistant "knows" today: the fixes haven't reached it yet |

GA4, 90 days to today: google 100 sessions, direct 62, Facebook 9, Instagram 6, chatgpt.com 5. The one-session referrers (`monstercrawler.com`, `wotbox.com`, …) are referral spam.

---

## 3. AI crawler access

Unchanged from this morning. `robots.txt` is `User-Agent: *` / `Allow: /` / `Disallow: /admin`, plus a deprecated `Host:` line, which is harmless. The homepage requested as OAI-SearchBot, PerplexityBot, Claude-SearchBot and GPTBot returned HTTP 200 with byte-identical HTML (244,583 bytes, 1,064 words) and no `X-Robots-Tag`. IP-based rules in the Vercel firewall weren't inspected.

**Search / citation crawlers** (these decide whether the site can be cited):

| Crawler | Governs | Status |
|---|---|---|
| Googlebot | Google Search, AI Overviews, AI Mode | Allowed |
| OAI-SearchBot | ChatGPT Search citability | Allowed (UA fetch: 200) |
| Claude-SearchBot | Claude search citability | Allowed (UA fetch: 200) |
| PerplexityBot | Perplexity search | Allowed (UA fetch: 200) |
| Applebot | Siri / Spotlight / Safari search | Allowed |

**Training crawlers** (a licensing choice, with no effect on search visibility):

| Crawler | Governs | Status |
|---|---|---|
| GPTBot | OpenAI model training | Allowed (UA fetch: 200) |
| ClaudeBot | Anthropic model training | Allowed |
| Google-Extended | Gemini / Vertex training & grounding | Allowed |
| Applebot-Extended | Apple Intelligence training opt-out | Allowed (not opted out) |
| CCBot | Common Crawl | Allowed |

**User-triggered fetchers** (ChatGPT-User, Claude-User, Perplexity-User, Google-Agent): allowed.

**RSL 1.0:** none. There's no `License:` line in robots.txt, `/license.xml` returns 404, and no `rel="license"`. That's optional, and not scored.

---

## 4. llms.txt status

**Present and improved.** `/llms.txt` (5.9 KB) and `/llms-full.txt` (109 KB) are generated live. Since this morning, `llms.txt` has a real Booking block (form, `booking@`, call/text line, Instagram, service area), and the sentence saying there's no public email is gone. `llms-full.txt` carries the corrected Lumina (18) and Aura (15) tracklists. As before, Google says llms.txt does nothing for Search, and the score gives it no weight.

**The competing file is unlinked but not gone.** `ai.eddiebarretta.com/llms.txt` and `/index.md` still serve the July snapshot, where Currents is the "latest mix". The subdomain resolves to a non-Vercel host, its robots.txt allows everything, and Bing has indexed `index.md`. Removing the links stopped the site from pointing at it, but crawlers that already know the URL will keep finding it. See Top 5, #3.

---

## 5. Brand mention analysis

| Platform | Morning | Now |
|---|---|---|
| Wikipedia / Wikidata | None | None. Expected for a local DJ; notability makes this unrealistic for now |
| Reddit | None found | None found |
| LinkedIn | None found | None found |
| YouTube | Channel, 40 items, mostly Shorts with inside-joke titles | Not re-checked (no change reported) |
| **SoundCloud** | **Contradicted the site** (tech house / melodic techno, North Florida) | **Matches the site** on genre, base and past residencies. The personal Gmail address is still the "Bookings & Inquiries" line and SoundCloud's feed owner email |
| Apple Podcasts / iHeart | Inherited the SoundCloud bio | **Show the site's own podcast description** |
| Amazon Music / Podder | Inherited the SoundCloud bio | Unreadable by raw fetch. Search snippets of Podder still show the old bio and the Gmail address |
| GigSalad | "Vocal house", 80s/90s/2000s remixes | Unchanged per search snippets (direct fetch still 403) |
| cueup.io | "Currently resident at SIP" | Unchanged per search snippets |
| **Google Business Profile** | Not found | **Verified (Ben): DJ service, 5.0★, 2 reviews.** The site doesn't link it yet, except possibly through the `kgmid` search URL in `sameAs` |

### Contact identity: mostly fixed, one place left

The site, `llms.txt`, the site's podcast feed (and so Apple and iHeart) now all say `booking@eddiebarretta.com`. **The Gmail address survives in two SoundCloud-controlled places:**

1. the "Bookings & Inquiries" line at the end of the new SoundCloud bio,
2. SoundCloud's own podcast owner email (`<itunes:email>` in `feeds.soundcloud.com/…/sounds.rss`).

Any directory that reads SoundCloud's feed instead of the site's will keep showing the Gmail address. The `PodcastSeries` node on `/mixes` also points machines at SoundCloud's feed (§9). AI summaries in this session still flag the address as possibly belonging to "a different person", which is the stage-name versus owner-name split the morning audit described.

### The owner's legal name on 9 mix pages

Separate from the email: the 9 older SoundCloud descriptions listed in §0 say "DJ Eddie Barretta (*legal name*)". They flow into those mix pages, `llms-full.txt` and the feed. The morning audit said whether to link the two names publicly is Ben's call. Today's email change removed one of the two links between the names. These descriptions are the other one. For GEO the name is neutral to slightly helpful, since it ties the entity together. For privacy, Ben should decide: either edit those 9 descriptions on SoundCloud, or strip the parenthetical in `lib/mixes-store.ts` when the site imports them.

---

## 6. Passage-level citability

**Strong passages (unchanged; keep):**

- **Homepage FAQ** (4 Q&As, 20–30 words each): good answers, but still at the very bottom of a 1,064-word page.
- **`/bar-lounge-dj` opening**: "Eddie Barretta is a house & trance DJ based in Jacksonville Beach, FL. He has held residencies at a rooftop cocktail bar and two lounges…". This is still the best definitional block on the site. The "How booking works" section now adds a call/text line.
- **Venue pages**: address and venue type, plus one sentence about Eddie ("Eddie held a residency at SIP…").
- **Blog posts**: dated, 4 sources in "Further reading", and `citation` in schema.
- **Tracklists**: original data, and now accurate on all 58 mixes. Lumina reads "18 tracks", which matches its own "18-track journey" copy.

**New strong passage:** the podcast channel description, which directories show, now opens with a self-contained definition: "Transcend is Eddie Barretta's mix series and podcast, featuring his latest house and trance DJ sets with full tracklists."

**Still weak:**

- **Homepage About** (above the fold): four adjective-led sentences with no year, number, named residency or credential. This is the biggest on-site citability gap left.
- **Mix page intros** are SoundCloud copy ("LUMINA ✨"). There's no generated factual line yet.
- **Shows times**: the past set on "Fri 14 Aug" at Dua still reads "9:00 - 1:00 PM" (should be 1:00 AM).
- **Blog posts** still lead with the trade-press recap. Eddie's own take is in the last paragraph.
- **FAQ "How can I book…?"** answer (visible text and FAQPage schema) mentions only the form and Instagram. It should match `llms.txt` and add `booking@` and the phone line.

---

## 7. Server-side rendering check

**Pass**, unchanged. Word counts below are raw HTML with scripts and styles stripped, the same method as the morning table. The `parse_html.py` body counts are lower because they leave out navigation and footer.

| Page | Morning | Now | JSON-LD now |
|---|---|---|---|
| `/` | 1,026 | 1,064 | MusicGroup (+telephone), WebSite, SiteNavigationElement, FAQPage (Dataset gone) |
| `/blog/ai-enters-the-live-dj-set` | 835 | 835 | BlogPosting (+citation), BreadcrumbList |
| `/mixes/lumina` | 351 | 348 | MusicRecording, AudioObject, BreadcrumbList |
| `/venues/sip-cocktail-bar` | 247 | 247 | Place, BreadcrumbList |
| `/bar-lounge-dj` | 523 | 532 | Service, MusicGroup, BreadcrumbList |
| `/private-event-dj` | — | 623 | Service, MusicGroup, BreadcrumbList |
| `/mixes` | — | 546* | CollectionPage, ItemList (58), **PodcastSeries** |

\* `parse_html.py` count.

Pages are served from the Vercel cache (`HIT` / `STALE`, `X-Nextjs-Prerender: 1`). The 57 `opacity:0` elements on the homepage are unchanged; text crawlers read them fine, so they stay low priority.

---

## 8. Top 5 highest-impact changes (remaining)

1. **Finish the contact identity on SoundCloud.** *(Ben, off-site, ~5 min.)* Change the bio's "Bookings & Inquiries" line to `booking@eddiebarretta.com`, and set SoundCloud's podcast owner email (Settings → Content / RSS) to the same address. That removes the last public Gmail address from Eddie's profiles and from any directory that reads SoundCloud's feed. In the same pass, decide what to do about the legal name in the 9 older episode descriptions (§5).
2. **Put a factual answer block above the fold on the homepage** (draft in §10). The morning's #4, still open. Now that SoundCloud and the feed say the right thing, the site's own first ~60 words are the weakest link in the "who is Eddie Barretta" answer.
3. **Retire `ai.eddiebarretta.com` for good, not just unlink it.** It is still live and still in Bing's index, showing a July "latest mix". Best option: 301 the subdomain to the apex, or remove the Geordy project and DNS record. Next best: `Disallow: /` plus `noindex` there. Then use Bing Webmaster Tools' "Remove URL" (free) for `ai.eddiebarretta.com/index.md`. Also check Search Console for the subdomain (the `sc-domain:` property covers it).
4. **Align the last two third-party profiles and connect the GBP.** *(Ben, off-site.)* Update GigSalad (it says "vocal house") and cueup (it says "currently resident at SIP") to match the site and the new SoundCloud bio. Add the GBP's Maps link to `sameAs` (§9), make its description match the site's first sentence, and keep asking happy clients for reviews. A GBP with reviews is the strongest local entity signal the site has.
5. **Venue pages: residency years plus a one-line answer.** Venue pages draw most of the site's impressions (Lucky's 910, Living Room Lounge 459, SIP 322, Dua 240 in 90 days, apex + www) at ~0–1% CTR. A line like "Resident DJ, 20xx–20xx" plus "Who DJs at SIP? House and trance DJ Eddie Barretta held a residency…" is the passage an AI engine can lift for "who plays house music at SIP Jacksonville".

Next tier (unchanged from this morning unless noted):

- **Schema entity linking** (§9): blog author `@id`, PodcastSeries `webFeed`, and `email` on MusicGroup. Each is a few lines.
- **Mix-page factual intro**, generated from data already on the page (§10).
- **Blog: Who/How/Why.** Add an author page or bio and a one-line process note, and lead with the local, first-hand angle.
- **Original data from the tracklists** (now all accurate): most-played artists in Transcend, the genre mix across 2025–2026.
- **YouTube titles** with genre, venue and city, plus the site URL in descriptions.
- **Reddit**: genuine participation in r/jacksonville / r/jaxbeach nightlife threads.
- **Shows**: fix "9:00 - 1:00 PM" → "9:00 PM – 1:00 AM".
- **Wait, then re-check.** The web-search indexes AI assistants use still hold the old SoundCloud bio. Re-run the three name queries in §2 in 2–4 weeks. If they still say "melodic techno", the cached Podder and SoundCloud pages are the ones to chase.

---

## 9. Schema recommendations

None of these produces a Google rich result except Event. They help machines resolve one entity with one set of facts.

1. **Link the blog author to the main entity** (unchanged). `BlogPosting.author` and `publisher` are still a separate `Person` named "Eddie Barretta" with no `@id`. Use `{"@id": "https://eddiebarretta.com/#eddie"}`.
2. **PodcastSeries already exists** on `/mixes` (`@id …/#transcend`, with `sameAs` to Apple, Amazon, YouTube, iHeart and SoundCloud). The morning report missed it. Three fixes:
   - change `webFeed` from SoundCloud's feed to `https://eddiebarretta.com/podcast.rss`, the feed Apple actually uses and the one with the right owner email and description;
   - reference `#transcend` from the homepage MusicGroup, for example as a `subjectOf` item;
   - on mix pages, replace `inAlbum: MusicAlbum "Transcend"` with a reference to `#transcend` (`partOfSeries` if you switch them to `PodcastEpisode`).
3. **MusicGroup contact**: add `"email": "booking@eddiebarretta.com"` next to the new `telephone`. Put both on the MusicGroup nodes of `/bar-lounge-dj` and `/private-event-dj` too, or make those nodes `{"@id": "…/#eddie"}` references so the facts live in one place.
4. **`sameAs`**: add the GBP's Google Maps URL (the `maps.google.com/?cid=…` or `g.page` link from the profile) next to the `kgmid` search URL. Add GigSalad only after its bio matches.
5. **Venue relationships**: past `Event` nodes or a residency role with dates (unchanged).
6. **Upcoming shows**: `MusicEvent` with performer `#eddie` when dates are public (unchanged; rich-result eligible).
7. **FAQPage**: keep it, and add the email and phone to the booking answer so it matches `llms.txt`.
8. ~~Dataset node~~: **done** (removed).

---

## 10. Content reformatting suggestions

**Homepage, first block under the H1** (bracketed items need Ben's facts). This is the morning draft, updated with the booking channels:

> Eddie Barretta is a house and trance DJ based in Jacksonville Beach, Florida. He has held residencies at SIP Cocktail Bar (Downtown Jacksonville) [years], Living Room Lounge (Atlantic Beach) [years] and Dua Lounge (Baymeadows) [years], and played featured sets at Myth Nightclub, Lemon Bar, Surfer [The Bar] and Cataluna Lounge. His mix series and podcast, Transcend, has published 58 episodes since [year] on SoundCloud, Apple Podcasts, Amazon Music and YouTube, each with a full tracklist. He books bar nights, residencies and private events across Jacksonville and Northeast Florida. Booking: booking@eddiebarretta.com or the form below.

Keep the existing poetic lines after it.

**Venue page (e.g. `/venues/sip-cocktail-bar`)**, one answer line near the top:

> **Who DJs at SIP?** House and trance DJ Eddie Barretta held a residency at SIP Cocktail Bar [years], playing rooftop sunset sets; two recordings, Last Call @ SIP and Live @ SIP, are below.

**Mix page intro**, a generated line ahead of the SoundCloud copy (all the inputs are now correct):

> Lumina is an 18-track, 1:15:56 house and trance mix by Eddie Barretta, released September 27, 2026 as an episode of the Transcend podcast. It features Dombresky, YOTTO, Cassian, Sasha, BT and Gareth Emery.

**Blog posts**: open with the local, first-hand paragraph, which today is the last one ("For a bar-circuit DJ, none of this changes the actual job…"), then the industry news.

**Shows**: "9:00 PM – 1:00 AM" for after-midnight sets.

**FAQ booking answer**: "Use the booking form at eddiebarretta.com/#book, email booking@eddiebarretta.com, call or text the booking line, or message @djeddiebarretta on Instagram."

---

### Sources consulted

- Live site, fetched 2026-10-12 ~18:30 UTC: `/`, `/mixes`, `/mixes/lumina`, `/mixes/aura`, `/mixes/electrify`, `/venues`, `/venues/sip-cocktail-bar`, `/venues/luckys-bar`, `/bar-lounge-dj`, `/private-event-dj`, `/blog`, `/blog/ai-enters-the-live-dj-set`, `/robots.txt`, `/sitemap.xml` (78 URLs), `/llms.txt`, `/llms-full.txt`, `/podcast.rss` (58 items). `ai.eddiebarretta.com/{,llms.txt,index.md,robots.txt}`
- Repo history (read-only): commits `4dd4a5a`, `5213155`, `1827a58` (2026-10-12), and `eb607eb` (2026-07-19, when PodcastSeries was added)
- SoundCloud profile `og:description` and `feeds.soundcloud.com/users/soundcloud:users:211674230/sounds.rss`
- Apple lookup API (`itunes.apple.com/lookup?id=1678351064`), and the Apple Podcasts and iHeart listing pages
- Bing and DuckDuckGo `site:eddiebarretta.com` (brand-query scrapes returned unusable generic results)
- This session's web-search tool: three name queries, results as of 2026-10-12
- Search Console `sc-domain:eddiebarretta.com`, 2026-07-12 → 2026-10-11 (data ends 10-10). GA4 `properties/413704038`, 2026-07-12 → today
- Google AI optimization guide (via the claude-seo reference synthesis): https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Not fetched directly: GigSalad (403), cueup, Podder and Amazon (client-rendered); search snippets only
