import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { trackCTAClick } from "../../lib/analytics";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Final CTA Section - email capture for waitlist
export const FinalCTASection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    trackCTAClick("footer_form");

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/early-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.detail || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedSection id="early-access" className="py-32 px-6 relative">
      <div className="gradient-orb gradient-orb-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />

      <div className="max-w-3xl mx-auto text-center relative">
        <motion.div variants={fadeInUp}>
          <h2
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6"
            data-testid="final-cta-headline"
          >
            Stop analyzing.
            <br />
            <span className="gradient-text">Start executing.</span>
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Join thousands of businesses using Quantro to gain clarity and make better decisions.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              data-testid="early-access-form"
            >
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 h-12 px-4 rounded-full focus:border-blue-500 focus:ring-blue-500/20"
                required
                disabled={loading}
                data-testid="email-input"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center justify-center gap-2 h-12 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="submit-button"
              >
                {loading ? "Submitting..." : "Start Free Trial"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
          ) : (
            <div
              className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 max-w-md mx-auto"
              data-testid="success-message"
            >
              <div className="flex items-center justify-center gap-3 text-emerald-400">
                <Check size={24} />
                <span className="text-lg font-medium">You're on the list!</span>
              </div>
              <p className="text-slate-400 mt-2 text-sm">
                We'll be in touch soon with your free trial access.
              </p>
            </div>
          )}
          {error && (
            <div className="mt-4 text-red-400 text-sm text-center" data-testid="error-message">
              {error}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default FinalCTASection;
