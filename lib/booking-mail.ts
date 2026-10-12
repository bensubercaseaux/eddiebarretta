import { Resend } from "resend";
import { site } from "@/lib/site";

// Same sender as the contact form (app/api/contact/route.ts). Resend's
// onboarding sender only delivers to the Resend account's own address, so the
// phone line needs CONTACT_FROM_EMAIL on the verified eddiebarretta.com domain.
const FROM = process.env.CONTACT_FROM_EMAIL || "Eddie Barretta <onboarding@resend.dev>";

/** Email a phone-line event (voicemail, text) to the booking inbox. Never throws. */
export async function sendBookingEmail(subject: string, text: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn(`[phone] RESEND_API_KEY not set. ${subject}\n${text}`);
    return false;
  }
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: FROM, to: site.bookingEmail, subject, text });
    if (error) console.error("[phone] Resend error:", error);
    return !error;
  } catch (err) {
    console.error("[phone] send failed:", err);
    return false;
  }
}
