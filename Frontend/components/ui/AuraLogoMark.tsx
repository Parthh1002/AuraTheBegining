'use client';

export default function AuraLogoMark({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AURA Logo Emblem"
    >
      <defs>
        <radialGradient id="auraGoldGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="50%" stopColor="#D4A02A" />
          <stop offset="100%" stopColor="#8B5E34" />
        </radialGradient>

        <linearGradient id="auraGoldLinear" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8C168" />
          <stop offset="50%" stopColor="#D4A02A" />
          <stop offset="100%" stopColor="#996E1E" />
        </linearGradient>
      </defs>

      {/* Radiant Sunburst Rays */}
      <g stroke="url(#auraGoldGrad)" strokeWidth="1.5" opacity="0.85" strokeLinecap="round">
        <line x1="50" y1="6" x2="50" y2="14" />
        <line x1="50" y1="86" x2="50" y2="94" />
        <line x1="6" y1="50" x2="14" y2="50" />
        <line x1="86" y1="50" x2="94" y2="50" />
        <line x1="19" y1="19" x2="25" y2="25" />
        <line x1="75" y1="75" x2="81" y2="81" />
        <line x1="19" y1="81" x2="25" y2="75" />
        <line x1="75" y1="25" x2="81" y2="19" />
      </g>

      {/* Outer Crest Ring */}
      <circle
        cx="50"
        cy="50"
        r="34"
        stroke="url(#auraGoldLinear)"
        strokeWidth="2.5"
      />

      {/* Inner Dotted Accent Ring */}
      <circle
        cx="50"
        cy="50"
        r="28"
        stroke="#D4A02A"
        strokeWidth="1"
        strokeDasharray="2 4"
        opacity="0.7"
      />

      {/* Stylized Apex Monogram 'A' */}
      <path
        d="M 50 24 L 33 68 H 41 L 45 56 H 55 L 59 68 H 67 L 50 24 Z M 48 48 L 50 40 L 52 48 H 48 Z"
        fill="url(#auraGoldLinear)"
      />

      {/* Radiant Apex Diamond Star */}
      <polygon points="50,15 52.5,20 57.5,20 53.5,23 55,28 50,25 45,28 46.5,23 42.5,20 47.5,20" fill="#F5F1E8" />
    </svg>
  );
}
