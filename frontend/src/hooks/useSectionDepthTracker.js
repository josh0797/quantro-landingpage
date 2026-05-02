import { useEffect } from "react";
import { trackSectionView, trackMaxSectionDepth } from "../lib/analytics";

/**
 * useSectionDepthTracker
 *
 * Mounts a single IntersectionObserver that watches every element
 * carrying a `data-section` attribute. Each section fires `section_view`
 * exactly once per page load the first time it becomes ≥50% visible.
 * On tab hide / pagehide we also send `scroll_depth_section` with the
 * deepest section the visitor reached — easy funnel analysis in GA4.
 *
 * Options:
 *   - threshold: IntersectionObserver visibility ratio (default 0.5)
 *   - rootMargin: optional, defaults to "0px 0px -10% 0px" so very tall
 *     sections register slightly before their midpoint.
 */
export const useSectionDepthTracker = ({
  threshold = 0.5,
  rootMargin = "0px 0px -10% 0px",
} = {}) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;

    const nodes = Array.from(document.querySelectorAll("[data-section]"));
    if (nodes.length === 0) return;

    // Establish DOM order = funnel order. Freeze it once so async
    // section remounts don't shuffle the index.
    const ordered = nodes.map((el, i) => ({
      el,
      id: el.getAttribute("data-section"),
      index: i,
    }));
    const total = ordered.length;
    const seen = new Set();
    let maxIndex = -1;
    let maxId = null;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const meta = ordered.find((o) => o.el === entry.target);
          if (!meta || seen.has(meta.id)) return;
          seen.add(meta.id);
          trackSectionView({ section: meta.id, index: meta.index, total });
          if (meta.index > maxIndex) {
            maxIndex = meta.index;
            maxId = meta.id;
          }
        });
      },
      { threshold, rootMargin }
    );
    ordered.forEach((o) => io.observe(o.el));

    const flushMaxDepth = () => {
      if (maxId == null) return;
      trackMaxSectionDepth({ section: maxId, index: maxIndex, total });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flushMaxDepth();
    };
    window.addEventListener("pagehide", flushMaxDepth);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      window.removeEventListener("pagehide", flushMaxDepth);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [threshold, rootMargin]);
};

export default useSectionDepthTracker;
