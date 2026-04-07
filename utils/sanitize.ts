/** Strip HTML/script tags from user input to prevent stored XSS. */
export function stripHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<[^>]+>/g, "");
}

/**
 * Sanitize a text field: trim, strip HTML, enforce max length.
 * Returns empty string for null/undefined.
 */
export function sanitizeText(
  input: string | null | undefined,
  maxLen: number
): string {
  if (!input) return "";
  return stripHtml(input.trim()).slice(0, maxLen);
}

/** Validate UUID v4 format. */
export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

/**
 * Sanitize an upload filename: keep only safe characters, no path traversal.
 * Returns a safe lowercase filename with original extension.
 */
export function sanitizeFilename(name: string): string {
  const parts = name.split(".");
  const ext = parts.length > 1 ? parts.pop()!.toLowerCase().replace(/[^a-z0-9]/g, "") : "jpg";
  const base = parts.join("_").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
  return `${base || "file"}.${ext || "jpg"}`;
}

/** Simple email format check. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(email);
}

/** Validate that a value is one of the allowed options. */
export function isAllowedValue<T extends string>(value: string, allowed: T[]): value is T {
  return (allowed as string[]).includes(value);
}
