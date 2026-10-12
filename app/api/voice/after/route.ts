import { ORIGIN, UNAVAILABLE, rejected, twilioParams, twiml } from "@/lib/twilio";

/**
 * After <Dial> ends: if Eddie didn't pick up, take a voicemail; the transcript
 * is emailed by /api/voice/transcript. <Record> posts back here when the caller
 * finishes (RecordingUrl set), so that request just says goodbye instead of
 * starting the greeting over.
 */
export async function POST(req: Request) {
  const p = await twilioParams(req);
  if (!p) return rejected(() => twiml(UNAVAILABLE));
  if (p.DialCallStatus === "completed") return twiml("<Hangup/>");
  if (p.RecordingUrl) return twiml(`<Say voice="Polly.Joanna">Thanks. Eddie will get back to you soon.</Say><Hangup/>`);
  return twiml(
    `<Say voice="Polly.Joanna">You've reached Eddie Barretta. Leave your name, the date, the venue or event, and the best number to reach you, and Eddie will call you back.</Say><Record maxLength="120" transcribe="true" transcribeCallback="${ORIGIN}/api/voice/transcript" playBeep="true"/>`,
  );
}
