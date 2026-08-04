'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle, Loader2, MessageSquare, ExternalLink } from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';
import { fetchApi } from '@/lib/api';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import ScrollReveal from '@/components/animation/ScrollReveal';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface VisitUsClientProps {
  storeAddress: string;
  storePhone: string;
  whatsappNumber: string;
  storeHours: Record<string, { open: string; close: string; closed: boolean }>;
}

export default function VisitUsClient({
  storeAddress,
  storePhone,
  whatsappNumber,
  storeHours,
}: VisitUsClientProps) {
  const [todayName, setTodayName] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formFeedback, setFormFeedback] = useState<string>('');

  useEffect(() => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[new Date().getDay()];
    setTodayName(currentDay);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setFormStatus('loading');
    setFormFeedback('');

    try {
      await fetchApi('/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      setFormStatus('success');
      setFormFeedback('Thank you for contacting AURA! Our team will get back to you shortly.');
      reset();
    } catch (err: any) {
      setFormStatus('error');
      setFormFeedback(err.message || 'Submission failed. Please try again.');
    }
  };

  const whatsappUrl = buildGeneralWhatsAppUrl(whatsappNumber);
  // Exact Google Maps Pinpoint Highlight for Akshay Khanna's Store for only Men's (23.16286593494573, 72.80827951499718)
  const mapEmbedUrl = `https://maps.google.com/maps?q=AURA%20(The%20beginning)%20MENS%20WEAR,%20Dahegam,%20Gujarat&t=k&hl=en&z=20&output=embed`;
  const directionsUrl = `https://www.google.com/maps/place/AURA+(The+beginning)+MENS+WEAR/@23.16286593494573,72.80827951499718,19z`;

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-12 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">BOUTIQUE STORE & LOCATION</span>
        <h1 className="font-serif text-4xl sm:text-5xl text-aura-cream font-bold">Visit Akshay Khanna's Store for only Men's</h1>
        <p className="text-xs text-aura-muted leading-relaxed">
          Experience our complete catalog, custom fits, and personal styling sessions at GIDC Dahegam.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ScrollReveal direction="up" delay={0.1} className="lg:col-span-2 space-y-8">
          <div className="bg-aura-panel border border-aura-gold/30 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(212,160,42,0.15)] h-[500px] relative group transition-all duration-500 hover:shadow-[0_0_50px_rgba(212,160,42,0.25)]">
            {/* Fully Interactive Map with Prominent Native Pin */}
            <iframe
              title="Akshay Khanna's Store for only Men's Exact Location"
              src="https://maps.google.com/maps?q=23.16286593494573,72.80827951499718&t=k&hl=en&z=20&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'contrast(1.1) saturate(1.2)' }}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 bg-aura-elevated border border-aura-line rounded-xl p-6 shadow-md">
            <div className="flex-1 space-y-2">
              <h3 className="font-serif text-lg font-bold text-aura-cream flex items-center gap-2">
                <MapPin className="w-4 h-4 text-aura-gold" /> Boutique Address
              </h3>
              <p className="text-xs text-aura-muted leading-relaxed">
                {storeAddress}
              </p>
            </div>
            <div className="sm:text-right space-y-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-aura-gold hover:underline font-bold inline-flex items-center gap-1 text-xs"
              >
                Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2} className="space-y-8">
          <div className="bg-aura-panel border border-aura-line rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-aura-line pb-4">
              <h3 className="font-serif text-2xl font-bold text-aura-cream flex items-center gap-2">
                <Clock className="w-5 h-5 text-aura-gold" /> Store Hours
              </h3>
              <span className="text-[10px] uppercase tracking-widest text-aura-gold font-bold">GIDC DAHEGAM</span>
            </div>

            <div className="space-y-3 divide-y divide-aura-line">
              {Object.entries(storeHours).map(([dayKey, schedule]) => {
                const isToday = dayKey.toLowerCase() === todayName.toLowerCase();
                const dayLabel = dayKey.charAt(0).toUpperCase() + dayKey.slice(1);

                return (
                  <div
                    key={dayKey}
                    className={`pt-2.5 flex items-center justify-between text-xs transition-colors ${
                      isToday ? 'text-aura-gold font-bold bg-aura-gold/10 p-2 rounded -mx-2' : 'text-aura-muted'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isToday && <span className="w-2 h-2 rounded-full bg-aura-gold animate-ping" />}
                      {dayLabel} {isToday && '(Today)'}
                    </span>
                    <span>
                      {schedule.closed ? 'Closed' : `${schedule.open} – ${schedule.close}`}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-aura-gold text-[#0A0A0C] font-bold text-xs uppercase tracking-widest py-3.5 rounded text-center hover:bg-aura-gold-soft transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,160,42,0.3)]"
              >
                <MapPin className="w-4 h-4" /> Get Live Directions
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-aura-elevated text-aura-cream border border-aura-line font-bold text-xs uppercase tracking-widest py-3.5 rounded text-center hover:border-aura-gold hover:text-aura-gold transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <WhatsAppIcon className="w-5 h-5 text-[#25D366]" /> Instant WhatsApp Consultation
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal direction="up" delay={0.1}>
        <div className="max-w-3xl mx-auto bg-aura-panel border border-aura-line rounded-2xl p-8 sm:p-12 space-y-6 shadow-2xl">
          <div className="border-b border-aura-line pb-4 space-y-1">
            <span className="text-xs font-sans tracking-[0.2em] text-aura-gold uppercase font-bold">DIRECT ENQUIRY</span>
            <h2 className="font-serif text-3xl font-bold text-aura-cream">Get in Touch</h2>
            <p className="text-xs text-aura-muted">Submit your bespoke request or inquiry. Our team responds within 24 hours.</p>
          </div>

          {formStatus === 'success' && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500/30 rounded-lg text-emerald-200 text-xs flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{formFeedback}</span>
            </div>
          )}

          {formStatus === 'error' && (
            <div className="p-4 bg-red-950/80 border border-red-500/30 rounded-lg text-red-200 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{formFeedback}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-cream">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Shah"
                  {...register('name')}
                  className="w-full bg-aura-elevated border border-aura-line text-aura-cream px-4 py-3 rounded text-xs focus:outline-none focus:border-aura-gold"
                />
                {errors.name && <p className="text-[11px] text-red-400">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-aura-cream">Phone Number *</label>
                <input
                  type="text"
                  placeholder="+91 88660 77505"
                  {...register('phone')}
                  className="w-full bg-aura-elevated border border-aura-line text-aura-cream px-4 py-3 rounded text-xs focus:outline-none focus:border-aura-gold"
                />
                {errors.phone && <p className="text-[11px] text-red-400">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-cream">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                className="w-full bg-aura-elevated border border-aura-line text-aura-cream px-4 py-3 rounded text-xs focus:outline-none focus:border-aura-gold"
              />
              {errors.email && <p className="text-[11px] text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-aura-cream">Your Inquiry Message *</label>
              <textarea
                rows={4}
                placeholder="Tell us about your wedding date, garment preferences, custom sizing, or trial booking request..."
                {...register('message')}
                className="w-full bg-aura-elevated border border-aura-line text-aura-cream p-4 rounded text-xs focus:outline-none focus:border-aura-gold"
              />
              {errors.message && <p className="text-[11px] text-red-400">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={formStatus === 'loading'}
              className="w-full bg-aura-gold text-[#0A0A0C] font-bold text-xs uppercase tracking-widest py-4 rounded hover:bg-aura-gold-soft transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              {formStatus === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" /> Submit Inquiry
                </>
              )}
            </button>
          </form>
        </div>
      </ScrollReveal>
    </div>
  );
}
