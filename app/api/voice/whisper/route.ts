import { ORIGIN, rejected, twilioParams, twiml } from "@/lib/twilio";

/**
 * Played to Eddie when the forwarded leg is answered. Requires a keypress so
 * carrier voicemail (which "answers" the call) can't swallow it: no digit →
 * this leg hangs up → the caller gets the line's own voicemail.
 */
export async function POST(req: Request) {
  if (!(await twilioParams(req))) return rejected(() => twiml("<Hangup/>"));
  const from = new URL(req.url).searchParams.get("from") ?? "";
  const digits = from.replace(/\D/g, "").replace(/^1/, "");
  const spoken = digits.length === 10 ? `<say-as interpret-as="telephone">${digits}</say-as>` : "an unknown number";
  return twiml(
    `<Gather numDigits="1" timeout="6" action="${ORIGIN}/api/voice/accept"><Say voice="Polly.Joanna">Eddie Barretta booking call from ${spoken}. Press 1 to accept.</Say></Gather><Hangup/>`,
  );
}
