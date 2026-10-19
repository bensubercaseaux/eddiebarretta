"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

// A tel:/mailto: link that reports the click to GA4 the same way the booking
// section's phone link does (`contact_click`, keyed by method), so a call that
// starts in the hero counts like one that starts at the form.
export function ContactLink({
  href,
  method,
  className,
  children,
}: {
  href: string;
  method: "phone" | "email";
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} onClick={() => track("contact_click", { method })} className={className}>
      {children}
    </a>
  );
}
