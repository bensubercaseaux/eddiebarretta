# Booking texts → shows (automated)

Shows are mostly booked over text message. This pipeline turns a forwarded text
into a show on the site with no manual data entry:

1. **You**: when a gig is confirmed over text, forward the text (or a
   screenshot of it) from Messages to **ben.subercaseaux+booking@gmail.com**.
   The `+booking` part is a Gmail alias of your normal address — it lands in
   your inbox and gives the agent an exact search filter.
2. **Daily agent**: a scheduled Claude routine (managed at
   <https://claude.ai/code/routines>) runs every morning, searches Gmail for
   messages sent to the `+booking` alias in the last few days, and extracts the
   gig details (date, time, venue, city, event name).
3. **Site API**: the agent calls `POST /api/shows` on the live site with a
   bearer token, which writes to the same Vercel Blob store the `/admin`
   dashboard edits. New shows are public immediately; the site revalidates
   instantly (no redeploy).

## The API (`app/api/shows/route.ts`)

- `GET /api/shows` — every show, public + private (the agent reads this first
  to avoid duplicates).
- `POST /api/shows` — add one show. Body: `{ date: "2026-08-14", time:
  "6:00 - 10:00 PM", name: "Sunset Party", venue: "SIP Cocktail Bar", city:
  "Jacksonville", isPublic?: true, url?: "https://…" }`.
- Auth: `Authorization: Bearer $SHOWS_API_TOKEN` on every request. The token
  lives in the Vercel env var `SHOWS_API_TOKEN` (unset = API disabled). Rotate
  it by generating a new value (`openssl rand -hex 32`), updating the env var,
  and updating the routine's prompt.
- Duplicate guard: a POST for the same venue + date as an existing show
  returns 409, so agent re-runs can't double-post.

## The routine

Prompt template (the live routine carries the real token):

> You maintain the gig calendar for the DJ site eddiebarretta.com. Search Gmail
> for messages sent to ben.subercaseaux+booking@gmail.com in the last 4 days
> (search: `to:ben.subercaseaux+booking@gmail.com newer_than:4d`). Each is a
> forwarded text (or screenshot) about a DJ booking. Extract for each distinct
> gig: date (ISO), display time range (e.g. "6:00 - 10:00 PM"), venue, city,
> and an event name (use the venue's usual event name from existing shows, or
> "Eddie Barretta (DJ Set)" if unclear). Then GET
> https://www.eddiebarretta.com/api/shows with header "Authorization: Bearer
> TOKEN" to see existing shows (also use these to match venue-name spelling and
> city). POST each genuinely new gig to the same URL with the same header and
> JSON body {date, time, name, venue, city}. A 409 means it already exists —
> that's fine, skip it. If a text is ambiguous (no date, unclear venue, a
> cancellation or reschedule rather than a new booking), do NOT post it —
> list it in your summary instead. Finish with a short summary: shows added,
> duplicates skipped, and anything that needs a human decision.

Notes:

- The routine needs the **Gmail connector** attached (connect at
  <https://claude.ai/customize/connectors>).
- Reschedules/cancellations are deliberately left to a human — the agent only
  ever *adds* shows; it flags everything else in its run summary.
- Anything the agent gets slightly wrong is a 10-second fix in `/admin`.
