import { rejected, twilioParams, twiml } from "@/lib/twilio";
import { sendBookingEmail } from "@/lib/booking-mail";

/**
 * Twilio Messaging webhook for Eddie's line. Point the number's "A message
 * comes in" at POST https://eddiebarretta.com/api/sms. Each text is emailed to
 * the booking inbox; no reply is sent (the number has no 10DLC campaign).
 */
export async function POST(req: Request) {
  const p = await twilioParams(req);
  if (!p) return rejected(() => twiml(""));
  const from = p.From || "unknown number";
  const media = Object.keys(p).filter((k) => /^MediaUrl\d+$/.test(k)).map((k) => p[k]);
  const text = [`Text to Eddie's line from ${from}`, ``, p.Body || "(empty)", ...(media.length ? [``, ...media] : [])].join("\n");
  await sendBookingEmail(`Text — ${from}`, text);
  return twiml("");
}
