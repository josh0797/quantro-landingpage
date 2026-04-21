// GA4 CTA Click Tracking
export const trackCTAClick = (ctaLocation) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "cta_click", {
      event_category: "engagement",
      event_label: ctaLocation,
      cta_text: "Start Free Trial"
    });
  }
};
