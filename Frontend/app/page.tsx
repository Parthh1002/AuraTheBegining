import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Phone, MessageSquare, Star, Clock, Sparkles } from 'lucide-react';

import { fetchApi } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import MagneticButton from '@/components/animation/MagneticButton';
import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';

export const revalidate = 60;

export default async function HomePage() {
  // 1. Fetch Site Settings
  let settings: any = null;
  try {
    settings = await fetchApi('/settings');
  } catch (err) {
    console.warn('Could not fetch settings:', err);
  }

  const heroHeadline = settings?.hero_headline || 'Elegance Emerges from Darkness';
  const heroSubtext = settings?.hero_subtext || 'Discover bespoke tailoring, royal silk sherwanis, obsidian bandhgalas, and modern luxury apparel.';
  const storeAddress = settings?.store_address || 'Shop no 2, plot, AURA (The Beginning), Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305';
  const whatsappNum = settings?.whatsapp_number || '919876543210';
  const heroMediaUrl = settings?.hero_media_url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1920&auto=format&fit=crop';

  // 2. Fetch New Arrivals
  let newArrivals: any[] = [];
  try {
    newArrivals = await fetchApi('/products?tag=new-arrival&limit=8');
  } catch (err) {
    console.warn('Could not fetch new arrivals:', err);
  }

  const formattedArrivals = (newArrivals || []).map((p: any) => {
    const primaryImg = p.product_images?.find((img: any) => img.is_primary)?.storage_path || p.product_images?.[0]?.storage_path;
    return {
      ...p,
      cover_image: primaryImg,
    };
  });

  // 3. Fetch Featured Collections
  let featuredCollections: any[] = [];
  try {
    const cols = await fetchApi('/collections');
    featuredCollections = (cols || []).filter((c: any) => c.is_featured);
  } catch (err) {
    console.warn('Could not fetch collections:', err);
  }

  // 4. Fetch Lookbook Teaser
  let galleryTeaser: any[] = [];
  try {
    const gallery = await fetchApi('/gallery');
    galleryTeaser = (gallery || []).slice(0, 6);
  } catch (err) {
    console.warn('Could not fetch gallery teaser:', err);
  }

  // 5. Fetch Testimonials
  let testimonials: any[] = [];
  try {
    testimonials = await fetchApi('/testimonials');
  } catch (err) {
    console.warn('Could not fetch testimonials:', err);
  }

  // Exact Google Maps Coordinates: 23.16286593494573, 72.80827951499718
  const directionsUrl = `https://www.google.com/maps/place/AURA+(The+beginning)+MENS+WEAR/@23.16286593494573,72.80827951499718,19z`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=23.16286593494573,72.80827951499718&hl=en&z=19&output=embed`;
  const whatsappUrl = buildGeneralWhatsAppUrl(whatsappNum);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION - Left-Aligned Editorial Text & Multi-Stop Transparency Mask */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-aura-line pt-16 sm:pt-0">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroMediaUrl}
            alt="AURA Hero"
            fill
            priority
            className="object-cover object-[75%_30%] sm:object-right transition-transform duration-1000 scale-105"
          />

          {/* 0% 15% 35% 65% 85% 100% Horizontal Gradient Mask */}
          <div
            className="absolute inset-0 z-10 pointer-events-none hidden sm:block"
            style={{
              background: 'linear-gradient(to right, var(--aura-bg-void) 0%, var(--aura-bg-void) 20%, var(--aura-bg-void) 40%, rgba(10, 10, 12, 0.65) 65%, rgba(10, 10, 12, 0.25) 85%, transparent 100%)',
            }}
          />

          {/* Mobile Linear Fallback */}
          <div
            className="absolute inset-0 z-10 pointer-events-none sm:hidden"
            style={{
              background: 'linear-gradient(to bottom, var(--aura-bg-void) 0%, var(--aura-bg-void) 45%, rgba(10, 10, 12, 0.75) 75%, transparent 100%)',
            }}
          />

          {/* Bottom Gradient Fade to Void */}
          <div className="absolute inset-x-0 bottom-0 h-32 z-10 bg-gradient-to-t from-aura-void to-transparent pointer-events-none" />

          {/* Ambient Gold Aura Glow */}
          <div className="absolute left-1/4 top-1/3 w-96 h-96 bg-[radial-gradient(circle,rgba(212,160,42,0.2)_0%,transparent_70%)] pointer-events-none z-10" />
        </div>

        {/* Hero Content - Left Aligned Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-0">
          <div className="max-w-2xl text-left space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aura-panel/90 border border-aura-line backdrop-blur-md text-xs font-sans tracking-[0.25em] text-aura-gold uppercase font-bold shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-aura-gold animate-pulse" /> DAHEGAM&apos;S PREMIER BOUTIQUE
            </div>

            {/* Main Headline with High Contrast Text */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-aura-cream leading-[1.1] drop-shadow-md">
              {heroHeadline}
            </h1>

            {/* Subtext */}
            <p className="font-sans text-sm sm:text-base text-aura-muted leading-relaxed max-w-xl font-medium">
              {heroSubtext}
            </p>

            {/* Ultra-Luxury Animated Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Primary Catalog Button */}
              <MagneticButton>
                <Link
                  href="/collections"
                  className="group relative bg-aura-gold text-[#0A0A0C] font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded overflow-hidden transition-all duration-300 hover:bg-aura-gold-soft hover:scale-105 shadow-[0_0_25px_rgba(212,160,42,0.4)] inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
              </MagneticButton>

              {/* Secondary WhatsApp Button */}
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="group relative bg-aura-panel text-aura-cream border border-aura-line font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded transition-all duration-300 hover:border-aura-gold hover:text-aura-gold hover:scale-105 inline-flex items-center justify-center gap-2 backdrop-blur-md shadow-lg overflow-hidden"
              >
                <MessageSquare className="w-4 h-4 text-aura-gold group-hover:rotate-12 transition-transform" />
                <span>Enquire on WhatsApp</span>
                <span className="absolute inset-0 bg-aura-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-aura-line pb-6">
          <div>
            <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">CURATED EXCLUSIVES</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-aura-cream font-bold mt-1">New Arrivals</h2>
          </div>
          <Link
            href="/collections"
            className="text-xs uppercase tracking-[0.2em] font-bold text-aura-gold hover:underline transition-all inline-flex items-center gap-1 mt-4 md:mt-0"
          >
            View All Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {formattedArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {formattedArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-aura-muted text-sm">
            New seasonal garments arriving soon. Explore our full collections.
          </div>
        )}
      </section>

      {/* 3. FEATURED COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">CATEGORY SELECTIONS</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-aura-cream font-bold">Featured Collections</h2>
          <p className="text-xs text-aura-muted">Tailored specifically for wedding galas, black-tie receptions, and refined daily luxury.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(featuredCollections || []).map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group relative h-96 rounded-xl overflow-hidden border border-aura-line hover:border-aura-gold transition-all duration-500 shadow-xl flex flex-col justify-end p-6"
            >
              <Image
                src={col.cover_image_url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop'}
                alt={col.name}
                fill
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="relative z-10 space-y-2">
                <h3 className="font-serif text-xl font-bold text-white group-hover:text-aura-gold transition-colors">
                  {col.name}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-2">{col.description}</p>
                <span className="inline-flex items-center gap-1 text-xs uppercase font-bold tracking-widest text-aura-gold pt-2">
                  Browse Collection <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. AURA STORIES LOOKBOOK TEASER */}
      <section className="bg-aura-panel border-y border-aura-line py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12">
            <div>
              <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">EDITORIAL GALLERY</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-aura-cream font-bold mt-1">AURA Stories</h2>
            </div>
            <Link
              href="/lookbook"
              className="text-xs uppercase tracking-[0.2em] font-bold text-aura-gold hover:underline transition-all inline-flex items-center gap-1 mt-4 md:mt-0"
            >
              Explore Full Lookbook <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {(galleryTeaser || []).map((item) => (
              <div key={item.id} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-aura-line group shadow-md">
                <Image
                  src={item.storage_path}
                  alt={item.caption || 'AURA Lookbook'}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                  <p className="text-[11px] font-serif text-white font-medium leading-tight">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1 text-aura-gold">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-aura-gold" />
            ))}
          </div>
          <h2 className="font-serif text-3xl font-bold text-aura-cream">5.0★ Rating on Google</h2>
          <p className="text-xs text-aura-muted">What our distinguished clientele in Dahegam and across Gujarat say about AURA.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(testimonials || []).map((t) => (
            <div
              key={t.id}
              className="bg-aura-panel border border-aura-line rounded-xl p-6 space-y-4 shadow-lg hover:border-aura-gold transition-colors"
            >
              <div className="flex text-aura-gold">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-aura-gold" />
                ))}
              </div>
              <p className="text-xs text-aura-cream/90 italic leading-relaxed">&ldquo;{t.review_text}&rdquo;</p>
              <div className="pt-2 border-t border-aura-line">
                <span className="font-serif text-sm font-bold text-aura-gold">{t.customer_name}</span>
                <span className="block text-[10px] text-aura-muted">Verified Google Review</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. STORE STRIP - Highlighted Exact Map Pin */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-aura-panel border border-aura-line rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-[radial-gradient(circle,rgba(212,160,42,0.1)_0%,transparent_70%)] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">BOUTIQUE STORE</span>
              <h2 className="font-serif text-3xl font-bold text-aura-cream">Visit AURA (The Beginning)</h2>
              <p className="text-xs text-aura-muted leading-relaxed">
                Step into our showroom at GIDC Dahegam to experience custom fittings, feel raw silk and wool swatches, and consult with our master tailors.
              </p>

              <div className="space-y-2 text-xs pt-2">
                <p className="flex items-start gap-2 text-aura-cream">
                  <MapPin className="w-4 h-4 text-aura-gold shrink-0 mt-0.5" />
                  <span>{storeAddress}</span>
                </p>
                <p className="flex items-center gap-2 text-aura-cream">
                  <Clock className="w-4 h-4 text-aura-gold shrink-0" />
                  <span>Open Daily: 10:00 AM – 09:00 PM</span>
                </p>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-aura-gold text-[#0A0A0C] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-aura-gold-soft transition-colors inline-flex items-center gap-2 shadow-md"
                >
                  <MapPin className="w-4 h-4" /> Get Directions
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-aura-elevated text-aura-cream border border-aura-line font-semibold text-xs uppercase tracking-widest px-6 py-3 rounded hover:border-aura-gold hover:text-aura-gold transition-colors inline-flex items-center gap-2 shadow-md"
                >
                  <Phone className="w-4 h-4 text-aura-gold" /> WhatsApp Consultation
                </a>
              </div>
            </div>

            <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-aura-line shadow-lg">
              <iframe
                title="AURA Exact Map Location"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
