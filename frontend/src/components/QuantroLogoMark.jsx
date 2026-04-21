import React from "react";

// Premium Quantro SVG Logo System
export const QuantroLogoMark = ({
  size = 48,
  glow = false,
  transparent = true,
  className = "",
  strokeWidth = 1.8
}) => {
  const glowId = `quantro-glow-${size}-${glow ? "on" : "off"}`;
  const gradientId = `q-stroke-${size}`;
  const panelGradientId = `panel-fill-${size}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <>
          <div className="absolute inset-0 rounded-full bg-cyan-400/15 blur-2xl scale-125" />
          <div className="absolute inset-0 rounded-full bg-cyan-300/10 blur-3xl scale-150" />
        </>
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        aria-label="Quantro logo"
      >
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id={gradientId} x1="8" y1="8" x2="56" y2="56">
            <stop offset="0%" stopColor="#7DEBFF" />
            <stop offset="55%" stopColor="#00F5FF" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>

          <linearGradient id={panelGradientId} x1="6" y1="6" x2="58" y2="58">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
        </defs>

        {!transparent && (
          <rect
            x="6"
            y="6"
            width="52"
            height="52"
            rx="14"
            fill={`url(#${panelGradientId})`}
          />
        )}

        <rect
          x="8"
          y="8"
          width="48"
          height="48"
          rx="14"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          opacity="0.95"
          filter={glow ? `url(#${glowId})` : undefined}
        />

        <rect
          x="13"
          y="13"
          width="38"
          height="38"
          rx="10"
          stroke="#5EEBFF"
          strokeWidth="0.8"
          opacity="0.18"
        />

        <path
          d="M32 19.5C24.82 19.5 19 25.32 19 32.5C19 39.68 24.82 45.5 32 45.5C35.06 45.5 37.88 44.44 40.1 42.66"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeLinecap="round"
          filter={glow ? `url(#${glowId})` : undefined}
        />
        <path
          d="M32 19.5C39.18 19.5 45 25.32 45 32.5C45 35.96 43.65 39.1 41.45 41.43"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.95"
          filter={glow ? `url(#${glowId})` : undefined}
        />
        <path
          d="M38.5 38.5L47 49"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeLinecap="round"
          filter={glow ? `url(#${glowId})` : undefined}
        />
      </svg>
    </div>
  );
};

export default QuantroLogoMark;
