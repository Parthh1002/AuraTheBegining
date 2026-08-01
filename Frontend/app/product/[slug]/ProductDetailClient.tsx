'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageSquare, ShieldCheck, MapPin, ZoomIn, X, Bell, CheckCircle, UserCheck } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import MagneticButton from '@/components/animation/MagneticButton';
import { buildProductWhatsAppUrl } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/utils';
import { fetchApi } from '@/lib/api';

interface ProductImage {
  id: string;
  storage_path: string;
  alt_text?: string | null;
  display_order: number;
  is_primary?: boolean;
}

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    fabric?: string | null;
    sizes?: string[] | null;
    price_label?: string | null;
    tags?: string[] | null;
    in_stock: boolean;
    sku?: string | null;
    collections?: { id: string; name: string; slug: string } | null;
    product_images?: ProductImage[] | null;
  };
  whatsappNumber: string;
  relatedProducts: any[];
}

export default function ProductDetailClient({
  product,
  whatsappNumber,
  relatedProducts,
}: ProductDetailClientProps) {
  const sizesList = product.sizes && product.sizes.length > 0 ? product.sizes : ['38', '40', '42', '44'];
  const rawImages = (product.product_images || []).sort((a, b) => a.display_order - b.display_order);

  const images = rawImages.length > 0
    ? rawImages.map((i) => i.storage_path)
    : [
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1200&auto=format&fit=crop',
      ];

  const fitLabels: Record<string, string> = {
    '38': 'Slim Fit (Chest 38")',
    '40': 'Tailored Fit (Chest 40")',
    '42': 'Regular Fit (Chest 42")',
    '44': 'Classic Fit (Chest 44")',
    '46': 'Comfort Fit (Chest 46")',
  };

  const [selectedSize, setSelectedSize] = useState<string>(sizesList[0] || '38');
  const [selectedImage, setSelectedImage] = useState<string>(images[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifyContact, setNotifyContact] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);
  const [isLoggingEnquiry, setIsLoggingEnquiry] = useState(false);

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

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
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
    setIsLoggingEnquiry(true);

    const waUrl = buildProductWhatsAppUrl({
      whatsappNumber,
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
          message: `Inquired via WhatsApp for ${product.name} (Size: ${selectedSize})`,
        }),
      });
    } catch (e) {
      console.error('Failed to log WhatsApp enquiry:', e);
    } finally {
      setIsLoggingEnquiry(false);
      window.open(waUrl, '_blank');
    }
  };

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyContact.trim()) return;

    try {
      await fetchApi('/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          source: 'stock_notify',
          product_id: product.id,
          name: 'Stock Notification Request',
          phone: notifyContact.includes('@') ? undefined : notifyContact,
          email: notifyContact.includes('@') ? notifyContact : undefined,
          message: `Customer requested back-in-stock notification for ${product.name} (Size: ${selectedSize})`,
        }),
      });

      setNotifySubmitted(true);
      setTimeout(() => {
        setNotifyModalOpen(false);
        setNotifySubmitted(false);
        setNotifyContact('');
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <nav className="text-xs text-aura-muted flex items-center gap-2">
        <Link href="/" className="hover:text-aura-gold">Home</Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-aura-gold">Collections</Link>
        {product.collections && (
          <>
            <span>/</span>
            <Link href={`/collections/${product.collections.slug}`} className="hover:text-aura-gold">
              {product.collections.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-aura-cream font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          <div className="relative w-full aspect-[3/4] bg-aura-panel border border-aura-line rounded-xl overflow-hidden group shadow-lg">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              className="object-cover object-center transition-all duration-500"
            />
            {/* Dynamic Model Body Fit Badge */}
            <div className="absolute top-4 left-4 bg-aura-void/85 backdrop-blur-sm text-aura-gold border border-aura-line px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-md">
              <UserCheck className="w-4 h-4" />
              <span>{fitLabels[selectedSize] || `Size ${selectedSize} Fit`}</span>
            </div>

            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-4 right-4 bg-aura-void/80 backdrop-blur-sm text-aura-cream p-3 rounded-full border border-aura-line hover:text-aura-gold transition-colors cursor-pointer shadow-md"
              aria-label="Zoom Image"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          {images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedImage(imgUrl);
                    if (sizesList[i]) setSelectedSize(sizesList[i]);
                  }}
                  className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === imgUrl ? 'border-aura-gold scale-95 shadow-md ring-2 ring-aura-gold/40' : 'border-aura-line opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={imgUrl} alt={product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div>
            {product.collections?.name && (
              <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">
                {product.collections.name}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl text-aura-cream font-bold mt-1">{product.name}</h1>
            <p className="font-serif text-xl text-aura-gold font-bold mt-2">{formatPrice(product.price_label)}</p>
          </div>

          {product.fabric && (
            <div className="p-4 bg-aura-panel border border-aura-line rounded-lg space-y-1 shadow-sm">
              <span className="text-[11px] text-aura-muted uppercase tracking-wider font-bold">Fabric & Craftsmanship:</span>
              <p className="text-xs text-aura-cream font-medium">{product.fabric}</p>
            </div>
          )}

          {product.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-sans tracking-wider text-aura-muted uppercase font-bold">Garment Description</h4>
              <p className="text-xs text-aura-cream/90 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {/* Size Selector with Body Fit Switch */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans tracking-wider text-aura-gold uppercase font-bold flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" /> Select Size for Model Fit
              </span>
              <span className="text-[11px] text-aura-muted">Click size to update model body view</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {sizesList.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSizeSelect(s)}
                  className={`px-5 py-2.5 rounded text-xs font-bold border transition-all cursor-pointer ${
                    selectedSize === s
                      ? 'bg-aura-gold text-[#0A0A0C] border-aura-gold shadow-md ring-2 ring-aura-gold/40 scale-105'
                      : 'bg-aura-panel text-aura-cream border-aura-line hover:border-aura-gold'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 border-t border-aura-line">
            {product.in_stock ? (
              <MagneticButton className="w-full sm:w-auto flex-1">
                <button
                  onClick={handleWhatsAppEnquiry}
                  disabled={isLoggingEnquiry}
                  className="w-full bg-aura-gold text-[#0A0A0C] font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded hover:bg-aura-gold-soft transition-all shadow-[0_0_20px_rgba(212,160,42,0.3)] inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" /> Enquire Size {selectedSize} on WhatsApp
                </button>
              </MagneticButton>
            ) : (
              <button
                onClick={() => setNotifyModalOpen(true)}
                className="w-full sm:w-auto flex-1 bg-aura-elevated text-aura-cream border border-aura-line font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded hover:bg-aura-gold hover:text-[#0A0A0C] transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Bell className="w-4 h-4" /> Notify Me When Available
              </button>
            )}

            <button
              onClick={toggleWishlist}
              className={`p-4 rounded border transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-aura-gold/15 border-aura-gold text-aura-gold'
                  : 'bg-aura-panel border-aura-line text-aura-cream hover:text-aura-gold'
              }`}
              aria-label="Wishlist Toggle"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-aura-gold' : ''}`} />
            </button>
          </div>

          <div className="p-4 bg-aura-panel border border-aura-line rounded-xl space-y-2 text-xs text-aura-muted shadow-sm">
            <p className="flex items-center gap-2 text-aura-cream">
              <ShieldCheck className="w-4 h-4 text-aura-gold" />
              <span>Authentic Master Tailoring & Premium Fabrics</span>
            </p>
            <p className="flex items-center gap-2 text-aura-cream">
              <MapPin className="w-4 h-4 text-aura-gold" />
              <span>Available for trial at GIDC Dahegam Showroom</span>
            </p>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-aura-void/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-aura-cream hover:text-aura-gold p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image src={selectedImage} alt={product.name} fill className="object-contain" />
          </div>
        </div>
      )}

      {notifyModalOpen && (
        <div className="fixed inset-0 z-50 bg-aura-void/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-aura-panel border border-aura-line rounded-xl p-6 space-y-4 relative shadow-2xl">
            <button onClick={() => setNotifyModalOpen(false)} className="absolute top-4 right-4 text-aura-muted">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl text-aura-cream font-bold">Notify Me</h3>
            <p className="text-xs text-aura-muted">
              Enter your email or phone number. We will contact you as soon as <strong>{product.name}</strong> is back in stock at Dahegam.
            </p>

            {notifySubmitted ? (
              <div className="py-6 text-center text-aura-gold space-y-2">
                <CheckCircle className="w-8 h-8 text-aura-gold mx-auto" />
                <p className="text-xs font-bold">Request received! We will alert you upon restocking.</p>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Email or Phone Number"
                  value={notifyContact}
                  onChange={(e) => setNotifyContact(e.target.value)}
                  required
                  className="w-full bg-aura-elevated border border-aura-line text-aura-cream px-4 py-3 rounded text-xs focus:outline-none focus:border-aura-gold"
                />
                <button
                  type="submit"
                  className="w-full bg-aura-gold text-[#0A0A0C] font-bold text-xs uppercase tracking-widest py-3 rounded hover:bg-aura-gold-soft transition-colors cursor-pointer shadow-md"
                >
                  Submit Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-8 border-t border-aura-line">
          <div>
            <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">RECOMMENDED</span>
            <h2 className="font-serif text-2xl font-bold text-aura-cream">Similar Luxury Ensembles</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
