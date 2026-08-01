'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, MessageSquare, Heart, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import MagneticButton from '@/components/animation/MagneticButton';
import { buildProductWhatsAppUrl } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/utils';
import { fetchApi } from '@/lib/api';
import { ProductCardData } from './ProductCard';

interface QuickViewModalProps {
  product: ProductCardData & {
    description?: string | null;
    sizes?: string[] | null;
    sku?: string | null;
    product_images?: { storage_path: string; is_primary?: boolean }[];
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>(product.cover_image || '');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '38');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const sizesList = product.sizes && product.sizes.length > 0 ? product.sizes : ['38', '40', '42', '44'];

  const images = product.product_images && product.product_images.length > 0
    ? product.product_images.map((img) => img.storage_path)
    : [
        product.cover_image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop',
      ];

  const fitLabels: Record<string, string> = {
    '38': 'Slim Fit (Chest 38")',
    '40': 'Tailored Fit (Chest 40")',
    '42': 'Regular Fit (Chest 42")',
    '44': 'Classic Fit (Chest 44")',
    '46': 'Comfort Fit (Chest 46")',
  };

  useEffect(() => {
    if (sizesList.length > 0) {
      const defaultSize = sizesList[0];
      setSelectedSize(defaultSize);
      setSelectedImage(images[0]);
    }
  }, [product]);

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
  }, [product.id, isOpen]);

  if (!isOpen) return null;

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    // Find index of selected size
    const index = sizesList.indexOf(size);
    if (index >= 0 && images[index % images.length]) {
      setSelectedImage(images[index % images.length]);
    }
  };

  const toggleWishlist = () => {
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

  const handleWhatsAppEnquiry = async () => {
    setIsLogging(true);

    const waUrl = buildProductWhatsAppUrl({
      whatsappNumber: '919876543210',
      productName: product.name,
      size: selectedSize,
      sku: product.sku || undefined,
      priceLabel: product.price_label || undefined,
    });

    try {
      await fetchApi('/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          source: 'whatsapp_product',
          product_id: product.id,
          message: `Quick View WhatsApp Inquiry for ${product.name} (Size: ${selectedSize})`,
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLogging(false);
      window.open(waUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-aura-void/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-4xl bg-aura-panel border border-aura-line rounded-2xl overflow-hidden shadow-2xl relative my-8 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-aura-void/80 text-aura-cream hover:text-aura-gold border border-aura-line transition-colors cursor-pointer"
          aria-label="Close Quick View"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Model Fit Image Gallery */}
        <div className="w-full md:w-1/2 bg-aura-elevated p-6 flex flex-col items-center justify-center relative">
          <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-aura-line shadow-lg group">
            <Image
              src={selectedImage}
              alt={`${product.name} - Size ${selectedSize}`}
              fill
              className="object-cover object-center transition-all duration-500"
            />
            {/* Dynamic Model Body Fit Badge */}
            <div className="absolute top-3 left-3 bg-aura-void/85 backdrop-blur-sm text-aura-gold border border-aura-line px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-md">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{fitLabels[selectedSize] || `Size ${selectedSize} Fit`}</span>
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-1">
              {images.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedImage(imgUrl);
                    if (sizesList[i]) setSelectedSize(sizesList[i]);
                  }}
                  className={`relative w-14 h-16 rounded border transition-all cursor-pointer overflow-hidden ${
                    selectedImage === imgUrl ? 'border-aura-gold scale-95 shadow-md ring-2 ring-aura-gold/40' : 'border-aura-line opacity-70'
                  }`}
                >
                  <Image src={imgUrl} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Garment Details & Size Selector */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 space-y-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              {product.collections?.name && (
                <span className="text-[10px] font-sans tracking-[0.25em] text-aura-gold uppercase font-bold">
                  {product.collections.name}
                </span>
              )}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-aura-cream mt-1">{product.name}</h2>
              <p className="font-serif text-xl text-aura-gold font-bold mt-2">
                {formatPrice(product.price_label)}
              </p>
            </div>

            {product.fabric && (
              <div className="p-3 bg-aura-elevated border border-aura-line rounded-lg text-xs space-y-0.5">
                <span className="text-[10px] text-aura-muted uppercase tracking-wider font-bold">Craftsmanship & Fabric:</span>
                <p className="text-aura-cream font-medium">{product.fabric}</p>
              </div>
            )}

            {/* Size Selector - Dynamically Swapping Model Image */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans tracking-wider text-aura-gold uppercase font-bold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" /> Select Size for Model Fit
                </span>
                <span className="text-[10px] text-aura-muted">Click size to update model body view</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizesList.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSizeSelect(s)}
                    className={`px-4 py-2 rounded text-xs font-bold border transition-all cursor-pointer ${
                      selectedSize === s
                        ? 'bg-aura-gold text-[#0A0A0C] border-aura-gold shadow-md ring-2 ring-aura-gold/40 scale-105'
                        : 'bg-aura-elevated text-aura-cream border-aura-line hover:border-aura-gold'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-aura-elevated border border-aura-line rounded-lg text-xs space-y-1 text-aura-muted">
              <p className="flex items-center gap-2 text-aura-cream">
                <ShieldCheck className="w-4 h-4 text-aura-gold shrink-0" />
                <span>Custom trial & master tailor fitting at GIDC Dahegam Showroom</span>
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-aura-line space-y-3">
            <div className="flex items-center gap-3">
              <MagneticButton className="flex-1">
                <button
                  onClick={handleWhatsAppEnquiry}
                  disabled={isLogging}
                  className="w-full bg-aura-gold text-[#0A0A0C] font-bold text-xs uppercase tracking-widest py-3.5 rounded hover:bg-aura-gold-soft transition-all shadow-[0_0_15px_rgba(212,160,42,0.3)] inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" /> Enquire Size {selectedSize} on WhatsApp
                </button>
              </MagneticButton>

              <button
                onClick={toggleWishlist}
                className={`p-3 rounded border transition-all cursor-pointer ${
                  isWishlisted ? 'bg-aura-gold/15 border-aura-gold text-aura-gold' : 'bg-aura-elevated border-aura-line text-aura-cream hover:text-aura-gold'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-aura-gold' : ''}`} />
              </button>
            </div>

            <Link
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-aura-gold hover:underline font-bold uppercase tracking-wider pt-1"
            >
              View Full Product Page Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
