import { rejected, twilioParams, twiml } from "@/lib/twilio";

/** Gather callback: any digit bridges the call (empty TwiML = connect); no digit never reaches here. */
export async function POST(req: Request) {
  const p = await twilioParams(req);
  if (!p) return rejected(() => twiml("<Hangup/>"));
  return twiml(p.Digits ? "" : "<Hangup/>");
}
