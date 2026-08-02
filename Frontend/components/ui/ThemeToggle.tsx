'use client';

import { useState, useEffect, useRef } from 'react';
import { Sun, Moon } from 'lucide-react';
import gsap from 'gsap';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('aura-theme');
    let darkState = false;

    if (savedTheme) {
      darkState = savedTheme === 'dark';
    } else {
      // Default to light mode on first visit
      darkState = false;
    }

    setIsDark(darkState);
    if (darkState) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextState = !isDark;
    
    // GSAP animation for the swap
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: "+=180",
        opacity: 0,
        scale: 0.5,
        duration: 0.125,
        ease: "power2.in",
        onComplete: () => {
          setIsDark(nextState);
          
          if (nextState) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('aura-theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('aura-theme', 'light');
          }
          
          gsap.to(iconRef.current, {
            rotation: "+=180",
            opacity: 1,
            scale: 1,
            duration: 0.125,
            ease: "power2.out"
          });
        }
      });
    } else {
      // Fallback if ref is not attached
      setIsDark(nextState);
      if (nextState) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('aura-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('aura-theme', 'light');
      }
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full border border-aura-line bg-aura-surface" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-full border border-aura-line bg-aura-surface transition-all duration-300 cursor-pointer flex items-center justify-center hover:border-aura-gold hover:shadow-[0_0_15px_rgba(212,160,42,0.15)]"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
    >
      <div ref={iconRef} className="flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-aura-gold" />
        ) : (
          <Moon className="w-4 h-4 text-aura-ink" />
        )}
      </div>
    </button>
  );
}
