import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Scissors, Sparkles, MapPin, Play, Heart, MessageCircle, ExternalLink, Phone, MessageSquare } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';

export const revalidate = 60;

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default async function AboutPage() {
  let settings: any = null;
  try {
    settings = await fetchApi('/settings');
  } catch (err) {
    console.warn('Could not fetch settings:', err);
  }

  const instagramHandle = '@aura_the_beginning';
  const instagramUrl = settings?.instagram_url || 'https://instagram.com';
  const whatsappNum = settings?.whatsapp_number || '918866077505';
  const storeAddress = settings?.store_address || "Shop no 2, plot, Akshay Khanna's Store for only Men's, Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305";
  const whatsappUrl = buildGeneralWhatsAppUrl(whatsappNum);
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeAddress)}`;

  // Simulated Live Instagram Feed (Reels & Posts preview)
  const instagramFeed = [
    {
      id: 'ig-1',
      type: 'reel',
      title: 'Crafting Royal Zari Sherwanis for 2026 Grooms',
      likes: '2.4k',
      comments: '142',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
      url: instagramUrl,
    },
    {
      id: 'ig-2',
      type: 'post',
      title: 'Midnight Obsidian Velvet Bandhgala Suit — Detailed Stitching',
      likes: '1.8k',
      comments: '98',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      url: instagramUrl,
    },
    {
      id: 'ig-3',
      type: 'reel',
      title: 'Bespoke Tuxedo Fitting Session at Dahegam Boutique',
      likes: '3.1k',
      comments: '210',
      image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
      url: instagramUrl,
    },
    {
      id: 'ig-4',
      type: 'post',
      title: 'Chanderi Silk Kurta Set for Wedding Sangeet Nights',
      likes: '1.5k',
      comments: '64',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
      url: instagramUrl,
    },
    {
      id: 'ig-5',
      type: 'reel',
      title: 'Behind the Scenes: Hand-stitched Zari Embroidery',
      likes: '4.2k',
      comments: '315',
      image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop',
      url: instagramUrl,
    },
    {
      id: 'ig-6',
      type: 'post',
      title: 'European Linen Casual Summer Suits in Showroom',
      likes: '1.1k',
      comments: '45',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      url: instagramUrl,
    },
  ];

  // Showroom Photos
  const showroomPhotos = [
    {
      title: 'Main VIP Fitting Lounge & Velvet Displays',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
      caption: 'Luxury seating and personalized consultation area for grooms and families.',
    },
    {
      title: 'Master Tailor Swatch Bench & Fabrics',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      caption: 'Over 500+ imported Italian wool, velvet, and raw silk swatches.',
    },
    {
      title: 'Royal Groom Sherwani Gallery',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
      caption: 'Hand-embroidered designer groom ensembles on display.',
    },
    {
      title: 'Boutique Storefront Entrance at GIDC Dahegam',
      image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
      caption: 'Located opposite Balmukund Prime in GIDC Dahegam.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HEADER BANNER & BRAND VISION */}
      <section className="relative py-24 bg-aura-panel border-b border-aura-line overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,160,42,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aura-elevated border border-aura-line text-xs font-sans tracking-[0.25em] text-aura-gold uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5" /> DAHEGAM&apos;S PREMIER LUXURY BOUTIQUE
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-aura-cream">Light Emerging from Darkness</h1>
          <p className="text-sm text-aura-muted leading-relaxed max-w-2xl mx-auto font-medium">
            &ldquo;Akshay Khanna's Store for only Men's&rdquo; was established with a singular vision: crafting bespoke royal menswear for grooms, gentlemen, and young men (20+) who appreciate fine tailoring, rich fabrics, and timeless dignity.
          </p>
        </div>
      </section>

      {/* 2. BRAND NARRATIVE & CRAFTSMANSHIP */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">OUR HERITAGE</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-aura-cream">Bespoke Tailoring & Luxury Apparel</h2>
            <p className="text-xs text-aura-muted leading-relaxed">
              Located in GIDC Dahegam, AURA brings an uncompromising commitment to men&apos;s fashion. We specialize in custom-tailored sherwanis, imperial velvet bandhgalas, double-breasted suits, tuxedos, and European linen apparel.
            </p>
            <p className="text-xs text-aura-muted leading-relaxed">
              Every creation starts with handpicked raw silk handlooms and Super 120s Italian wools, meticulously cut to individual body contours by our master artisans.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-aura-panel border border-aura-line rounded-lg space-y-1 shadow-sm">
                <Scissors className="w-5 h-5 text-aura-gold" />
                <h4 className="font-serif text-sm font-bold text-aura-cream">Precision Tailoring</h4>
                <p className="text-[11px] text-aura-muted">Custom shoulder contours, peak lapels, and hand-finished buttonholes.</p>
              </div>

              <div className="p-4 bg-aura-panel border border-aura-line rounded-lg space-y-1 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-aura-gold" />
                <h4 className="font-serif text-sm font-bold text-aura-cream">5.0★ Google Rating</h4>
                <p className="text-[11px] text-aura-muted">Consistently praised across Gujarat for personal groom hospitality.</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-aura-line shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
              alt="AURA Craftsmanship"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-aura-void via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* 3. BRAND VIDEO ADVERTISEMENT & FILM SECTION */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-16">
        <div className="bg-aura-panel border border-aura-line rounded-2xl p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-aura-line pb-6">
            <div>
              <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">BRAND ADVERTISEMENT & FILM</span>
              <h2 className="font-serif text-3xl font-bold text-aura-cream mt-1">Behind The Craft: AURA Commercial</h2>
            </div>
            <p className="text-xs text-aura-muted mt-2 md:mt-0 max-w-sm">
              Watch how our master artisans transform raw silk and velvet into royal wedding ensembles.
            </p>
          </div>

          {/* Video Player Container */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-aura-line bg-black shadow-2xl group">
            <Image
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600&auto=format&fit=crop"
              alt="AURA Brand Video Preview"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-center p-6 text-center">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-aura-gold/90 text-[#0A0A0C] flex items-center justify-center shadow-[0_0_30px_rgba(212,160,42,0.8)] hover:scale-110 transition-transform cursor-pointer mb-4"
                aria-label="Play Brand Video"
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
              </a>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">Akshay Khanna's Store for only Men's — Official Showcase Video</h3>
              <p className="text-xs text-gray-300 mt-1">Watch on Instagram & Store Lounge Screens</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REAL-TIME INSTAGRAM FEED & REELS SECTION */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-aura-line pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">
              <InstagramIcon className="w-4 h-4" /> OFFICIAL INSTAGRAM FEED
            </div>
            <h2 className="font-serif text-3xl font-bold text-aura-cream mt-1">Live Posts & Reels ({instagramHandle})</h2>
          </div>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-aura-gold text-[#0A0A0C] font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded hover:bg-aura-gold-soft transition-colors mt-4 md:mt-0 shadow-md"
          >
            Follow {instagramHandle} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instagramFeed.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="group relative bg-aura-panel border border-aura-line rounded-xl overflow-hidden shadow-lg hover:border-aura-gold transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-aura-elevated">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                  <span className="flex items-center gap-1 font-bold text-sm">
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-sm">
                    <MessageCircle className="w-5 h-5 fill-white text-white" /> {post.comments}
                  </span>
                </div>
                {post.type === 'reel' && (
                  <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-aura-gold text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full flex items-center gap-1 border border-aura-gold/40">
                    <Play className="w-3 h-3 fill-aura-gold" /> REEL
                  </span>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <p className="text-xs text-aura-cream font-medium line-clamp-2">{post.title}</p>
                <div className="flex items-center justify-between text-[11px] text-aura-gold font-bold pt-2 border-t border-aura-line">
                  <span>View on Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 5. BOUTIQUE SHOWROOM GALLERY & SHOP PHOTOS */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-16">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">PHYSICAL STORE GALLERY</span>
          <h2 className="font-serif text-3xl font-bold text-aura-cream">Our Dahegam Boutique Showroom</h2>
          <p className="text-xs text-aura-muted">Explore our fitting lounge, raw fabric racks, and bespoke consultation space.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {showroomPhotos.map((photo, idx) => (
            <div key={idx} className="bg-aura-panel border border-aura-line rounded-xl overflow-hidden shadow-lg group">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-1">
                <h3 className="font-serif text-lg font-bold text-aura-cream group-hover:text-aura-gold transition-colors">{photo.title}</h3>
                <p className="text-xs text-aura-muted">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FOUNDER DETAILS & LOCATION INFO CARD */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-16">
        <div className="bg-aura-panel border border-aura-line rounded-2xl p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">FOUNDER & MASTER ARTISANS</span>
            <h2 className="font-serif text-3xl font-bold text-aura-cream">Parth Patel & Master Tailors</h2>
            <p className="text-xs text-aura-muted leading-relaxed">
              Our founder Parth Patel created Akshay Khanna's Store for only Men's to give grooms and men in Dahegam and across Gujarat an international bespoke tailoring experience without compromising on authentic heritage craftsmanship.
            </p>

            <div className="space-y-2 text-xs pt-2 border-t border-aura-line">
              <p className="flex items-start gap-2 text-aura-cream">
                <MapPin className="w-4 h-4 text-aura-gold shrink-0 mt-0.5" />
                <span>{storeAddress}</span>
              </p>
              <p className="flex items-center gap-2 text-aura-cream">
                <Phone className="w-4 h-4 text-aura-gold shrink-0" />
                <span>Phone / WhatsApp: +91 88660 77505</span>
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
                <MessageSquare className="w-4 h-4 text-aura-gold" /> Consult on WhatsApp
              </a>
            </div>
          </div>

          <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden border border-aura-line shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
              alt="AURA Showroom Founder Lounge"
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <div>
                <p className="font-serif text-lg font-bold text-white">AURA Boutique Lounge</p>
                <p className="text-xs text-aura-gold font-bold">GIDC Dahegam • Boutique Showroom</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
