'use client';

import { useEffect, useRef } from 'react';

interface AuraParticlesProps {
  variant?: 'light' | 'dark' | 'intro'; // 'intro' is dense and fast
  className?: string;
}

export default function AuraParticles({ variant = 'dark', className = '' }: AuraParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    let particleCount = variant === 'intro' ? (isMobile ? 40 : 80) : variant === 'dark' ? (isMobile ? 20 : 40) : (isMobile ? 10 : 20);

    const particles: {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      speedY: number;
      speedX: number;
      swayOffset: number;
      swaySpeed: number;
    }[] = [];

    const resize = () => {
      // Setup High DPI canvas
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    const initParticles = () => {
      particles.length = 0;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * (variant === 'intro' ? 3 : 2.5) + 0.5,
          opacity: Math.random() * (variant === 'intro' ? 0.3 : 0.15) + 0.05,
          speedY: (Math.random() * (variant === 'intro' ? 1.5 : 0.5) + 0.2) * -1, // moving up
          speedX: 0,
          swayOffset: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.02 + 0.01,
        });
      }
    };

    let animationFrameId: number;

    const render = () => {
      if (!ctx || !canvas) return;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      ctx.clearRect(0, 0, width, height);
      
      const rgb = variant === 'dark' || variant === 'intro' ? '212, 160, 42' : '184, 137, 30';

      particles.forEach((p) => {
        // Update position if motion is allowed
        if (!prefersReducedMotion) {
          p.y += p.speedY;
          p.swayOffset += p.swaySpeed;
          p.x += Math.sin(p.swayOffset) * 0.3; // Horizontal sway

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
        }

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${p.opacity})`;
        ctx.shadowBlur = p.radius * 2;
        ctx.shadowColor = `rgba(${rgb}, ${p.opacity * 2})`;
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', () => {
      resize();
      initParticles();
      if (prefersReducedMotion) {
        render(); // Render once if static
      }
    });

    resize();
    initParticles();
    
    if (prefersReducedMotion) {
      render(); // Render single static frame
    } else {
      render();
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}
