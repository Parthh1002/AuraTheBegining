'use client';

import { useEffect, useState } from 'react';

type LogoVariant = 'light' | 'dark' | 'auto';

export default function AuraLogoMark({ 
  className = 'w-10 h-10',
  variant = 'auto',
  style
}: { 
  className?: string;
  variant?: LogoVariant;
  style?: React.CSSProperties;
}) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    if (variant !== 'auto') return;
    setIsDarkTheme(document.documentElement.classList.contains('dark'));

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkTheme(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [variant]);

  const resolvedVariant = variant === 'auto' ? (isDarkTheme ? 'dark' : 'light') : variant;
  const isDark = resolvedVariant === 'dark';

  /* color tokens */
  const ringColor  = isDark ? 'rgba(212,160,42,0.55)' : 'rgba(27,26,24,0.35)';
  const goldRing   = '#D4A02A';
  const monogram   = isDark ? '#D4A02A' : '#1B1A18';

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="AURA Logo Emblem"
    >
      {/* NO white rect — fully transparent bg so it blends with any surface */}

      {/* Outer Ring */}
      <circle cx="50" cy="50" r="46" stroke={ringColor}  strokeWidth="0.8" />

      {/* Mid Ring */}
      <circle cx="50" cy="50" r="36" stroke={ringColor}  strokeWidth="0.7" />

      {/* Inner Gold Ring — always gold */}
      <circle cx="50" cy="50" r="26" stroke={goldRing}   strokeWidth="1.4" />

      {/* Monogram A — clean geometric */}
      <path
        d="M50 34 L40 66 H44.5 L47 59 H53 L55.5 66 H60 L50 34 Z M48.2 55 L50 48.5 L51.8 55 H48.2 Z"
        fill={monogram}
      />
    </svg>
  );
}
