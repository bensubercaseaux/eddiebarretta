import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO = process.env.CONTACT_TO_EMAIL || "ben.subercaseaux@gmail.com";
// Resend's onboarding sender works without domain verification, so the form is
// functional immediately. Switch to bookings@eddiebarretta.com once the domain
// is verified in Resend (see README).
const FROM = process.env.CONTACT_FROM_EMAIL || "Eddie Barretta <onboarding@resend.dev>";

const isEmail = (v: unknown): v is string =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill this. Pretend success for bots.
  if (typeof data.company === "string" && data.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = data.email;
  const event = typeof data.event === "string" ? data.event.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";

  if (!name || !message || !isEmail(email)) {
    return NextResponse.json(
      { error: "Please add your name, a valid email, and a message." },
      { status: 400 },
    );
  }

  const text = [
    `New booking inquiry from the website`,
    ``,
    `Name:  ${name}`,
    `Email: ${email}`,
    event ? `Event: ${event}` : null,
    ``,
    message,
  ]
    .filter((l) => l !== null)
    .join("\n");

  if (!process.env.RESEND_API_KEY) {
    // No key configured yet. Log so it is visible during local dev; only allow
    // the friendly success path outside production.
    console.warn("[contact] RESEND_API_KEY not set. Submission:\n" + text);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: "Email is not configured yet. Please reach out on Instagram." },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Booking inquiry — ${name}`,
      text,
    });
    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        { error: "Could not send right now. Please try again or email directly." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      { error: "Could not send right now. Please try again or email directly." },
      { status: 500 },
    );
  }
}
