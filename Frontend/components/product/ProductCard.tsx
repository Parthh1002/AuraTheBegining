'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import QuickViewModal from './QuickViewModal';

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price_label?: string | null;
  fabric?: string | null;
  in_stock: boolean;
  is_featured?: boolean;
  tags?: string[] | null;
  cover_image?: string;
  collections?: { name: string } | null;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const [isWishlisted,  setIsWishlisted]  = useState(false);
  const [heartAnimate,  setHeartAnimate]  = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const heartRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura-wishlist');
      if (saved) {
        try {
          const arr: string[] = JSON.parse(saved);
          setIsWishlisted(arr.includes(product.id));
        } catch { setIsWishlisted(false); }
      }
    }
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === 'undefined') return;

    let arr: string[] = [];
    const saved = localStorage.getItem('aura-wishlist');
    if (saved) { try { arr = JSON.parse(saved); } catch { arr = []; } }

    const next = !arr.includes(product.id);
    arr = next ? [...arr, product.id] : arr.filter((id) => id !== product.id);
    setIsWishlisted(next);

    // heart pop animation
    setHeartAnimate(false);
    requestAnimationFrame(() => setHeartAnimate(true));
    setTimeout(() => setHeartAnimate(false), 400);

    localStorage.setItem('aura-wishlist', JSON.stringify(arr));
    window.dispatchEvent(new Event('aura-wishlist-updated'));
  };

  const imageUrl =
    product.cover_image ||
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop';

  return (
    <>
      {/* Card — uses card-resting for elevation system */}
      <div className="card-resting group relative rounded-xl overflow-hidden flex flex-col justify-between">

        {/* ── IMAGE ── */}
        <div
          onClick={() => setQuickViewOpen(true)}
          className="relative w-full aspect-[3/4] overflow-hidden cursor-pointer img-duotone-light"
          style={{ background: 'var(--aura-surface-alt)' }}
        >
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* warm duotone overlay */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(212,160,42,0.035)', mixBlendMode: 'multiply' }} />

          {/* Quick View overlay */}
          <div className="absolute inset-0 bg-[#0A0A0C]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <span className="bg-[#D4A02A] text-[#0A0A0C] text-xs uppercase font-bold tracking-widest px-4 py-2 rounded shadow-lg inline-flex items-center gap-1.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
              <Eye className="w-4 h-4" /> Quick View
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {!product.in_stock && (
              <span className="bg-red-900/80 text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded uppercase backdrop-blur-sm border border-red-500/30">
                Out of Stock
              </span>
            )}
            {product.tags?.includes('new-arrival') && (
              <span className="bg-[#D4A02A] text-[#0A0A0C] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded uppercase shadow-sm">
                New Arrival
              </span>
            )}
            {product.tags?.includes('bestseller') && (
              <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded uppercase border backdrop-blur-sm"
                style={{ background: 'var(--aura-elevated)', color: 'var(--aura-gold-on-surface)', borderColor: 'var(--aura-line)' }}>
                Bestseller
              </span>
            )}
          </div>

          {/* Wishlist Heart */}
          <button
            ref={heartRef}
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-sm border transition-all cursor-pointer shadow-md ${heartAnimate ? 'heart-pop' : ''}`}
            style={{
              background: 'var(--aura-surface)',
              borderColor: 'var(--aura-line)',
            }}
            aria-label="Toggle Wishlist"
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                isWishlisted
                  ? 'fill-[#D4A02A] text-[#D4A02A]'
                  : 'text-[var(--aura-subink)] hover:text-[#D4A02A]'
              }`}
            />
          </button>
        </div>

        {/* ── CONTENT ── */}
        <div className="p-5 space-y-1.5">
          {product.collections?.name && (
            <p className="text-[10px] font-sans tracking-[0.2em] uppercase font-bold"
              style={{ color: 'var(--aura-gold-on-surface)' }}>
              {product.collections.name}
            </p>
          )}
          <h3 className="font-serif text-lg font-bold line-clamp-1 transition-colors duration-150"
            style={{ color: 'var(--aura-ink)' }}>
            <button
              onClick={() => setQuickViewOpen(true)}
              className="text-left cursor-pointer hover:text-[#D4A02A] transition-colors duration-150"
            >
              {product.name}
            </button>
          </h3>
          {product.fabric && (
            <p className="text-xs line-clamp-1" style={{ color: 'var(--aura-subink)' }}>
              {product.fabric}
            </p>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t"
          style={{ borderColor: 'var(--aura-line)' }}>
          <span className="text-xs font-bold" style={{ color: 'var(--aura-gold-on-surface)' }}>
            {formatPrice(product.price_label)}
          </span>
          <button
            onClick={() => setQuickViewOpen(true)}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-bold transition-colors duration-150 cursor-pointer hover:text-[#D4A02A]"
            style={{ color: 'var(--aura-ink)' }}
          >
            VIEW <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
