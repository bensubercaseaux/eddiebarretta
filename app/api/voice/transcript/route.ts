import { rejected, twilioParams } from "@/lib/twilio";
import { sendBookingEmail } from "@/lib/booking-mail";

/** Voicemail transcription → email to the booking inbox. */
export async function POST(req: Request) {
  const p = await twilioParams(req);
  if (!p) return rejected(() => new Response("ok"));
  const from = p.From || "unknown number";
  const text = [
    `Voicemail on Eddie's line from ${from}`,
    ``,
    p.TranscriptionText || "(no transcript)",
    ``,
    p.RecordingUrl ? `Recording: ${p.RecordingUrl}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");
  await sendBookingEmail(`Voicemail — ${from}`, text);
  return new Response("ok");
}
