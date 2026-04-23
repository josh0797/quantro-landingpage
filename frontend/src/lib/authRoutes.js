/**
 * Route ↔ language mapping for auth screens.
 * Single source of truth consumed by the <Route /> registry, the
 * LanguageSwitcher auto-redirect, and the document.title hook.
 */

export const AUTH_ROUTES = {
  signIn: { es: "/iniciar-sesion", en: "/sign-in", mode: "login" },
  signUp: { es: "/crear-cuenta", en: "/sign-up", mode: "signup" },
};

export const AUTH_ROUTE_PATHS = [
  ...Object.values(AUTH_ROUTES).flatMap((r) => [r.es, r.en]),
];

/**
 * Map a path to `{ key, lang, mode }` if it's a known auth route.
 */
export const resolveAuthRoute = (pathname) => {
  if (!pathname) return null;
  const clean = pathname.replace(/\/+$/, "") || "/";
  for (const [key, r] of Object.entries(AUTH_ROUTES)) {
    if (clean === r.es) return { key, lang: "es", mode: r.mode };
    if (clean === r.en) return { key, lang: "en", mode: r.mode };
  }
  return null;
};

/**
 * Given a pathname, return the equivalent path in the target language.
 * Returns null if the path is NOT an auth route.
 */
export const translateAuthRoute = (pathname, targetLang) => {
  const current = resolveAuthRoute(pathname);
  if (!current) return null;
  return AUTH_ROUTES[current.key][targetLang] ?? null;
};

/**
 * Page-title dictionary per mode+lang (used for document.title).
 */
export const AUTH_PAGE_TITLES = {
  login: {
    es: "Iniciar sesión | Quantro",
    en: "Sign in | Quantro",
  },
  signup: {
    es: "Crear cuenta | Quantro",
    en: "Create account | Quantro",
  },
};
