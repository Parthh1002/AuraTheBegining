'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 1.2,
  distance = 50,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0 });
      return;
    }

    let x = 0;
    let y = 0;

    switch (direction) {
      case 'up': y = distance; break;
      case 'down': y = -distance; break;
      case 'left': x = distance; break;
      case 'right': x = -distance; break;
    }

    // Immediately set to invisible so it doesn't blink before scrolling
    gsap.set(el, { opacity: 0, y, x });

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          x: 0,
          duration,
          delay,
          ease: 'power3.out',
        });
      }
    });

    return () => {
      st.kill();
    };
  }, [direction, delay, duration, distance]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
