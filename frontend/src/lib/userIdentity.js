/**
 * Derive 1–2 char uppercase initials from the user's identity.
 *
 * Priority (per PRD — DB-backed only, no schema changes):
 *   1. profile.full_name
 *      • "Juan Pérez"  → "JP"   (first letter of first word + first letter of last word)
 *      • "Juan"         → "JU"  (first 2 letters of the only word)
 *   2. email (profile.email || user.email)
 *      • first 2 letters of the local part
 *
 * Always returns a non-empty 1–2 char uppercase string, or null if nothing is available.
 */
export const getUserInitials = (user, profile) => {
  const fromWords = (raw) => {
    if (!raw || typeof raw !== "string") return null;
    const words = raw.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return null;
    if (words.length === 1) {
      const w = words[0];
      return (w.length >= 2 ? w.slice(0, 2) : w).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // 1. profile.full_name
  if (profile?.full_name) {
    const r = fromWords(profile.full_name);
    if (r) return r;
  }

  // 2. email → first 2 letters of local part
  const email = profile?.email || user?.email;
  if (email && typeof email === "string") {
    const local = email.split("@")[0] || "";
    if (local) {
      return (local.length >= 2 ? local.slice(0, 2) : local).toUpperCase();
    }
  }

  return null;
};

/**
 * @deprecated Kept for backwards compatibility with earlier callers.
 * Prefer `getUserInitials(user, profile)`.
 */
export const deriveInitials = ({ user, profile } = {}) =>
  getUserInitials(user, profile);
