# Outstanding items — eddiebarretta.com (as of 2026-08-27)

Site: Next.js + Tailwind on Vercel; mixes from SoundCloud RSS (`lib/mixes-store.ts`), shows in `lib/shows.ts`, venues, booking form via Resend, podcast RSS, admin.

## Contact channels (2026-10-12)

- **Email:** `booking@eddiebarretta.com` → Ben's inbox via Cloudflare Email Routing. DNS moved GoDaddy → Cloudflare for this (registrar is still GoDaddy). It is the podcast feed's owner email (`site.podcastOwnerEmail`) and is listed in llms.txt. The personal address is never published.
- **Phone:** (904) 867-8008, Twilio subaccount "Eddie Barretta" under Avant Concepts. Voice webhook → `/api/voice`, messaging → `/api/sms` (README "Phone line"). The Vercel Production env has `TWILIO_AUTH_TOKEN`, `TWILIO_NUMBER` and `FORWARD_TO_NUMBER`. Calls ring Ben's cell with a press-1 whisper, otherwise voicemail. Voicemail transcripts and texts are emailed to booking@. No SMS is sent, so no 10DLC is needed. SHAKEN/STIR, Voice Integrity and CNAM are skipped: the Avant Concepts primary profile is an ISV Reseller, so they'd need a secondary business profile with an EIN.
- [x] Voicemail tested live 2026-10-12 (transcript email arrived via booking@); `site.phone` set the same day (booking section, service pages, JSON-LD, llms.txt). Press-1 answer path is the same code as askben's; first real call confirms it.
- `bookings@` (the sender address of site emails) also forwards to Ben's inbox, so replies to it never bounce.
- [ ] Swap the number into Eddie's Google Business Profile in place of the personal cell (with Ben's OK).
- [ ] Ben: SoundCloud bio still says "Tech House … Melodic Techno" and lists the personal Gmail (see umbrella `outstanding_items.md`).

## AI features to build (decided 2026-08-27; build order)
Goal: make this the second Avant Concepts case study ("AI that books gigs and makes the archive searchable"), same architecture as Ask Ben (Next.js + Supabase/pgvector + Claude via Vercel AI Gateway).

1. **Booking concierge** — replace the contact form with a tool-using chat that qualifies inquiries (date, venue/city, set length, crowd/vibe, genre, budget), checks the date against `lib/shows.ts` for conflicts, tells the client whether it's likely a fit, and emails Eddie a clean brief + suggested quote range (Resend). ~1 day.
2. **Timed, searchable mixes** — two parts:
   - *Timestamps:* tracklists currently have none. Fingerprint each mix on upload (ACRCloud or AudD, 10–20s windows) → `track → start/end seconds`; align with Eddie's hand-written tracklist; store timed entries. Fallback: parse `mm:ss` if Eddie starts adding them to SoundCloud descriptions.
   - *Semantic search:* index tracklists in pgvector, auto-tag mixes (mood/energy/era/BPM) → "what's playing at 42:10 in the Myth set", "peak-time trance like the closer of the Ponte Vedra set". ~1 day.
3. **Post-upload automation** — on new SoundCloud mix: cleaned tracklist, show notes, podcast description, 3 social captions in Eddie's voice, queued for one-click approval in admin.
4. **Set-prep assistant (admin)** — for a booked show, propose a set arc from his own track history and past sets at that venue.
5. **Venue intelligence pages** — per-venue guides (sound, set times, what he's played there) built from his data; SEO for "DJ [venue] Jacksonville".

## Prereqs / decisions
- [ ] Supabase project for eddiebarretta (or a schema in `askben`) — decide.
- [ ] Fingerprinting vendor + key (ACRCloud vs AudD) — cost is cents per mix-minute, one-time per upload.
- [ ] Confirm Eddie is fine with an AI chat handling first-contact booking questions.
- [ ] After 1–2 ship: feature on avant-concepts.com Selected Work next to Ask Ben.
