/**
 * Simple in-memory rate limiter.
 * Works per-serverless-instance (not globally across Vercel functions).
 * Sufficient for basic abuse protection without Redis dependency.
 */

type RateEntry = { count: number; resetAt: number };

// Separate stores per window to avoid cross-contamination
const stores = new Map<string, Map<string, RateEntry>>();

function getStore(windowKey: string): Map<string, RateEntry> {
  let store = stores.get(windowKey);
  if (!store) { store = new Map(); stores.set(windowKey, store); }
  return store;
}

/**
 * @param key      Unique key per subject (e.g. `ip:/api/search`)
 * @param max      Max requests allowed in the window
 * @param windowMs Window size in milliseconds
 * @returns true if allowed, false if rate limited
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const store = getStore(`${max}:${windowMs}`);
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) return false;

  entry.count++;
  return true;
}

/** Extract client IP from Next.js request headers. */
export function getIp(headers: Headers | { get(name: string): string | null }): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
