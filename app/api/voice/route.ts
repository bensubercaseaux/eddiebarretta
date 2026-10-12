import { ORIGIN, UNAVAILABLE, esc, forwardTo, rejected, twilioNumber, twilioParams, twiml, voiceEnabled } from "@/lib/twilio";

/**
 * Twilio Voice webhook for Eddie's line. Point the number's "A call comes in"
 * at POST https://eddiebarretta.com/api/voice. Rings FORWARD_TO_NUMBER showing
 * the line as caller ID (so booking calls are recognizable), with a whisper
 * that reads the caller's number and requires "1" to accept; voicemail otherwise.
 */
export async function POST(req: Request) {
  if (!voiceEnabled) return twiml(UNAVAILABLE);
  const p = await twilioParams(req);
  if (!p) return rejected(() => twiml(UNAVAILABLE));
  const whisper = `${ORIGIN}/api/voice/whisper?from=${encodeURIComponent(p.From ?? "")}`;
  return twiml(
    `<Dial timeout="25" action="${ORIGIN}/api/voice/after" callerId="${esc(twilioNumber!)}"><Number url="${esc(whisper)}">${esc(forwardTo!)}</Number></Dial>`,
  );
}
