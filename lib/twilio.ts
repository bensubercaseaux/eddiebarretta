import { createHmac, timingSafeEqual } from "node:crypto";
import { site } from "@/lib/site";

/**
 * Eddie's phone line: Twilio webhooks answered with TwiML, no SDK. Ported from
 * askben (real-estate/src/lib/twilio). All env is optional so the site works
 * without Twilio:
 *   TWILIO_AUTH_TOKEN  — verifies X-Twilio-Signature on every webhook
 *   TWILIO_NUMBER      — the line, E.164 (+1904…); shown as caller ID on the forwarded leg
 *   FORWARD_TO_NUMBER  — the phone calls ring through to, E.164 (never in the repo)
 * Voicemails and texts are emailed to site.bookingEmail (lib/booking-mail.ts).
 */
export const ORIGIN = "https://eddiebarretta.com";

/** Normalize a US phone to E.164; returns null if it doesn't look like one. */
export function toE164(raw: string): string | null {
  const d = raw.replace(/\D/g, "");
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  return null;
}

const token = process.env.TWILIO_AUTH_TOKEN;
export const twilioNumber = process.env.TWILIO_NUMBER ? toE164(process.env.TWILIO_NUMBER) : null;
export const forwardTo = process.env.FORWARD_TO_NUMBER ? toE164(process.env.FORWARD_TO_NUMBER) : null;
/** Calls are forwarded only when all three are set; otherwise every route answers with UNAVAILABLE. */
export const voiceEnabled = !!(token && twilioNumber && forwardTo);

/** Validate X-Twilio-Signature on an inbound webhook (form-encoded POST). */
function verifySignature(url: string, params: Record<string, string>, signature: string | null): boolean {
  if (!token || !signature) return false;
  const data = url + Object.keys(params).sort().map((k) => k + params[k]).join("");
  const expected = createHmac("sha1", token).update(data).digest("base64");
  const a = Buffer.from(expected), b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * The webhook's form params, or null when the signature doesn't check out (or
 * no token is set). Twilio signs the URL it requested, which is always one of
 * ours on ORIGIN, so the URL is rebuilt from ORIGIN rather than trusting the
 * Host the function sees.
 */
export async function twilioParams(req: Request): Promise<Record<string, string> | null> {
  const params = Object.fromEntries((await req.formData()).entries()) as Record<string, string>;
  const { pathname, search } = new URL(req.url);
  return verifySignature(`${ORIGIN}${pathname}${search}`, params, req.headers.get("x-twilio-signature")) ? params : null;
}

export const twiml = (inner: string) =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?><Response>${inner}</Response>`, { headers: { "Content-Type": "text/xml" } });
export const esc = (s: string) =>
  s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);
/**
 * A request that failed twilioParams: 403 once a token is set (a bad or missing
 * signature), otherwise the line isn't wired up and the route answers with its
 * harmless fallback (nothing is forwarded or emailed without a verified request).
 */
export const rejected = (fallback: () => Response) => (token ? new Response("forbidden", { status: 403 }) : fallback());

/** Spoken when the line isn't wired up: points callers at the form and the booking inbox. */
export const UNAVAILABLE = `<Say voice="Polly.Joanna">Thanks for calling ${esc(site.name)}. To book Eddie, use the booking form at eddiebarretta dot com, or email booking at eddiebarretta dot com, and Eddie will get back to you.</Say>`;
