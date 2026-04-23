/**
 * Route ↔ language mapping for auth + platform-picker screens.
 * Single source of truth consumed by the <Route /> registry, the
 * LanguageSwitcher auto-redirect, and the document.title hook.
 */

export const AUTH_ROUTES = {
  signIn: { es: "/iniciar-sesion", en: "/sign-in", mode: "login" },
  signUp: { es: "/crear-cuenta", en: "/sign-up", mode: "signup" },
};

/**
 * Platform picker — the "¿A dónde quieres entrar?" screen.
 * Decoupled from auth: picking OS or Flow redirects directly to the
 * external product, which handles its own sign-in.
 */
export const PICKER_ROUTES = {
  es: "/acceso",
  en: "/access",
};

export const AUTH_ROUTE_PATHS = [
  ...Object.values(AUTH_ROUTES).flatMap((r) => [r.es, r.en]),
];

export const PICKER_ROUTE_PATHS = [PICKER_ROUTES.es, PICKER_ROUTES.en];

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
 * Map a path to `{ lang }` if it's a platform-picker route.
 */
export const resolvePickerRoute = (pathname) => {
  if (!pathname) return null;
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === PICKER_ROUTES.es) return { lang: "es" };
  if (clean === PICKER_ROUTES.en) return { lang: "en" };
  return null;
};

/**
 * Given a pathname, return the equivalent path in the target language.
 * Handles both auth and platform-picker routes.
 * Returns null if the path is neither.
 */
export const translateAuthRoute = (pathname, targetLang) => {
  const auth = resolveAuthRoute(pathname);
  if (auth) return AUTH_ROUTES[auth.key][targetLang] ?? null;
  const picker = resolvePickerRoute(pathname);
  if (picker) return PICKER_ROUTES[targetLang] ?? null;
  return null;
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

export const PICKER_PAGE_TITLES = {
  es: "Acceso | Quantro",
  en: "Access | Quantro",
};
