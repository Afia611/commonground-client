/**
 * Shared, dependency-free validation helpers used by both the BetterAuth
 * server hooks (src/lib/auth.ts) and the client forms. CommonGround account
 * password policy: at least 6 characters with at least one uppercase and one
 * lowercase letter. No email verification / forgot-password flows by design.
 */

export const PASSWORD_MIN_LENGTH = 6;

export function validatePasswordPolicy(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;
  }
  if (!/[A-Z]/.test(password)) {
    return "Password needs at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password needs at least one lowercase letter.";
  }
  return null;
}

/**
 * Only allow same-origin relative return paths (never `//`, `\`, or absolute
 * URLs) so `?callbackUrl=` cannot be abused for open redirects.
 */
export function sanitizeCallbackUrl(
  raw: string | undefined | null,
  fallback = "/",
): string {
  if (!raw) return fallback;
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\\")) {
    return raw;
  }
  return fallback;
}

/** Photo URL is optional; when present it must be a valid http(s) URL. */
export function validatePhotoUrl(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return null;
    }
  } catch {
    // falls through to the error below
  }
  return "Photo URL must be a valid http(s) address.";
}
