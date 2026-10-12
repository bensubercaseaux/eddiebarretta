# Local SEO Analysis: eddiebarretta.com (re-run)

Run 2026-10-12, afternoon. This re-runs the Claude SEO plugin's `seo-local` skill (v2.4.2) and compares the result with this morning's audit (`docs/seo-audits/2026-10-12-local.md`, 33/100). Analysis only; no repo files changed.

**Sources:** the live site, fetched with the plugin's `render_page.py`: home, `/bar-lounge-dj`, `/private-event-dj`, `/venues`, two venue pages, the Lumina and Aura mix pages, robots, sitemap, `llms.txt`, `llms-full.txt` and `/podcast.rss`. Also Google Search Console (`sc-domain:eddiebarretta.com`, queries, pages and URL Inspection), the SoundCloud profile's embedded JSON, and the GigSalad listing (rendered with Playwright this time). Web searches found a CueUp profile, and its page was fetched. Facts Ben checked by hand today are used where noted, and are kept apart in the comparison. Raw fetches are in `raw/` next to this file.

## Local SEO Score: 55/100 (was 33)

| Dimension | Weight | This morning | Now | Weighted now | One-line reason |
|---|---|---|---|---|---|
| GBP signals | 25% | 15 | **60** | 15.0 | Verified GBP with the right primary category ("DJ service"), a service area and the website set. Missing: hours, any link to it from the site; the phone swap isn't finished |
| Reviews & reputation | 20% | 10 | **30** | 6.0 | 3 reviews on 2 platforms, all 5.0, one from today. Far below the 10-review threshold; no testimonials on the site |
| Local on-page | 20% | 70 | **80** | 16.0 | The phone is now visible as a `tel:` link on the home booking section and both service pages. Not above the fold or in the footer; the form is still home-only |
| NAP & citations | 15% | 35 | **60** | 9.0 | Page and schema now agree on name, city and phone. GBP, GigSalad and CueUp are all present. Bing Places, Apple, Yelp and Facebook are still missing; SoundCloud shows a personal email |
| Local schema | 10% | 60 | **65** | 6.5 | `telephone` added. `areaServed` is still a string; `sameAs` is still a Google search URL; no `contactPoint` |
| Local links & authority | 10% | 20 | 20 | 2.0 | No press, best-of lists or venue links found |
| **Total** | | **33** | **54.5 → 55** | | |

The rubric is built for storefronts, so read the number with that in mind. Most of the 22-point gain comes from information the morning run had no way to see (the GBP and its reviews), not from today's site changes. Today's site changes are real, but **Google hasn't crawled them yet** (see "Index status" below).

## What changed since this morning: the delta, split

Total change: **+21.5 weighted points** (33.0 → 54.5).

| Bucket | Weighted pts | Where it comes from |
|---|---|---|
| **(a) Real changes made today** | **+4.3** | On-page +10 (phone visible with `tel:` on home, `/private-event-dj`, `/bar-lounge-dj`) = +2.0 · NAP +12 (the page and the JSON-LD now carry the same phone, +10; the SoundCloud bio now says house & trance, +2) = +1.8 · Schema +5 (`telephone` on MusicGroup) = +0.5 |
| **(b) Facts the first audit couldn't see** (Ben's hand checks) | **+15.75** | GBP +45 (exists, verified, primary category DJ service, service area, website link) = +11.25 · Reviews +15 (2 Google reviews, 5.0, one today) = +3.0 · NAP +10 (GBP counts as a Tier 1 citation; the SoundCloud city was already Jacksonville Beach; GigSalad's house-only wording is deliberate private-event positioning that matches `/private-event-dj`) = +1.5 |
| **(b′) New facts found by this run** (not from Ben, not in the morning report) | **+1.45** | A **CueUp** profile (`cueup.io/user/dj-eddie-barretta`): Jacksonville Beach, identity verified, 1 five-star review. Reviews +5 = +1.0 · NAP and citations +3 = +0.45. GigSalad rendered this time and shows **0 reviews**: that confirms the morning's unknown and changes no score |
| **(c) Scoring noise / judgment** | **0 by construction, ±5 band** | I kept every dimension's morning score as the baseline and moved it only for evidence. The judgment is in how much each fact is worth. GBP could fairly sit at 50–70 (±2.5 total), reviews at 25–40 (−1/+2), NAP at 55–65 (±0.75). Two runs of this rubric on the same facts could reasonably land 50–60 |

**Note on SoundCloud.** The brief said the SoundCloud bio still says "Tech House … Melodic Techno". The **live** profile says otherwise: the `description` field (last modified **2026-10-12 17:40 UTC**) now reads "a house and trance DJ based in Jacksonville Beach, FL … tech house, melodic house, and vocal trance". The genre half of that to-do is done. The to-do line in `docs/outstanding.md` (line 12) and the umbrella `outstanding_items.md` could be narrowed to the email. Search-engine snippets still show the old bio until SoundCloud is recrawled. **What's left on SoundCloud is the bookings email: it is still Ben's personal Gmail, not `booking@eddiebarretta.com`.**

### Today's site changes, verified live

| Change | Live? | Where checked |
|---|---|---|
| Public phone (904) 867-8008 as `tel:+19048678008` | Yes | Home booking section ("@djeddiebarretta · (904) 867-8008"); `/private-event-dj` and `/bar-lounge-dj` ("Prefer to talk? Call or text (904) 867-8008"). Not in the footer; not on venue, mix or blog pages |
| `telephone` in MusicGroup JSON-LD | Yes | Home `@graph` → `#eddie`: `"telephone": "+19048678008"`. The service pages' `Service.provider` is a stub without it, which is fine since `@id` links it |
| Phone and `booking@eddiebarretta.com` in `llms.txt` | Yes | `llms.txt` and `llms-full.txt` "Booking" section |
| Podcast feed owner `booking@eddiebarretta.com` | Yes | `/podcast.rss` → `itunes:owner/itunes:email` |
| Feed show text from the site (house & trance), not the SoundCloud bio | Yes | Channel `description` and `itunes:subtitle` |
| Lumina / Aura tracklists fixed | Yes | `/mixes/lumina` lists 18 tracks, `/mixes/aura` 15 (matches the commit: 21→18, 18→15) |
| Stale `ai.eddiebarretta.com` links removed | Yes | 0 occurrences in home, service pages, venues, mixes, blog, llms files and the feed |
| The personal Gmail is not published on the site | Yes | 0 occurrences in all fetched site files |

### Index status (why none of this has counted yet)

- Homepage last crawled **2026-10-12 16:58 UTC**, before today's deploys (13:44–14:27 EDT). Google's copy still has the removed "AI/LLM Resource Pack" Dataset (rich-result warning: missing `license`). That will drop off on the next crawl, as intended.
- `/private-event-dj` last crawled **2026-09-16**.
- Search Console data ends 2026-10-10, so the numbers match this morning's exactly: DJ-intent queries (regex `dj|eddie|barretta|house|trance|book|hire|party|event`, 6 months) = **5 queries, 6 impressions, 0 clicks**; `/private-event-dj` 4 impressions at position 21; `/bar-lounge-dj` 29 at 8.1. Venue lookups still supply nearly all impressions. `/venues/luckys-bar` now leads with 771 impressions (90 days) and 0 clicks.

## Business type: Service Area Business (SAB)

Unchanged. There's no street address on the site, the schema has `areaServed` and no `streetAddress`, and the GBP is set up as a service-area business with its address hidden. The map-embed and street-address checks don't apply.

## Industry vertical

None of the skill's six verticals fits, so the generic LocalBusiness path applies (performer / entertainment). Two audiences: **bar and lounge bookings** come through venue relationships and Instagram. **Private events** come from search, the map pack and directories, and that's where local SEO pays off. The GBP's "DJ service" category serves the private-event side. GigSalad and CueUp both carry the private-event "vocal house, no trance" positioning, which is consistent with `/private-event-dj` ("He doesn't play trance at private parties").

## 1. GBP optimization checklist

| Signal | Status |
|---|---|
| GBP listing exists / verified | **Yes, verified** (Ben's check) |
| Primary category | **"DJ service"**: correct. This is the #1 pack factor, and a wrong one is the #1 negative factor |
| Additional categories | Unknown. Add only ones that truly fit. Don't stretch into "Wedding DJ"-type categories he doesn't serve |
| Service area | Set, "Jacksonville → Fernandina Beach". Make sure the Beaches he actually plays are listed (Jacksonville Beach, Atlantic Beach, Neptune Beach, Ponte Vedra Beach). Per the skill's reference this doesn't move rankings (the verification address does), but it shapes where the profile is shown as serving |
| Phone | **Being switched today** from a personal number to (904) 867-8008. Until it's done, the GBP and the site show different numbers |
| Business hours | **None set.** "Open at time of search" is ranking factor #5. A SAB can set the hours the line is answered (for example, daily, late morning to late evening). This is the cheapest GBP gain left |
| Website link | eddiebarretta.com (homepage). The skill's Sterling Sky "Diversity" note says not to point the GBP at your strongest page. That argues for `/private-event-dj`, but that page has no form yet. **Low priority**; revisit once the form is on the service page |
| Photos / video | Unknown. Upload set photos, venue shots and short clips; there's plenty of material |
| Posts | Unknown. Each new Transcend mix is a natural post |
| Q&A | Not applicable (API discontinued 2025-11-03). The site FAQ covers it |
| GBP link on the website | **None.** `sameAs` and `llms.txt` still point at `google.com/search?kgmid=/g/11yzw30vry`, a search URL, not the profile. Swap it for the GBP's Maps share link |
| Google Verified badge | Not assessed |

## 2. Review health snapshot

| Platform | Count | Rating | Newest | Notes |
|---|---|---|---|---|
| Google (GBP) | **2** | 5.0 | **Today** | Ben's check. Owner replies: unknown; reply to both |
| CueUp | 1 | 5.0 | Sept 2024 | A Living Room Lounge manager's "resident DJ" testimonial. Its text calls him by his real name instead of "Eddie Barretta" (an entity-consistency nit; worth asking the reviewer to repeat it on Google under the stage name) |
| GigSalad | **0** | — | — | Confirmed this run ("Be the first to review"). This morning it was a 403 |
| On-site testimonials | 0 | — | — | None on home or either service page |
| `aggregateRating` in schema | none | — | — | Correct. Self-serving review markup on your own entity isn't eligible |

Against the skill's benchmarks: under the 10-review "magic" threshold, rating perfect, recency good (one today). The skill's 18-day example says steady flow beats totals, so the job now is cadence. Ask every private-event host the same way, right after the party. Ask the residency venue managers (SIP, Dua, Living Room Lounge). Never pre-screen for satisfaction: review gating is banned by Google and the FTC (up to $53,088 per violation).

## 3. NAP consistency audit

SAB: no street address by design. Comparing name, area, phone, contact and genre line:

| Source | Name | Area | Phone | Email / contact | Genre line |
|---|---|---|---|---|---|
| Site, visible | Eddie Barretta | Jacksonville Beach, FL | **(904) 867-8008** (home booking + both service pages) | Form (home) + @djeddiebarretta | House & trance |
| Site JSON-LD (MusicGroup) | Eddie Barretta / DJ Eddie Barretta | Jacksonville Beach, FL | **+19048678008** | none | House, Trance + 8 sub-genres |
| `llms.txt` / podcast feed | Eddie Barretta | Jacksonville Beach | (904) 867-8008 (llms) | **booking@eddiebarretta.com** | House & trance |
| GBP (Ben) | (as set) | SA: Jacksonville → Fernandina Beach | **Mid-switch** to (904) 867-8008 | — | Category: DJ service |
| SoundCloud | Eddie Barretta | **Jacksonville Beach, FL** ✓ | none | **Personal Gmail** ✗ | House and trance ✓ (edited 17:40 UTC today) |
| GigSalad | Eddie Barretta | Jacksonville Beach | via platform | via platform | Vocal house for private events (deliberate) |
| CueUp | DJ Eddie Barretta | Jacksonville Beach | via platform | via platform | Same vocal-house bio as GigSalad; **genre tags include Techno, Disco, Latin** |

Remaining discrepancies:
1. **GBP phone**: finish the swap so GBP = site = schema.
2. **SoundCloud bookings email**: personal Gmail vs `booking@eddiebarretta.com` everywhere else. One booking contact everywhere.
3. **CueUp genre tags** (Techno, Disco, Latin) sit oddly next to its own "Eddie plays house — always" bio. Trim them to house-family tags.
4. Search-engine snippets for SoundCloud (old "Tech House / Melodic Techno" bio) and some CueUp city pages (an older bio: "resident at SIP… available in SC, GA, NC, TN, FL, AL") are stale caches. They'll refresh on recrawl; nothing to do but wait.

Fixed since this morning: the site now shows a phone; the SoundCloud city and genre agree with the site; GigSalad's wording is intentional, not a conflict.

## 4. Citation presence check

| Directory | Status |
|---|---|
| Google Business Profile | **Present, verified** (Tier 1) |
| Bing Places | Not found. A scripted Bing search returned generic results, so this is unconfirmed. Bing Places feeds Bing Maps, Copilot and ChatGPT's local answers, and can import from the GBP |
| Apple Business Connect / Apple Maps | Not found |
| Yelp | Not found |
| Facebook page | Not found |
| GigSalad | **Present** (0 reviews, $500–$2,000, Jacksonville Beach) |
| CueUp | **Present** (new to this report): verified identity, 1 review, from $125/hour, links to eddiebarretta.com |
| The Bash | Not found |
| Thumbtack | Not found |
| Resident Advisor | Not found |
| SoundCloud, Instagram, TikTok, YouTube, Apple Podcasts, iHeart, Amazon Music | Present, linked from the site / `llms.txt` |
| Data aggregators (Data Axle, Foursquare) | Not checked; low priority for a SAB performer |

## 5. Local schema status

**Present and valid:** the homepage `@graph` has MusicGroup `#eddie` (`location` → Jacksonville Beach, `makesOffer` → DJ booking Service, **`telephone` new today**), WebSite, FAQPage and SiteNavigationElement. Service pages have Service (`provider` → `#eddie`) + BreadcrumbList. Venue pages have Place with addresses. Mix pages have MusicRecording/MusicAlbum + AudioObject. No Event items (the calendar says "No public dates on the calendar right now").

**Still missing:**
- `areaServed` is a free-text string on MusicGroup and both Services.
- `sameAs` includes the Google **search** URL; it lacks the GBP, GigSalad, CueUp and Apple Podcasts.
- No `contactPoint` / `email` (the booking address is now public, so it can go in).
- No LocalBusiness-family type to hold `areaServed` / `priceRange` properly (optional; not a ranking factor).
- No `openingHoursSpecification`: consistent with the GBP having no hours. Add both together or neither.

**Ready-to-use change** for the homepage MusicGroup node (source: `lib/site.ts`). Keep the existing `genre`, `description`, `makesOffer` and `location`:

```json
{
  "@type": ["MusicGroup", "EntertainmentBusiness"],
  "@id": "https://eddiebarretta.com/#eddie",
  "name": "Eddie Barretta",
  "alternateName": "DJ Eddie Barretta",
  "url": "https://eddiebarretta.com",
  "image": "https://eddiebarretta.com/hero.png",
  "telephone": "+19048678008",
  "email": "booking@eddiebarretta.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Jacksonville Beach",
    "addressRegion": "FL",
    "addressCountry": "US"
  },
  "areaServed": [
    { "@type": "City", "name": "Jacksonville Beach", "sameAs": "https://en.wikipedia.org/wiki/Jacksonville_Beach,_Florida" },
    { "@type": "City", "name": "Jacksonville", "sameAs": "https://en.wikipedia.org/wiki/Jacksonville,_Florida" },
    { "@type": "City", "name": "Neptune Beach", "sameAs": "https://en.wikipedia.org/wiki/Neptune_Beach,_Florida" },
    { "@type": "City", "name": "Atlantic Beach", "sameAs": "https://en.wikipedia.org/wiki/Atlantic_Beach,_Florida" },
    { "@type": "City", "name": "Ponte Vedra Beach", "sameAs": "https://en.wikipedia.org/wiki/Ponte_Vedra_Beach,_Florida" }
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "booking",
    "telephone": "+19048678008",
    "email": "booking@eddiebarretta.com",
    "url": "https://eddiebarretta.com/#book",
    "areaServed": "US"
  },
  "priceRange": "$500–$2,000",
  "sameAs": [
    "https://instagram.com/djeddiebarretta",
    "https://www.tiktok.com/@eddie_barretta",
    "https://soundcloud.com/eddie-barretta",
    "https://www.youtube.com/channel/UCoNhqZqV16sOxdxROqUMPHw",
    "https://podcasts.apple.com/us/podcast/transcend/id1678351064",
    "https://www.gigsalad.com/eddie_barretta_jacksonville_beach",
    "https://cueup.io/user/dj-eddie-barretta",
    "<GBP Maps share link from business.google.com>"
  ]
}
```

Drop the `google.com/search?kgmid=…` entry here and in `llms.txt`'s "Social → Google" line. `priceRange` copies GigSalad's public range; leave it out if quotes should stay private. Also consider adding the phone to the FAQ answer "How can I book Eddie Barretta to DJ my event?", both on the page and in FAQPage. It currently names only the form and Instagram.

## 6. Location page quality

Unchanged and fine. It's a single-area SAB, so there are no city pages, which is correct. The eight venue pages each describe a real, different room with its own address, so they pass the swap test and aren't doorways. They still mostly attract people looking up the bars. Their titles already lead with "DJ at …", which is about all that can be done there.

## 7. Top 10 prioritized actions

| # | Priority | Action | Who |
|---|---|---|---|
| 1 | **Critical** | **Build the review cadence to 10+ on Google.** Ask every private-event host right after the event and the residency venue managers. Ask the Living Room Lounge manager who wrote the CueUp testimonial to post it on Google under "Eddie Barretta". Reply to both existing reviews and every new one. Ask everyone the same way, with no gating | Ben / Eddie |
| 2 | **Critical** | **Finish the GBP:** complete the phone swap to (904) 867-8008; **set hours** (when the line is answered); upload photos and set clips; post each new mix; confirm the service area lists the Beaches; add only fitting extra categories | Ben |
| 3 | High | **Link the site to the GBP:** replace the `kgmid` search URL in `sameAs` and `llms.txt` with the GBP Maps share link; add GigSalad, CueUp and Apple Podcasts to `sameAs` (schema in §5) | Code (needs the link from Ben) |
| 4 | High | **Claim Bing Places and Apple Business Connect**, importing from the GBP (both free). These are Tier 1 and feed Copilot, ChatGPT local answers, Siri and Apple Maps | Ben |
| 5 | High | **One booking contact everywhere:** SoundCloud's bookings line → `booking@eddiebarretta.com` (the genre fix there is already live); trim CueUp's Techno/Disco/Latin tags; narrow the to-do lines in `docs/outstanding.md` and `outstanding_items.md` to the email | Ben |
| 6 | Medium | **Request indexing** in Search Console for `/`, `/private-event-dj` and `/bar-lounge-dj`, so the phone and schema get picked up. `/private-event-dj` was last crawled 09-16 | Ben (GSC UI) |
| 7 | Medium | **Phone everywhere a booker lands:** in the sitewide footer, in the FAQ answer + FAQPage, and as a tap-to-call near the top of the service pages on mobile. Put the booking form itself on `/private-event-dj` and `/bar-lounge-dj` (they still link to `/#book`) | Code |
| 8 | Medium | **Schema edits from §5:** structured `areaServed`, `contactPoint` with the booking email, `EntertainmentBusiness` second type, real `sameAs` | Code |
| 9 | Medium | **2–3 real testimonials on `/private-event-dj`** (the Living Room Lounge quote, with permission, plus Google reviewers who agree), and **list on The Bash** (and Thumbtack if wanted). Get reviews on GigSalad too | Code + Ben |
| 10 | Low | **Dates back on the calendar** (Event schema is at 0, and dates give GBP posts something to say). **Earn local links:** venue entertainment pages, Jacksonville nightlife writers, "best DJs in Jacksonville" lists. Once the service page has the form, consider pointing the GBP website link at `/private-event-dj` | Ben |

## 8. Limitations

Not assessed, or only partly:
- **The GBP itself:** no GBP API access. Category, service area, reviews and phone status are Ben's hand checks. Secondary categories, photos, posts, owner replies and Insights are unknown.
- **Bing / Bing Places:** a scripted Bing search returned generic results, so this is inconclusive.
- **Apple Business Connect, Yelp, Facebook:** searched, not found; the dashboards themselves weren't checked.
- **Live map-pack and organic positions** for "DJ Jacksonville Beach" (needs DataForSEO, BrightLocal or Local Falcon geo-grids), **backlinks / Domain Authority** (Ahrefs, Semrush, Moz), **GBP Insights**.
- **Effect of today's changes:** none measurable yet. Search Console data ends 10-10 and Google hasn't recrawled the changed pages. Re-pull the DJ-intent regex in 2–4 weeks.
- GSC hides rare queries, so branded searches are under-counted.
- This morning's raw fetches (`eb-local-raw/`) weren't kept, so the comparison is against the morning report's text, not a byte-level diff.
- The skill's benchmarks (review thresholds, factor weights) come from storefront studies and apply loosely to a performer.

Side note outside local SEO: a past-sets row on the homepage reads "Fri 14 Aug … 9:00 - 1:00 PM" (probably 9 PM–1 AM).

### Sources
- Live site and `llms.txt`, `podcast.rss`, `sitemap.xml` (fetched 2026-10-12 ~18:36 UTC; raw in `raw/`)
- [SoundCloud: eddie-barretta](https://soundcloud.com/eddie-barretta) (embedded user JSON, `last_modified` 2026-10-12T17:40:35Z)
- [GigSalad: Eddie Barretta](https://www.gigsalad.com/eddie_barretta_jacksonville_beach) (Playwright render)
- [CueUp: DJ Eddie Barretta](https://cueup.io/user/dj-eddie-barretta)
- Google Search Console, `sc-domain:eddiebarretta.com`: queries 2026-04-12 → 10-10, pages 07-12 → 10-10, URL Inspection for `/` and `/private-event-dj` (summary in `raw/gsc-summary.json`)
- Ben's hand-verified facts (GBP, Google reviews, SoundCloud city, GigSalad intent), 2026-10-12
