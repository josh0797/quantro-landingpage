/**
 * Derive 1–2 char uppercase initials from whatever identity signal is available.
 * Priority:
 *   1. user.user_metadata.full_name / name / first+last
 *   2. profile.company_name
 *   3. email local part (split by . _ -)
 *
 * Always returns a non-empty 1–2 char string. Returns null if no signal at all.
 */
export const deriveInitials = ({ user, profile } = {}) => {
  const pickFromWords = (raw) => {
    if (!raw || typeof raw !== "string") return null;
    const words = raw
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (words.length === 0) return null;
    if (words.length === 1) {
      const w = words[0];
      return (w.length >= 2 ? w.slice(0, 2) : w).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // 1. user_metadata
  const meta = user?.user_metadata || {};
  const metaFullName =
    meta.full_name || meta.name || meta.display_name || null;
  if (metaFullName) {
    const r = pickFromWords(metaFullName);
    if (r) return r;
  }
  if (meta.first_name || meta.last_name) {
    const fn = (meta.first_name || "").trim();
    const ln = (meta.last_name || "").trim();
    if (fn || ln) {
      return ((fn[0] || "") + (ln[0] || "")).toUpperCase() || null;
    }
  }

  // 2. profile.company_name
  if (profile?.company_name) {
    const r = pickFromWords(profile.company_name);
    if (r) return r;
  }

  // 3. email local part
  const email = user?.email || profile?.email;
  if (email && typeof email === "string") {
    const local = email.split("@")[0] || "";
    if (local) {
      const parts = local.split(/[._-]+/).filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return (local.length >= 2 ? local.slice(0, 2) : local).toUpperCase();
    }
  }

  return null;
};
