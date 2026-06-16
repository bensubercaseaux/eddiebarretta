"use client";

import { useState, type FormEvent } from "react";
import {
  EnvelopeSimple,
  InstagramLogo,
  MapPin,
  CheckCircle,
} from "@phosphor-icons/react";
import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

const field =
  "w-full rounded-xl border border-line bg-ink px-4 py-3 text-fg placeholder:text-faint transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40";

export function Booking() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Please try again.");
    }
  }

  return (
    <section id="book" className="px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Book Eddie
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Residencies, bar nights, private events, parties. Tell me the date
            and the vibe and I will get back to you.
          </p>

          <div className="mt-9 space-y-1">
            <a
              href={`mailto:${site.bookingEmail}`}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-muted transition-colors hover:bg-surface hover:text-fg"
            >
              <EnvelopeSimple size={20} className="text-accent-bright" />
              {site.bookingEmail}
            </a>
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-muted transition-colors hover:bg-surface hover:text-fg"
            >
              <InstagramLogo size={20} className="text-accent-bright" />
              @djeddiebarretta
            </a>
            <div className="flex items-center gap-3 px-3 py-3 text-muted">
              <MapPin size={20} className="text-accent-bright" />
              {site.serviceArea}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-[16px] border border-line bg-surface/40 p-6 sm:p-8">
            {status === "success" ? (
              <div className="flex min-h-[20rem] flex-col items-center justify-center text-center">
                <CheckCircle size={48} weight="fill" className="text-accent-bright" />
                <h3 className="mt-4 font-display text-2xl font-bold">
                  Message sent
                </h3>
                <p className="mt-2 max-w-xs text-muted">
                  Thanks for reaching out. Eddie will get back to you soon.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm text-accent-bright underline-offset-4 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-5" noValidate>
                {/* Honeypot — hidden from people, tempting to bots */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label>
                    Company
                    <input
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-fg">
                    Name
                  </label>
                  <input id="name" name="name" required className={field} />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-fg">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={field}
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="event" className="text-sm font-medium text-fg">
                    Event or venue{" "}
                    <span className="font-normal text-faint">(optional)</span>
                  </label>
                  <input
                    id="event"
                    name="event"
                    placeholder="Date, location, type of night"
                    className={field}
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="message" className="text-sm font-medium text-fg">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className={`${field} resize-y`}
                  />
                </div>

                {status === "error" && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="rounded-full bg-accent px-7 py-3 font-medium text-white transition-transform duration-200 hover:bg-accent-bright active:scale-[0.98] disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
