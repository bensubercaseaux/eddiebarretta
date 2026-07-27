import "server-only";
import { timingSafeEqual } from "node:crypto";

// Shared bearer check for the token-authenticated automation endpoints
// (/api/shows, /api/revalidate). SHOWS_API_TOKEN is the site's single
// automation credential — unset means every one of those routes is closed.

export function isAuthorized(req: Request): boolean {
  const token = process.env.SHOWS_API_TOKEN;
  if (!token) return false;
  const provided = (req.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  const a = Buffer.from(provided);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
