/**
 * Lightweight SEO/Open Graph meta tag updater.
 *
 * Mutates <head> in place so SPA route transitions refresh previews on
 * LinkedIn, Twitter, Slack, iMessage, etc. Also maintains a canonical link.
 *
 * Accepts an object with:
 *   { title, description, url, ogTitle, ogDescription, image, twitterCard }
 *
 * Returns a cleanup function that restores any previously-set values so
 * unmounting a page doesn't leak stale OG data onto the next route.
 */

const MUTATED_ATTR = "data-dyn-meta";

const ensureMetaByName = (name) => {
  let el = document.head.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    el.setAttribute(MUTATED_ATTR, "true");
    document.head.appendChild(el);
  }
  return el;
};

const ensureMetaByProperty = (property) => {
  let el = document.head.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    el.setAttribute(MUTATED_ATTR, "true");
    document.head.appendChild(el);
  }
  return el;
};

const ensureCanonical = () => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    el.setAttribute(MUTATED_ATTR, "true");
    document.head.appendChild(el);
  }
  return el;
};

export const applyPageMeta = ({
  title,
  description,
  url,
  ogTitle,
  ogDescription,
  image,
  twitterCard = "summary_large_image",
} = {}) => {
  // Snapshot previous values for cleanup
  const prev = {
    title: document.title,
    description: document.head.querySelector('meta[name="description"]')?.getAttribute("content"),
    canonical: document.head.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ogTitle: document.head.querySelector('meta[property="og:title"]')?.getAttribute("content"),
    ogDesc: document.head.querySelector('meta[property="og:description"]')?.getAttribute("content"),
    ogUrl: document.head.querySelector('meta[property="og:url"]')?.getAttribute("content"),
    ogImage: document.head.querySelector('meta[property="og:image"]')?.getAttribute("content"),
    twTitle: document.head.querySelector('meta[name="twitter:title"]')?.getAttribute("content"),
    twDesc: document.head.querySelector('meta[name="twitter:description"]')?.getAttribute("content"),
    twCard: document.head.querySelector('meta[name="twitter:card"]')?.getAttribute("content"),
    twImage: document.head.querySelector('meta[name="twitter:image"]')?.getAttribute("content"),
  };

  if (title) document.title = title;
  if (description) ensureMetaByName("description").setAttribute("content", description);
  if (url) ensureCanonical().setAttribute("href", url);

  const finalOgTitle = ogTitle || title;
  const finalOgDesc = ogDescription || description;

  if (finalOgTitle) ensureMetaByProperty("og:title").setAttribute("content", finalOgTitle);
  if (finalOgDesc) ensureMetaByProperty("og:description").setAttribute("content", finalOgDesc);
  if (url) ensureMetaByProperty("og:url").setAttribute("content", url);
  if (image) ensureMetaByProperty("og:image").setAttribute("content", image);
  ensureMetaByProperty("og:type").setAttribute("content", "website");

  if (finalOgTitle) ensureMetaByName("twitter:title").setAttribute("content", finalOgTitle);
  if (finalOgDesc) ensureMetaByName("twitter:description").setAttribute("content", finalOgDesc);
  if (image) ensureMetaByName("twitter:image").setAttribute("content", image);
  ensureMetaByName("twitter:card").setAttribute("content", twitterCard);

  return () => {
    if (prev.title) document.title = prev.title;
    if (prev.description) {
      ensureMetaByName("description").setAttribute("content", prev.description);
    }
    if (prev.canonical) {
      ensureCanonical().setAttribute("href", prev.canonical);
    }
    if (prev.ogTitle) ensureMetaByProperty("og:title").setAttribute("content", prev.ogTitle);
    if (prev.ogDesc) ensureMetaByProperty("og:description").setAttribute("content", prev.ogDesc);
    if (prev.ogUrl) ensureMetaByProperty("og:url").setAttribute("content", prev.ogUrl);
    if (prev.ogImage) ensureMetaByProperty("og:image").setAttribute("content", prev.ogImage);
    if (prev.twTitle) ensureMetaByName("twitter:title").setAttribute("content", prev.twTitle);
    if (prev.twDesc) ensureMetaByName("twitter:description").setAttribute("content", prev.twDesc);
    if (prev.twImage) ensureMetaByName("twitter:image").setAttribute("content", prev.twImage);
    if (prev.twCard) ensureMetaByName("twitter:card").setAttribute("content", prev.twCard);
  };
};
