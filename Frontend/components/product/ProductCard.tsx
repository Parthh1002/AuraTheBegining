'use client';

import { useState, useEffect } from 'react';
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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura-wishlist');
      if (saved) {
        try {
          const arr: string[] = JSON.parse(saved);
          setIsWishlisted(arr.includes(product.id));
        } catch {
          setIsWishlisted(false);
        }
      }
    }
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window === 'undefined') return;

    let arr: string[] = [];
    const saved = localStorage.getItem('aura-wishlist');
    if (saved) {
      try {
        arr = JSON.parse(saved);
      } catch {
        arr = [];
      }
    }

    if (arr.includes(product.id)) {
      arr = arr.filter((id) => id !== product.id);
      setIsWishlisted(false);
    } else {
      arr.push(product.id);
      setIsWishlisted(true);
    }

    localStorage.setItem('aura-wishlist', JSON.stringify(arr));
    window.dispatchEvent(new Event('aura-wishlist-updated'));
  };

  const imageUrl = product.cover_image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop';

  return (
    <>
      <div className="group relative bg-aura-panel border border-aura-line hover:border-aura-gold rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-xl">
        <div>
          {/* Image Container with Quick View Trigger */}
          <div
            onClick={() => setQuickViewOpen(true)}
            className="relative w-full aspect-[3/4] bg-aura-elevated overflow-hidden cursor-pointer"
          >
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Quick View Hover Overlay Button */}
            <div className="absolute inset-0 bg-aura-void/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
              <span className="bg-aura-gold text-[#0A0A0C] text-xs uppercase font-bold tracking-widest px-4 py-2 rounded shadow-lg inline-flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
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
                <span className="bg-aura-gold text-[#0A0A0C] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded uppercase shadow-sm">
                  New Arrival
                </span>
              )}
              {product.tags?.includes('bestseller') && (
                <span className="bg-aura-elevated text-aura-gold-soft text-[10px] font-bold tracking-widest px-2.5 py-1 rounded uppercase border border-aura-line backdrop-blur-sm">
                  Bestseller
                </span>
              )}
            </div>

            {/* Wishlist Heart Button */}
            <button
              onClick={toggleWishlist}
              className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-aura-panel/80 backdrop-blur-sm text-aura-cream hover:text-aura-gold border border-aura-line transition-all hover:scale-110 cursor-pointer shadow-md"
              aria-label="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-aura-gold text-aura-gold' : ''}`} />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-2">
            {product.collections?.name && (
              <p className="text-[10px] font-sans tracking-[0.2em] text-aura-gold uppercase font-bold">
                {product.collections.name}
              </p>
            )}

            <h3 className="font-serif text-lg font-bold text-aura-cream group-hover:text-aura-gold transition-colors line-clamp-1">
              <button
                onClick={() => setQuickViewOpen(true)}
                className="hover:underline text-left cursor-pointer"
              >
                {product.name}
              </button>
            </h3>

            {product.fabric && (
              <p className="text-xs text-aura-muted line-clamp-1">{product.fabric}</p>
            )}
          </div>
        </div>

        {/* Footer Price & Action Buttons */}
        <div className="p-5 pt-0 flex items-center justify-between border-t border-aura-line mt-2">
          <span className="text-xs font-bold text-aura-gold">
            {formatPrice(product.price_label)}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuickViewOpen(true)}
              className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-bold text-aura-cream hover:text-aura-gold transition-colors cursor-pointer"
            >
              VIEW <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Quick View Popup Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
