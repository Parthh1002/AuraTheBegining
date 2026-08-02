'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, X } from 'lucide-react';
import InstagramIcon from '@/components/ui/InstagramIcon';

interface GalleryItem {
  id: string;
  storage_path: string;
  caption?: string | null;
  instagram_url?: string | null;
}

export default function LookbookClient({ galleryItems }: { galleryItems: GalleryItem[] }) {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">AURA STORIES</span>
        <h1 className="font-serif text-4xl sm:text-5xl text-aura-cream font-bold">The Editorial Lookbook</h1>
        <p className="text-xs text-aura-muted leading-relaxed">
          A visual chronicle of our signature groom collections, bespoke tuxedo sessions, and artisanal bandhgalas.
        </p>
      </div>

      {galleryItems.length > 0 ? (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="relative group rounded-xl overflow-hidden border border-aura-line bg-aura-panel cursor-pointer break-inside-avoid shadow-xl hover:border-aura-gold transition-all duration-300"
            >
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={item.storage_path}
                  alt={item.caption || 'AURA Story'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity p-6 flex flex-col justify-end">
                  <p className="font-serif text-lg text-white font-bold">{item.caption}</p>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-aura-gold font-bold">
                      <ZoomIn className="w-3.5 h-3.5" /> View Photo
                    </span>
                    {item.instagram_url && (
                      <a
                        href={item.instagram_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-gray-300 hover:text-aura-gold flex items-center gap-1"
                      >
                        <InstagramIcon className="w-3.5 h-3.5" /> Instagram
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-aura-muted text-xs">
          New editorial lookbook photos uploading soon.
        </div>
      )}

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-aura-void/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActiveItem(null)}
            className="absolute top-6 right-6 text-aura-cream hover:text-aura-gold p-2 cursor-pointer"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col items-center">
            <div className="relative w-full h-[70vh]">
              <Image src={activeItem.storage_path} alt={activeItem.caption || 'AURA Lookbook'} fill className="object-contain" />
            </div>
            {activeItem.caption && (
              <p className="font-serif text-lg text-aura-cream mt-4 text-center">{activeItem.caption}</p>
            )}
            {activeItem.instagram_url && (
              <a
                href={activeItem.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs text-aura-gold hover:underline mt-2"
              >
                <InstagramIcon className="w-4 h-4" /> View Post on Instagram
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
