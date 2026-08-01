'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('aura-theme');
    if (savedTheme) {
      const darkState = savedTheme === 'dark';
      setIsDark(darkState);
      if (darkState) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Default to dark mode for Aura Noir concept
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const nextState = !isDark;
    setIsDark(nextState);

    if (nextState) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aura-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aura-theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full border border-[#D4A02A]/20 bg-[#151517]" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center ${
        isDark
          ? 'bg-[#151517] text-[#E8C168] border-[#D4A02A]/30 hover:border-[#D4A02A] hover:shadow-[0_0_15px_rgba(212,160,42,0.3)]'
          : 'bg-[#FFFFFF] text-[#B8860B] border-[#B8860B]/30 hover:border-[#B8860B] hover:shadow-md'
      }`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#D4A02A] transition-transform duration-500 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="w-4 h-4 text-[#B8860B] transition-transform duration-500 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
