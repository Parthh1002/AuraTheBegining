'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const xTo = gsap.quickTo(glowRef.current, 'x', { duration: 0.4, ease: 'power2.out' });
    const yTo = gsap.quickTo(glowRef.current, 'y', { duration: 0.4, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[400px] h-[400px] -ml-[200px] -mt-[200px] pointer-events-none z-30 transition-opacity duration-500"
      style={{
        background: 'radial-gradient(circle, rgba(212,160,42,0.08) 0%, rgba(232,193,104,0.03) 45%, transparent 70%)',
        filter: 'blur(30px)',
      }}
    />
  );
}
