# Outstanding items — eddiebarretta.com (as of 2026-08-27)

Site: Next.js + Tailwind on Vercel; mixes from SoundCloud RSS (`lib/mixes-store.ts`), shows in `lib/shows.ts`, venues, booking form via Resend, podcast RSS, admin.

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
