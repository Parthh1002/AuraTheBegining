'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Plus } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import AuraParticles from '@/components/animation/AuraParticles';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    // Fetch FAQs from API (mocked locally if DB is down)
    fetchApi('/faqs')
      .then((data) => setFaqs(data.faqs || []))
      .catch((err) => console.error('Failed to load FAQs:', err));
  }, []);

  const toggleFAQ = (id: string) => {
    const isOpening = openId !== id;
    const previousId = openId;
    setOpenId(isOpening ? id : null);

    // Animate closing of previous
    if (previousId && contentRefs.current[previousId]) {
      gsap.to(contentRefs.current[previousId], {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }

    // Animate opening of new
    if (isOpening && contentRefs.current[id]) {
      gsap.fromTo(
        contentRefs.current[id],
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  };

  return (
    <section className="relative w-full bg-[#0A0A0C] overflow-hidden section-gap-xl text-[#F5F1E8]">
      {/* Dark band signature particles */}
      <AuraParticles variant="dark" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12">
        <div className="text-center mb-16">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#D4A02A] mb-4">
            Client Services
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F5F1E8]">
            Frequently Asked
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`border-b border-white/10 overflow-hidden transition-colors duration-300 ${
                  isOpen ? 'bg-[#151517] rounded-t-lg' : 'hover:bg-[#151517]/50'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left py-6 px-4 sm:px-6 flex items-center justify-between focus:outline-none group cursor-pointer"
                >
                  <h3
                    className={`font-serif text-lg sm:text-xl transition-colors ${
                      isOpen ? 'text-[#E8C168]' : 'text-[#F5F1E8] group-hover:text-[#E8C168]'
                    }`}
                  >
                    {faq.question}
                  </h3>
                  <div
                    className="flex-shrink-0 ml-4 text-[#D4A02A] transition-transform duration-300"
                    style={{ transform: isOpen ? 'rotate(135deg)' : 'rotate(0deg)' }}
                  >
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </button>
                <div
                  ref={(el) => {
                    contentRefs.current[faq.id] = el;
                  }}
                  className="px-4 sm:px-6 h-0 opacity-0 overflow-hidden"
                >
                  <div className="pb-8 text-sm sm:text-base text-[#9C9894] leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
          
          {faqs.length === 0 && (
            <div className="text-center text-[#9C9894] py-12">
              <p>Loading client services information...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
