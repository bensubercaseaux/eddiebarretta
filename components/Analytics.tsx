"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";

// GA everywhere except the admin. A direct visit to /admin never loads the tag;
// the ga-disable flag covers client-side navigation into /admin after gtag has
// already loaded on a public page (gtag checks it before every hit).
export function Analytics({ gaId }: { gaId: string }) {
  const isAdmin = usePathname().startsWith("/admin");

  useEffect(() => {
    (window as unknown as Record<string, boolean>)[`ga-disable-${gaId}`] = isAdmin;
  }, [gaId, isAdmin]);

  return isAdmin ? null : <GoogleAnalytics gaId={gaId} />;
}
