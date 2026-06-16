// Pure, dependency-free session helpers. No next/headers import here, so this
// module is safe to import from proxy.ts (which runs before rendering). Cookie
// read/write that needs next/headers lives in lib/auth.ts.

export const SESSION_COOKIE = "eb_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (s) return s;
  // Local dev convenience: sessions still work without configuring a secret,
  // but they are NOT secure. Production must set AUTH_SECRET.
  if (process.env.NODE_ENV !== "production") return "dev-insecure-secret";
  throw new Error("AUTH_SECRET is not set.");
}

function bytesToB64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64UrlToBytes(s: string): Uint8Array {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return bytesToB64Url(new Uint8Array(sig));
}

/** Constant-time string comparison to avoid timing leaks. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Validate a username/password against the admin env vars. */
export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME ?? "";
  const p = process.env.ADMIN_PASSWORD ?? "";
  if (!u || !p) return false;
  // Evaluate both before AND-ing so the work is independent of which is wrong.
  const okUser = timingSafeEqual(username, u);
  const okPass = timingSafeEqual(password, p);
  return okUser && okPass;
}

/** Signed token: `<payloadB64Url>.<hmacB64Url>`. */
export async function createSessionToken(username: string): Promise<string> {
  const payload = bytesToB64Url(
    new TextEncoder().encode(
      JSON.stringify({ u: username, exp: nowSeconds() + SESSION_MAX_AGE }),
    ),
  );
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!timingSafeEqual(sig, await hmac(payload))) return false;
  try {
    const parsed = JSON.parse(new TextDecoder().decode(b64UrlToBytes(payload)));
    return typeof parsed?.exp === "number" && parsed.exp > nowSeconds();
  } catch {
    return false;
  }
}
