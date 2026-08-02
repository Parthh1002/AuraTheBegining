'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import AuraParticles from './AuraParticles';

export default function IntroOverlay() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [showSkip,    setShowSkip]    = useState(false);
  const [mounted,     setMounted]     = useState(false);

  /* ── refs ───────────────────────────────────────── */
  const containerRef  = useRef<HTMLDivElement>(null);
  const contentRef    = useRef<HTMLDivElement>(null);
  const ring1Ref      = useRef<HTMLDivElement>(null);
  const ring2Ref      = useRef<HTMLDivElement>(null);
  const ring3Ref      = useRef<HTMLDivElement>(null);
  const centerARef    = useRef<HTMLSpanElement>(null);
  const dividerRef    = useRef<HTMLDivElement>(null);
  const wordmarkRef   = useRef<HTMLHeadingElement>(null);
  const taglineRef    = useRef<HTMLParagraphElement>(null);
  const subtitleRef   = useRef<HTMLParagraphElement>(null);
  const panelLeftRef  = useRef<HTMLDivElement>(null);
  const panelRightRef = useRef<HTMLDivElement>(null);
  const seamRef       = useRef<HTMLDivElement>(null);
  const tlRef         = useRef<gsap.core.Timeline | null>(null);

  /* ── destroy ─────────────────────────────────────── */
  const destroyIntro = () => {
    document.body.style.overflow = '';
    setShowOverlay(false);
  };

  /* ── skip → compressed parting (always premium) ─── */
  const triggerPart = (dur = 0.55) => {
    const pL = panelLeftRef.current;
    const pR = panelRightRef.current;
    if (!pL || !pR) { destroyIntro(); return; }
    if (contentRef.current) gsap.set(contentRef.current, { opacity: 0 });
    if (seamRef.current)    gsap.set(seamRef.current,    { opacity: 0 });
    gsap.to([pL, pR], {
      duration: dur,
      ease: 'power3.inOut',
      x: (i: number) => (i === 0 ? '-100%' : '100%'),
      onComplete: destroyIntro,
    });
  };

  const handleSkip = () => {
    tlRef.current?.kill();
    triggerPart(0.5);
  };

  /* ── Effect 1: mount flag ─────────────────────── */
  useEffect(() => { setMounted(true); }, []);

  /* ── Effect 2: GSAP (runs after DOM is ready) ── */
  useEffect(() => {
    if (!mounted) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.style.overflow = 'hidden';

    if (prefersReduced) {
      const t = gsap.timeline({ onComplete: destroyIntro });
      t.to(containerRef.current, { opacity: 0, duration: 0.3, delay: 1.5 });
      tlRef.current = t;
      return () => { t.kill(); document.body.style.overflow = ''; };
    }

    const ctx = gsap.context(() => {
      /* ─── initial hidden states ─────────────── */
      gsap.set([ring1Ref.current, ring2Ref.current, ring3Ref.current],
        { scale: 0, opacity: 0, rotation: -180 });
      gsap.set(centerARef.current,  { scale: 0, opacity: 0 });
      gsap.set('.intro-letter',     { opacity: 0, y: 50, skewY: 6 });
      gsap.set(dividerRef.current,  { scaleX: 0, opacity: 0 });
      gsap.set(taglineRef.current,  { opacity: 0, y: 14, letterSpacing: '0.1em' });
      gsap.set(subtitleRef.current, { opacity: 0, y: 10 });
      gsap.set(panelLeftRef.current,  { x: '0%' });
      gsap.set(panelRightRef.current, { x: '0%' });
      gsap.set(seamRef.current,       { opacity: 0, scaleY: 0 });

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.call(() => setShowSkip(true), [], 0.35);

      /* ── RING 1 outer ── 0.1s */
      tl.to(ring1Ref.current, {
        scale: 1, opacity: 1, rotation: 0,
        duration: 0.65, ease: 'back.out(1.8)',
      }, 0.1);

      /* ── RING 2 middle ── 0.3s */
      tl.to(ring2Ref.current, {
        scale: 1, opacity: 1, rotation: 0,
        duration: 0.6, ease: 'back.out(2)',
      }, 0.3);

      /* ── RING 3 gold ── 0.55s */
      tl.to(ring3Ref.current, {
        scale: 1, opacity: 1, rotation: 0,
        duration: 0.55, ease: 'back.out(2.5)',
      }, 0.55);

      /* ── CENTER "A" ── 0.85s */
      tl.to(centerARef.current, {
        scale: 1, opacity: 1,
        duration: 0.4, ease: 'back.out(3)',
      }, 0.85);

      /* ── GOLD RING GLOW (infinite until parting) ── */
      tl.to(ring3Ref.current, {
        boxShadow: '0 0 28px rgba(212,160,42,0.9), inset 0 0 14px rgba(212,160,42,0.45)',
        duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1,
      }, 1.0);

      /* ── A-U-R-A letters stagger ── 1.05s */
      tl.to('.intro-letter', {
        opacity: 1, y: 0, skewY: 0,
        duration: 0.6, stagger: 0.1, ease: 'expo.out',
      }, 1.05);

      /* ── GOLD DIVIDER draws ── 1.6s */
      tl.to(dividerRef.current, {
        scaleX: 1, opacity: 1,
        duration: 0.4, ease: 'power3.out',
      }, 1.6);

      /* ── "THE BEGINNING" tracks out ── 1.8s */
      tl.to(taglineRef.current, {
        opacity: 1, y: 0, letterSpacing: '0.38em',
        duration: 0.65, ease: 'power3.out',
      }, 1.8);

      /* ── Subtitle ── 2.1s */
      tl.to(subtitleRef.current, {
        opacity: 1, y: 0,
        duration: 0.5, ease: 'power2.out',
      }, 2.1);

      /* ── Medallion gentle float ── */
      tl.to('.intro-medallion', {
        y: -10, duration: 1.0, ease: 'sine.inOut', yoyo: true, repeat: -1,
      }, 1.9);

      /* ════════════════════════════════════════
         "PARTING OF LIGHT" — starts at 2.5s
         Total target finish ≈ 4.0s
         ════════════════════════════════════════ */

      /* A — content fades (0.35s) → done at 2.85s */
      tl.to(contentRef.current, {
        opacity: 0, duration: 0.35, ease: 'power2.in',
      }, 2.5);

      /* B — seam-light appears (0.3s) → at 2.85s */
      tl.to(seamRef.current, {
        opacity: 1, scaleY: 1, duration: 0.3, ease: 'power2.out',
      }, 2.8);

      /* C — seam intensifies briefly (0.2s) → at 3.05s */
      tl.to(seamRef.current, {
        filter: 'blur(3px) brightness(1.8)',
        duration: 0.2, ease: 'sine.in',
      }, 3.05);

      /* D — PANELS PART (0.7s, power4.out) → done at 3.95s */
      tl.to(panelLeftRef.current, {
        x: '-100%', duration: 0.7, ease: 'power4.out', willChange: 'transform',
      }, 3.25);
      tl.to(panelRightRef.current, {
        x: '100%', duration: 0.7, ease: 'power4.out', willChange: 'transform',
      }, 3.25);

      /* E — seam bleeds out as gap opens */
      tl.to(seamRef.current, {
        opacity: 0, scaleX: 10, filter: 'blur(24px)',
        duration: 0.65, ease: 'power3.out',
      }, 3.3);

      /* F — destroy overlay at 4.0s exactly */
      tl.call(destroyIntro, [], 4.0);

    }, containerRef);

    return () => { ctx.revert(); document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!showOverlay) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] overflow-hidden pointer-events-auto"
      /* void-black background — content is white+gold on dark */
      style={{ background: '#0A0A0C' }}
      aria-label="AURA Introduction"
    >
      <div style={{ opacity: mounted ? 1 : 0, width: '100%', height: '100%' }}>
        {/* ── LEFT PANEL ── */}
        <div
          ref={panelLeftRef}
          className="absolute top-0 left-0 h-full will-change-transform"
          style={{ width: '50vw', background: '#0A0A0C', zIndex: 20 }}
        />

        {/* ── RIGHT PANEL ── */}
        <div
          ref={panelRightRef}
          className="absolute top-0 right-0 h-full will-change-transform"
          style={{ width: '50vw', background: '#0A0A0C', zIndex: 20 }}
        />

        {/* ── GOLD SEAM LIGHT ── */}
        <div
          ref={seamRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 h-full origin-center"
          style={{
            width: 2,
            zIndex: 30,
            background: 'linear-gradient(180deg, transparent 0%, #D4A02A 30%, #D4A02A 70%, transparent 100%)',
            filter: 'blur(1px)',
            boxShadow: '0 0 20px 8px rgba(212,160,42,0.6)',
          }}
        />

        {/* ── INTRO CONTENT ── sits above panels, below seam */}
        <div
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ zIndex: 25 }}
        >
          {/* Subtle gold radial glow on dark bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(212,160,42,0.09) 0%, transparent 70%)',
            }}
          />

          {/* Ambient signature particles inside the glow */}
          {mounted && <AuraParticles variant="intro" />}

          <div className="relative flex flex-col items-center text-center select-none">
            {/* ── MEDALLION ── */}
            <div
              className="intro-medallion relative mb-9 flex items-center justify-center"
              style={{ width: 200, height: 200 }}
            >
              {/* Outer ring — white hairline */}
              <div
                ref={ring1Ref}
                className="absolute rounded-full"
                style={{ width: 200, height: 200, border: '1px solid rgba(255,255,255,0.28)' }}
              />

              {/* Middle ring — white hairline */}
              <div
                ref={ring2Ref}
                className="absolute rounded-full"
                style={{ width: 154, height: 154, border: '1px solid rgba(255,255,255,0.20)' }}
              />

              {/* Inner gold ring */}
              <div
                ref={ring3Ref}
                className="absolute rounded-full"
                style={{ width: 110, height: 110, border: '2px solid #D4A02A' }}
              />

              {/* Center "A" — gold */}
              <div
                className="relative z-10 flex items-center justify-center"
                style={{ width: 90, height: 90 }}
              >
                <span
                  ref={centerARef}
                  className="font-serif font-bold"
                  style={{
                    fontSize: 46,
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    color: '#D4A02A',
                  }}
                >
                  A
                </span>
              </div>
            </div>

            {/* ── AURA WORDMARK — white ── */}
            <h1
              ref={wordmarkRef}
              className="font-serif font-bold uppercase flex items-center"
              style={{
                fontSize: 'clamp(52px, 10vw, 88px)',
                letterSpacing: '0.22em',
                lineHeight: 1,
                color: '#FFFFFF',
              }}
            >
              <span className="intro-letter inline-block">A</span>
              <span className="intro-letter inline-block">U</span>
              <span className="intro-letter inline-block">R</span>
              <span className="intro-letter inline-block">A</span>
            </h1>

            {/* ── GOLD DIVIDER ── */}
            <div
              ref={dividerRef}
              className="origin-center mt-5 mb-5"
              style={{
                width: 110,
                height: 1,
                background: 'linear-gradient(90deg, transparent, #D4A02A, transparent)',
              }}
            />

            {/* ── "THE BEGINNING" — gold ── */}
            <p
              ref={taglineRef}
              className="font-sans font-black uppercase"
              style={{ fontSize: 11, letterSpacing: '0.1em', color: '#D4A02A' }}
            >
              THE BEGINNING
            </p>

            {/* ── SUBTITLE — white/50% ── */}
            <p
              ref={subtitleRef}
              className="font-sans uppercase mt-2"
              style={{
                fontSize: 10,
                letterSpacing: '0.38em',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              GIDC DAHEGAM · BOUTIQUE SHOWROOM
            </p>
          </div>
        </div>

        {/* ── SKIP BUTTON ── */}
        {showSkip && (
          <button
            onClick={handleSkip}
            className="absolute top-6 right-6 z-40 text-[10px] font-bold tracking-[0.25em] uppercase border px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
            style={{
              color: 'rgba(255,255,255,0.5)',
              borderColor: 'rgba(255,255,255,0.2)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#D4A02A';
              (e.currentTarget as HTMLElement).style.borderColor = '#D4A02A';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
            }}
          >
            SKIP
          </button>
        )}
      </div>
    </div>
  );
}
