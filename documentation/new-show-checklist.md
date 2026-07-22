# New show? Do this. ✅

The one-page cheat sheet for getting a booking onto eddiebarretta.com.
(How the machinery works: [text-bookings.md](text-bookings.md).)

## The normal flow (10 seconds)

1. Venue texts you a date and you confirm it over text.
2. In Messages, long-press the message → **More…** → check the bubble(s) →
   tap the **forward arrow** (bottom-right).
3. Send it to: **ben.subercaseaux+booking@gmail.com**
4. Done. The next morning around **9 AM** the booking agent reads it and puts
   the show on the site — no redeploy, no admin needed.

A screenshot of the conversation emailed to the same address works just as
well as a forward.

## Make the forward easy to parse

Forwarded texts lose the sender's name, so the agent only sees the words in
the message. Before sending, add a note if anything is missing:

- **Venue not obvious from the text?** Type it in front: "Sip —" or
  "Lemon Bar:" before the forwarded content.
- **Time not in the text?** Add it ("6-10pm"). If you don't, the agent uses
  that venue's usual slot and tells you it guessed.
- **Private gig** (private party, buyout)? Include the word **"private"** —
  the show is stored but hidden from the public site.
- Your note always wins over what the forwarded text says.

## What the agent will and won't do

| It WILL | It WON'T |
|---|---|
| Add confirmed gigs, live immediately | Post anything with no clear date or venue |
| Match venue spelling/city to your existing shows | Handle cancellations or reschedules |
| Skip duplicates automatically | Delete or edit existing shows |
| Use the venue's usual event name (e.g. SIP → "Sunset Party") | Guess about "maybe" / inquiry texts |

Anything it skips is listed in its morning summary with the reason:
<https://claude.ai/code/routines> → **Booking texts to shows**.

## When NOT to wait for the morning run

- **Gig is tonight/tomorrow morning** → add it yourself at
  [eddiebarretta.com/admin](https://www.eddiebarretta.com/admin) (Add show).
- **Cancellation or date change** → always yourself in `/admin` — the agent
  never touches existing shows by design.
- **Fixing an agent mistake** → `/admin`, edit the show. Takes 10 seconds.
  (And mention it to Claude so the routine's instructions can be tightened.)

## If a show didn't appear

1. Check the routine's last run summary: <https://claude.ai/code/routines> —
   it says exactly what it found, added, and skipped (and why).
2. Check the forward actually arrived: search `to:ben.subercaseaux+booking`
   in Gmail. Carrier message-to-email forwards occasionally fail silently —
   a screenshot emailed manually always works.
3. The agent only looks back 4 days — if the forward is older than that,
   re-send it or add the show in `/admin`.
4. Still stuck? Ask Claude to run the routine now instead of waiting for 9 AM.
