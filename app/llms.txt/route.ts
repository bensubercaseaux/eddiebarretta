import { site } from "@/lib/site";

// Served at /llms.txt — a concise, LLM-friendly summary of the site so answer
// engines can describe and cite Eddie accurately. Generated from lib/site.ts so
// it never drifts from the rest of the site.
export const dynamic = "force-static";

export function GET() {
  const body = `# ${site.name}

> ${site.bioShort}

${site.name} is a ${site.role.toLowerCase()} based in ${site.location}, performing across ${site.serviceArea}.

## About
${site.bio.join("\n\n")}

## Music
- Transcend Mixes (SoundCloud): ${site.socials.soundcloud}
- YouTube: ${site.socials.youtube}
- Transcend is Eddie's house & trance mix series / podcast.

## Booking
- Email: ${site.bookingEmail}
- Instagram: ${site.socials.instagram}
- Available for: bar nights, residencies, private events, and parties
- Service area: ${site.serviceArea}

## Social
- Instagram: ${site.socials.instagram}
- TikTok: ${site.socials.tiktok}
- SoundCloud: ${site.socials.soundcloud}
- YouTube: ${site.socials.youtube}
- Google: ${site.googleBusiness}

## Venues played
${site.venues.map((v) => `- ${v}`).join("\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
