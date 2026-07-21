import { sendGAEvent } from "@next/third-parties/google";

// GA only loads where NEXT_PUBLIC_GA_ID is configured (see app/layout.tsx);
// this guard keeps sendGAEvent's "GA has not been initialized" warning out of
// the console everywhere else (local dev, previews).
export function track(
  name: string,
  params: Record<string, string | number> = {},
): void {
  if (!process.env.NEXT_PUBLIC_GA_ID) return;
  sendGAEvent("event", name, params);
}
