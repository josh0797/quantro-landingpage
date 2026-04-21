import React from "react";
import { Link } from "react-router-dom";

/**
 * Unified Quantro brand logo. Single source of truth used across the app.
 * - Icon: rounded square with "Q" in cyan/teal gradient + sutil glow
 * - Word: "Quantro" sans-serif (Satoshi)
 * - Variants: default | mark-only (icon alone)
 */
export const QuantroLogo = ({
  size = 32, // icon height in px
  showWordmark = true,
  to = "/",
  className = "",
  testId = "quantro-logo",
}) => {
  const content = (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      data-testid={testId}
    >
      <QuantroLogoMark size={size} />
      {showWordmark && (
        <span
          className="font-satoshi font-semibold text-white tracking-tight leading-none"
          style={{ fontSize: Math.round(size * 0.62) }}
        >
          Quantro
        </span>
      )}
    </span>
  );

  if (!to) return content;
  return (
    <Link to={to} aria-label="Quantro — ir al inicio">
      {content}
    </Link>
  );
};

/**
 * Icon-only mark. Same symbol used in the favicon — keep pixel-identical.
 */
export const QuantroLogoMark = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Quantro"
  >
    <defs>
      <linearGradient id="q-grad" x1="8" y1="8" x2="56" y2="56">
        <stop offset="0%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#00FFA3" />
      </linearGradient>
      <linearGradient id="q-bg" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#0F172A" />
        <stop offset="100%" stopColor="#030712" />
      </linearGradient>
      <filter id="q-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.2" />
      </filter>
    </defs>

    {/* Rounded dark glass container */}
    <rect
      x="2"
      y="2"
      width="60"
      height="60"
      rx="16"
      fill="url(#q-bg)"
      stroke="url(#q-grad)"
      strokeWidth="1.25"
      strokeOpacity="0.5"
    />

    {/* Subtle inner glow ring */}
    <rect
      x="7"
      y="7"
      width="50"
      height="50"
      rx="12"
      stroke="url(#q-grad)"
      strokeWidth="0.6"
      opacity="0.18"
    />

    {/* The "Q" — circle + tail */}
    <circle
      cx="32"
      cy="31"
      r="11"
      stroke="url(#q-grad)"
      strokeWidth="3"
      fill="none"
      filter="url(#q-glow)"
    />
    <path
      d="M39 38.5 L47 47"
      stroke="url(#q-grad)"
      strokeWidth="3"
      strokeLinecap="round"
      filter="url(#q-glow)"
    />
  </svg>
);

export default QuantroLogo;
