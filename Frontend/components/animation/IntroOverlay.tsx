'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import AuraLogoMark from '@/components/ui/AuraLogoMark';

export default function IntroOverlay() {
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [showSkip, setShowSkip] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const auraGlowRef = useRef<HTMLDivElement>(null);
  const auraRingRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const locationTagRef = useRef<HTMLParagraphElement>(null);
  const goldLineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // 1. Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setShowOverlay(false);
      return;
    }

    // 2. Show Skip button after 300ms
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 300);

    // 3. Build 60FPS Hardware-Accelerated GSAP Timeline (~3.6s Duration)
    const tl = gsap.timeline({
      onComplete: () => {
        finishIntro();
      },
    });
    timelineRef.current = tl;

    // Initial hardware-accelerated transforms
    gsap.set(logoWrapperRef.current, {
      scale: 0.2,
      opacity: 0,
      force3D: true,
      transformOrigin: '50% 50%',
    });
    gsap.set(auraGlowRef.current, { scale: 0.1, opacity: 0, force3D: true });
    gsap.set(auraRingRef.current, { scale: 0.2, opacity: 0, force3D: true });
    gsap.set(subtitleRef.current, { opacity: 0, y: 15, force3D: true });
    gsap.set(wordmarkRef.current, {
      opacity: 0,
      y: 30,
      scale: 0.9,
      force3D: true,
      transformOrigin: '50% 50%',
    });
    gsap.set(goldLineRef.current, { width: 0, opacity: 0 });
    gsap.set(taglineRef.current, { opacity: 0, y: -10, force3D: true });
    gsap.set(locationTagRef.current, { opacity: 0, y: 8, force3D: true });
    gsap.set(progressBarRef.current, { width: '0%' });

    // PHASE 1 (0.0s - 1.2s): Smooth Logo & Radial Glow Rise
    tl.to(auraGlowRef.current, {
      scale: 6,
      opacity: 0.85,
      duration: 1.0,
      ease: 'power2.out',
    })
    .to(logoWrapperRef.current, {
      scale: 1.2,
      opacity: 1,
      duration: 1.0,
      ease: 'back.out(1.5)',
    }, '-=1.0')
    .to(logoWrapperRef.current, {
      scale: 1.0,
      duration: 0.3,
      ease: 'power1.inOut',
    }, '-=0.2')

    // PHASE 2 (1.2s - 2.6s): Typography & Gold Line Reveal
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.2')
    .to(wordmarkRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.3')
    .to(goldLineRef.current, {
      width: '140px',
      opacity: 1,
      duration: 0.4,
      ease: 'power2.inOut',
    }, '-=0.4')
    .to(taglineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.3')
    .to(locationTagRef.current, {
      opacity: 0.85,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    }, '-=0.2')

    // PHASE 3 (2.6s - 3.2s): Aura Wave & Bottom Progress
    .to(auraRingRef.current, {
      scale: 3.5,
      opacity: 0.8,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.5')
    .to(progressBarRef.current, {
      width: '100%',
      duration: 3.2,
      ease: 'linear',
    }, 0)

    // PHASE 4 (3.2s - 3.6s): Smooth Crossfade Dissolve
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
    }, '-=0.1');

    return () => {
      clearTimeout(skipTimer);
      if (tl) tl.kill();
    };
  }, []);

  const finishIntro = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => setShowOverlay(false),
      });
    } else {
      setShowOverlay(false);
    }
  };

  const handleSkip = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    finishIntro();
  };

  if (!showOverlay) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#070709] overflow-hidden pointer-events-auto select-none will-change-transform"
      aria-label="AURA Introduction"
    >
      {/* Background Radial Glow */}
      <div
        ref={auraGlowRef}
        className="absolute w-36 h-36 rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(212,160,42,0.85) 0%, rgba(232,193,104,0.4) 40%, transparent 75%)',
        }}
      />

      {/* Expanding Ring */}
      <div
        ref={auraRingRef}
        className="absolute w-44 h-44 rounded-full pointer-events-none border-2 border-[#D4A02A]/70 z-0"
        style={{
          boxShadow: '0 0 40px rgba(212,160,42,0.5)',
        }}
      />

      {/* Container - Fully Mobile Responsive */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center justify-center max-w-md sm:max-w-xl w-full space-y-3">
        {/* Animated Gold Logo Mark */}
        <div ref={logoWrapperRef} className="relative z-20 mb-1">
          <AuraLogoMark className="w-20 h-20 sm:w-28 sm:h-28 drop-shadow-[0_0_25px_rgba(212,160,42,0.9)]" />
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-sans text-[9px] sm:text-xs tracking-[0.35em] sm:tracking-[0.45em] text-[#E8C168] uppercase font-bold"
        >
          LIGHT EMERGING FROM DARKNESS
        </p>

        {/* Brand Name "AURA" */}
        <div className="py-1">
          <h1
            ref={wordmarkRef}
            className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold text-[#F5F1E8] uppercase tracking-[0.3em] sm:tracking-[0.4em] drop-shadow-[0_0_30px_rgba(212,160,42,0.7)]"
          >
            AURA
          </h1>
        </div>

        {/* Gold Separator Line */}
        <div
          ref={goldLineRef}
          className="h-[2px] bg-gradient-to-r from-transparent via-[#D4A02A] to-transparent my-1 shadow-[0_0_10px_#D4A02A]"
        />

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="font-sans text-[11px] sm:text-sm tracking-[0.35em] sm:tracking-[0.5em] text-[#D4A02A] uppercase font-extrabold"
        >
          THE BEGINNING • MENS WEAR
        </p>

        {/* Store Location */}
        <p
          ref={locationTagRef}
          className="font-sans text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.35em] text-[#9C9894] uppercase font-medium"
        >
          GIDC DAHEGAM • BOUTIQUE SHOWROOM
        </p>
      </div>

      {/* Bottom Gold Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#151517] z-20">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-[#8B5E34] via-[#D4A02A] to-[#F5F1E8] shadow-[0_0_10px_rgba(212,160,42,0.8)]"
        />
      </div>

      {/* Skip Button */}
      {showSkip && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#E8C168] hover:text-white uppercase border border-[#D4A02A]/40 px-4 py-2 rounded-full transition-all bg-[#151517]/80 backdrop-blur-md cursor-pointer hover:bg-[#D4A02A] hover:text-[#0A0A0C]"
        >
          SKIP
        </button>
      )}
    </div>
  );
}
