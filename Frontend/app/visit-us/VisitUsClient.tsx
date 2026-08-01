'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle, Loader2, MessageSquare, ExternalLink } from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';
import { fetchApi } from '@/lib/api';

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
  // Exact Google Maps Pinpoint Highlight for AURA (The beginning) MENS WEAR (23.16286593494573, 72.80827951499718)
  const mapEmbedUrl = `https://maps.google.com/maps?q=23.16286593494573,72.80827951499718&hl=en&z=19&output=embed`;
  const directionsUrl = `https://www.google.com/maps/place/AURA+(The+beginning)+MENS+WEAR/@23.16286593494573,72.80827951499718,19z`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-sans tracking-[0.3em] text-aura-gold uppercase font-bold">BOUTIQUE STORE & LOCATION</span>
        <h1 className="font-serif text-4xl sm:text-5xl text-aura-cream font-bold">Visit AURA (The Beginning)</h1>
        <p className="text-xs text-aura-muted leading-relaxed">
          Experience our complete catalog, custom fits, and personal styling sessions at GIDC Dahegam.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          <div className="relative w-full h-[450px] rounded-xl overflow-hidden border border-aura-line shadow-2xl group">
            <iframe
              title="AURA Boutique Google Map Location"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="p-5 bg-aura-panel border border-aura-line rounded-xl space-y-3 text-xs shadow-md">
            <p className="flex items-start gap-2 text-aura-cream">
              <MapPin className="w-4 h-4 text-aura-gold shrink-0 mt-0.5" />
              <span><strong>Exact Address:</strong> {storeAddress}</span>
            </p>
            <p className="flex items-center gap-2 text-aura-cream">
              <Phone className="w-4 h-4 text-aura-gold shrink-0" />
              <span><strong>Store Phone:</strong> {storePhone}</span>
            </p>

            <div className="pt-2 border-t border-aura-line flex items-center justify-between">
              <span className="text-[10px] text-aura-muted uppercase tracking-widest font-bold">GPS Coordinates: 23.162866, 72.808280</span>
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
        </div>

        <div className="space-y-8">
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
                <MessageSquare className="w-4 h-4 text-aura-gold" /> Instant WhatsApp Consultation
              </a>
            </div>
          </div>
        </div>
      </div>

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
                placeholder="+91 98765 43210"
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
    </div>
  );
}
