import React, { useId } from "react";
import { Link } from "react-router-dom";

/**
 * Unified Quantro brand logo — geometric "Q" fintech mark (cyan→mint).
 * Keep geometry in sync with konta KontaLogo / public/quantro-mark.svg.
 */
export const QuantroLogo = ({
  size = 32,
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

/** Icon-only mark */
export const QuantroLogoMark = ({
  size = 32,
  glow = true,
  transparent = false,
  className = "",
  "aria-label": ariaLabel = "Quantro",
}) => {
  const uid = useId();
  const gradId = `q-grad-${uid}`;
  const bgId = `q-bg-${uid}`;
  const glowId = `q-glow-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
      role="img"
      className={className}
    >
      <defs>
        <linearGradient id={gradId} x1="10" y1="8" x2="54" y2="56">
          <stop offset="0%" stopColor="#00F5FF" />
          <stop offset="55%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id={bgId} x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>
        {glow && (
          <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="0.9" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>
      {!transparent && (
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="16"
          fill={`url(#${bgId})`}
          stroke={`url(#${gradId})`}
          strokeWidth="1.2"
          strokeOpacity="0.55"
        />
      )}
      <circle
        cx="31"
        cy="30"
        r="13"
        stroke={`url(#${gradId})`}
        strokeWidth="3.2"
        fill="none"
        filter={glow ? `url(#${glowId})` : undefined}
      />
      <circle cx="31" cy="30" r="6.5" fill={`url(#${gradId})`} opacity="0.14" />
      <path
        d="M39.2 38.5 L47.5 48"
        stroke={`url(#${gradId})`}
        strokeWidth="3.4"
        strokeLinecap="round"
        filter={glow ? `url(#${glowId})` : undefined}
      />
      <path
        d="M37.5 36.8 L41.2 41"
        stroke={`url(#${gradId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
};

// Default = mark (LegalPageLayout imports default as QuantroLogoMark)
export default QuantroLogoMark;
