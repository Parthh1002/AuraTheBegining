'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, MessageSquare, ArrowRight } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import EmptyState from '@/components/ui/EmptyState';
import { AuraSkeletonGrid } from '@/components/ui/AuraSkeleton';
import { buildProductWhatsAppUrl } from '@/lib/whatsapp';

export default function WishlistPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [whatsappNum, setWhatsappNum] = useState('919876543210');

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setLoading(true);

      try {
        const settings = await fetchApi('/settings');
        if (settings?.whatsapp_number) {
          setWhatsappNum(settings.whatsapp_number);
        }
      } catch (e) {
        console.warn('Could not fetch settings:', e);
      }

      if (typeof window === 'undefined') return;

      const saved = localStorage.getItem('aura-wishlist');
      if (!saved) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const ids: string[] = JSON.parse(saved);
        if (!Array.isArray(ids) || ids.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const data = await fetchApi(`/products?ids=${ids.join(',')}`);

        const formatted = (data || []).map((p: any) => {
          const primaryImg = p.product_images?.find((img: any) => img.is_primary)?.storage_path || p.product_images?.[0]?.storage_path;
          return {
            ...p,
            cover_image: primaryImg,
            collections: { name: p.collection_name },
          };
        });

        setProducts(formatted);
      } catch (err) {
        console.error('Error reading wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, []);

  const removeFromWishlist = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);

    if (typeof window !== 'undefined') {
      const arr = updated.map((p) => p.id);
      localStorage.setItem('aura-wishlist', JSON.stringify(arr));
      window.dispatchEvent(new Event('aura-wishlist-updated'));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-12 space-y-10">
      <div className="border-b border-aura-line pb-6 space-y-2">
        <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">SAVED ENSEMBLES</span>
        <h1 className="font-serif text-4xl font-bold text-aura-cream">Your Wishlist</h1>
      </div>

      {loading ? (
        <AuraSkeletonGrid count={4} />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const waUrl = buildProductWhatsAppUrl({
              whatsappNumber: whatsappNum,
              productName: product.name,
              sku: product.sku || undefined,
              priceLabel: product.price_label || undefined,
            });

            return (
              <div
                key={product.id}
                className="bg-aura-panel border border-aura-line rounded-xl overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div className="relative w-full aspect-[3/4] bg-aura-elevated">
                  <Image
                    src={product.cover_image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-aura-void/80 text-red-400 hover:text-red-300 rounded-full border border-red-500/20 backdrop-blur-sm cursor-pointer shadow-md"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  {product.collections?.name && (
                    <span className="text-[10px] tracking-widest text-aura-gold uppercase font-bold">
                      {product.collections.name}
                    </span>
                  )}
                  <h3 className="font-serif text-lg font-bold text-aura-cream">
                    <Link href={`/product/${product.slug}`}>{product.name}</Link>
                  </h3>
                  <p className="text-xs text-aura-gold font-bold">{product.price_label}</p>

                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-aura-gold text-[#0A0A0C] font-bold text-xs uppercase tracking-wider py-2.5 rounded text-center hover:bg-aura-gold-soft transition-colors inline-flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Enquire
                    </a>
                    <Link
                      href={`/product/${product.slug}`}
                      className="p-2.5 bg-aura-elevated text-aura-cream rounded border border-aura-line hover:border-aura-gold"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Your Wishlist is Empty"
          description="Save your favorite bespoke sherwanis, tuxedos, and suits to easily compare and enquire on WhatsApp."
        />
      )}
    </div>
  );
}
