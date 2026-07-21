# Google Analytics — what the site tracks

GA4 loads on every page when `NEXT_PUBLIC_GA_ID` is set in Vercel (it's off
locally, so dev clicks never pollute your data). On top of GA4's automatic
tracking, the site sends custom events for the two things that actually matter:
**people listening to mixes** and **people submitting the booking form**.

## Automatic (nothing we wrote)

GA4's standard collection: page views, sessions, traffic sources, plus
"enhanced measurement" events — scrolls, outbound link clicks, site search.
This tells you *that* someone visited a mix page, but not whether they pressed
play. That's what the custom events below are for.

## Custom events

### Mix listening funnel

Fired by the site's audio player, which is shared across the home page
**Listen** section, `/mixes`, and each mix page. Every event carries
`mix_title` and `mix_slug` so you can break results down per mix.

| Event | When it fires |
|---|---|
| `mix_play` | Someone starts a mix (once per mix — resuming after pause doesn't re-fire) |
| `mix_progress` | Playback reaches 25%, 50%, and 75% (`percent` param; each fires at most once) |
| `mix_complete` | The mix plays to the end |

Together these give you a funnel per mix: starts → halfway → completions.
A mix with lots of `mix_play` but little `mix_progress` is losing people early.

> Plays on the *website* stream from SoundCloud's CDN, so they're also counted
> in SoundCloud's own stats — GA and SoundCloud numbers won't match exactly
> (different definitions of a "play"), but both move together.

### Booking form

| Event | When it fires |
|---|---|
| `generate_lead` (param `form: "booking"`) | The booking form submits **successfully** — failed or spam-blocked attempts don't count |

`generate_lead` is GA4's recommended event name for lead forms, so it plugs
into standard reporting.

## One-time GA4 admin setup

Do these once in [analytics.google.com](https://analytics.google.com) → Admin
(they can't be set from code):

1. **Mark bookings as a conversion** — Admin → **Events** → find
   `generate_lead` → toggle **Mark as key event**. Booking requests then show
   up in conversion reports and ad integrations.
2. **Register custom dimensions** (for per-mix reports) — Admin →
   **Custom definitions** → **Create custom dimension**, one for each:
   - `mix_title` (event scope)
   - `mix_slug` (event scope)
   - `percent` (event scope)

   Without this, the parameters are still collected but won't appear as
   breakdown dimensions in standard reports. Only data received *after*
   registering is queryable by dimension.

## Verifying it works

Open GA4 → **Reports → Realtime**, then on the live site play a mix and submit
a test booking. `mix_play` and `generate_lead` should appear under "Event
count by event name" within seconds. Let a mix run past the quarter mark to
see `mix_progress`.

## Where the code lives

| What | File |
|---|---|
| `track()` helper (no-ops when GA isn't configured) | [`lib/analytics.ts`](../lib/analytics.ts) |
| Player events | [`components/player/PlayerProvider.tsx`](../components/player/PlayerProvider.tsx) |
| Booking event | [`components/Booking.tsx`](../components/Booking.tsx) |
| GA script tag | [`app/layout.tsx`](../app/layout.tsx) |

To add a new event elsewhere: `import { track } from "@/lib/analytics"` and
call `track("event_name", { any: "params" })` from a client component.
