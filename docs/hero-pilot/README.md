# Hero pilot: anchor stills and loop (2026-09-27)

First step of the cinematic hero pilot. Background and tooling comparison: `home/docs/cinematic-sites.md`.
Goal: an ambient, muted loop behind the existing home hero. Not a scroll film, because about half of this site's traffic is mobile.

The loop is built into the home hero on the `hero-loop` branch. It reaches the live site when that branch is merged to `main` and pushed. Everything under `docs/` is reference and is not served.

## What is here

| Path | What |
|---|---|
| `anchor/a-haze-beams-2k.png` | **The chosen anchor.** Direction A at 2752 x 1536. Source for the video step, not for serving |
| `stills/` | The four first-round stills, 1376 x 768 |
| `../../public/hero/` | **The hero loop, as served.** 1080p and 720p, MP4 and WebM, plus the poster |
| `loop/source/take1-720p.mp4` | The raw generated take |
| `loop/patch.py`, `loop/encode.sh` | How `public/hero/` was built from the 4K upscale |
| `loop-preview.html` | The loop playing behind the real headline. Open it in a browser |
| `preview.html` | Each still behind the real headline, copy and buttons. Open it in a browser |
| `previews/` | Screenshots of that page at 1440 px and 390 px wide |

## The four directions

| | Direction | Assessment |
|---|---|---|
| A | Haze and beams: empty club, violet lasers through haze | **Chosen by Ben, 2026-09-27.** Matches the palette, leaves the headline side dark, and haze and beam sweep loop naturally. |
| B | Beach bar at blue hour | Closest to "beach bars" and Jacksonville Beach. Amber string lights step outside the palette, and it shows a venue that does not exist. |
| C | Decks macro | Weakest. It came out as a vinyl turntable with red and orange lights, which may not match Eddie's setup. Spinning platters also tend to warp in generated video. |
| D | Sound rings: abstract violet ripples | Safest and most on-brand. It echoes the ripple-ring EB mark. Least cinematic of the four. |

Headline contrast holds on all four at both widths with the scrim in `preview.html`.

## Rules these follow

- No people and no likeness of Eddie.
- No logos, signage or lettering. Equipment is generic.
- Palette held to `--ink`, indigo and `--accent` violet, except the amber in B.
- Left side kept dark for the headline.

## Prompts

All at 16:9. A used Runway's `nano-banana-pro` at 1K. B, C and D used `nano-banana-2-lite`.

**A** Cinematic wide shot of an empty late-night club interior, no people. Thin violet and ultraviolet laser beams fan out from the upper right and cut through dense volumetric haze. Deep near-black shadows with a faint indigo tint fill the left half of the frame, leaving it almost empty and dark. Subtle reflections on a polished dark floor. Anamorphic lens, shallow depth of field, soft film grain, high contrast, moody and euphoric. Color palette strictly near-black ink, deep indigo and electric violet. No text, no logos, no signage, no people.

**B** Cinematic wide shot of an open-air beach bar on the Florida Atlantic coast at blue hour, no people. A small empty DJ booth with unbranded decks sits on the right under warm string lights, washed in violet stage light. Behind it the ocean horizon and a deep indigo sky with a last band of magenta afterglow. Palm fronds in silhouette. The left half of the frame falls into deep near-black shadow over dark sand, almost empty. Anamorphic lens, shallow depth of field, soft film grain. Color palette near-black ink, deep indigo, electric violet, a touch of warm amber from the string lights. No text, no logos, no signage, no people.

**C** Cinematic macro close-up of a DJ mixer and the edge of a spinning deck platter in a dark booth, no hands, no people. Violet light rakes across the knobs and faders from the right, with small glowing indicator lights in soft focus. Thin haze drifts through the light. The left half of the frame falls off into deep near-black shadow, almost empty. Very shallow depth of field, anamorphic bokeh, soft film grain, high contrast. Color palette strictly near-black ink, deep indigo and electric violet. The equipment is generic and unbranded. No text, no logos, no lettering, no people.

**D** Abstract cinematic image of concentric rings of violet light rippling outward through dark haze, like a sound wave made visible. The rings are centered in the right third of the frame and fade into deep near-black shadow toward the left, leaving the left half almost empty and dark. Fine suspended dust particles catch the light. Shallow depth of field, soft film grain, high contrast. Color palette strictly near-black ink, deep indigo and electric violet. No text, no logos, no people.

## The 2K anchor

Generated with the first-round A still as the reference image, so the composition is the same: two beam origins, the empty booth, the floor reflections, the dark left third.
Checked at 100%: beam edges and haze are clean, no people, no lettering.

Runway task IDs, for passing as `startFrame.taskId` in the video step:

| Still | Task ID |
|---|---|
| A, first round (1K) | `3305296b-14f7-4c35-8706-fb8984f8f21e` |
| A, 2K anchor | `8338b08f-528f-474a-a287-116edc8a317b` |

Prompt for the 2K anchor, with the first-round still tagged `@anchor`:

Recreate @anchor faithfully at higher resolution and finer detail. Keep the exact same composition, camera angle, framing, lighting and color: an empty late-night club interior with no people, violet laser beams fanning from the upper right through dense volumetric haze, a distant empty DJ booth, reflections on a polished dark floor, and the left third of the frame in deep near-black shadow. Sharpen the beam edges, haze texture and floor reflections. Soft film grain, anamorphic look. Color palette strictly near-black ink, deep indigo and electric violet. No text, no logos, no signage, no people. Do not add or remove any objects.

## Runway credits

| | Credits |
|---|---|
| Balance before | 67 |
| A, `nano-banana-pro` 1K | 20 |
| B, C, D, `nano-banana-2-lite` | 4 each |
| A at 2K, `nano-banana-pro` | 20 |
| Balance after | 15 |

2K cost the same as 1K on this model.

## The loop

Ten seconds, 24 frames a second, no audio. Generated from the 2K anchor with the same image as first and last frame, so it closes on itself.

| File | Size |
|---|---|
| `hero-loop-1080.webm` | 1.19 MB |
| `hero-loop-1080.mp4` | 1.52 MB |
| `hero-loop-720.webm` | 0.60 MB |
| `hero-loop-720.mp4` | 0.69 MB |
| `hero-poster-1080.jpg` | 0.12 MB |

For scale, the current `public/hero.png` is 0.52 MB.

What was checked, on the final encoded file:

| Check | Result |
|---|---|
| Loop seam | Last frame to first frame differs less than two neighbouring frames do (0.79 against 1.51). No visible jump |
| Cuts or flashes | None. Brightness stays within 33.9 to 35.7 on a 0 to 255 scale |
| Headline side | Left third stays near black, 1.4 to 2.8 |
| People, logos, lettering | None, after the fix below |
| Compression | No banding in the haze, MP4 or WebM |
| Playback | `loop-preview.html` plays the 1080p WebM in Chrome. Headline readable at 1440 px and 390 px |

Two things to know:

- **The beams sweep further than asked.** The prompt said a few degrees. The fans swing wide and come back. It reads as a real laser show and stays on the right of the frame.
- **One fix was applied.** The upscaler sharpened a row of speckles in the floor reflection into letter-like marks. `patch.py` softens that small region on every frame. Nothing else was retouched.

Pipeline: Seedance 2 at 720p, Runway upscale to 4K, downscale to 1080p, patch, encode.
The 4K upscale is 18.6 MB and is not in the repo. It stays in the Runway workspace.

| Runway task | ID |
|---|---|
| Loop, take 1, 720p | `1c055bb0-ffad-4076-9b0d-ec1169ee487a` |
| Upscale of take 1 to 4K | `45e76886-a2cc-47d7-96de-5db58591bac8` |

Prompt:

Locked-off static camera, no camera movement, no zoom. An empty late-night club. The violet laser fans sweep very slowly and smoothly by a few degrees, then glide back to exactly where they started. Dense haze drifts gently from right to left through the beams. Soft shimmer in the floor reflections. The left third of the frame stays in deep near-black shadow. Calm, hypnotic, ambient. No people, nobody enters, no new objects, no text, no flashes or strobing, no cuts. The final frame matches the first frame so the clip loops seamlessly.

## Runway credits, Pro plan

| | Credits |
|---|---|
| Plan allowance | 2,250 |
| Loop, Seedance 2, ten seconds at 720p | 360 |
| Upscale to 4K | 20 |
| Plan credits left | 1,870 |
| Purchased credits on the account | 300 |
| Total available | 2,170 |

The 300 purchased credits are not on the invoice and cost nothing. The only invoice is $26.25, for the Pro plan. Where Runway credited them from is not shown anywhere on the billing pages.

## In the site

`components/Hero.tsx` on the `hero-loop` branch. The loop replaces the violet glow and the EB ring mark, which sat where the beams are now.

| Behaviour | How |
|---|---|
| First paint | The poster is a normal `next/image` with `preload`. It paints with the page and is the largest paint |
| Video | Mounts after the browser goes idle, then fades in over the poster once it is playing |
| Phones | Get the 720p files. Screens 900 px and wider get 1080p |
| Reduced motion | No video element and no video request. The poster stays as a still |
| Save-Data | Same as reduced motion |
| Autoplay refused | The poster stays. Nothing breaks |
| Scrolled out of view | The video pauses, and resumes when the hero is back |

Checked in Chrome against a production build, 2026-09-27:

| Case | Headline | Video | File |
|---|---|---|---|
| Desktop, 1440 x 900 | Visible | Playing, muted | `hero-loop-1080.webm` |
| Phone, 390 x 844 | Visible, no sideways scroll | Playing, muted | `hero-loop-720.webm` |
| Reduced motion | Visible | Not loaded | Poster only |

No console errors in any case. `npm run lint`, `tsc` and `npm run build` pass.
Screenshots: `previews/site-*.jpg`, with `site-before-*.jpg` for the old hero.

Not checked: Safari and a real iPhone. The MP4 files are there for browsers without WebM.

`next dev` crashed with a Turbopack error ("Next.js package not found") when started from the agent's shell, before any code changed. The production build is unaffected. It was not investigated.

## Next

1. Eddie signs off on the look.
2. Merge `hero-loop` into `main` and push. Pushing the branch first gives a Vercel preview to show him.
3. Check it once on a real iPhone.
4. Decide keep or cancel on Runway before 2026-10-26. The first month was $26.25 with a promo, and Runway renews at $35.00 on 2026-10-27. The row is in `costs/services.json`.
