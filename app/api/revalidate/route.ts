// On-demand cache push for content curated outside the repo. The Watch shelf
// (YouTube playlist) and Mixes (SoundCloud RSS) have no write hook to hang
// revalidation off — they just age out on a TTL — so this is the "I edited the
// playlist, show it now" button. POST only: a GET would be reachable by
// crawlers and link prefetchers.

import { revalidateTag } from "next/cache";
import { isAuthorized } from "@/lib/api-auth";

// Allowlisted so a caller can't churn arbitrary cache keys. Each value must
// match the TAG in the corresponding lib/*-store.ts.
const TAGS = new Set(["videos", "mixes", "shows"]);

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const tag = new URL(req.url).searchParams.get("tag") ?? "";
  if (!TAGS.has(tag)) {
    return Response.json(
      { error: `tag must be one of: ${[...TAGS].join(", ")}` },
      { status: 400 },
    );
  }

  // `{ expire: 0 }`, not "max". With "max" the entry is only marked stale and
  // served once more while the refetch happens behind it, so the person who
  // just pushed still sees the old content — which defeats the point of the
  // endpoint. `{ expire: 0 }` is what the Next 16 docs prescribe for external
  // callers that need immediate expiry; `updateTag` would be the other option
  // but it's Server-Action-only and can't be called from a route handler.
  revalidateTag(tag, { expire: 0 });

  return Response.json({ ok: true, tag });
}
