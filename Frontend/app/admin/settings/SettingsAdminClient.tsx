'use client';

import { useState, useEffect } from 'react';
import { Save, Check, Loader2, Upload } from 'lucide-react';
import { fetchApi, uploadFilesApi } from '@/lib/api';

export default function SettingsAdminClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const [formData, setFormData] = useState({
    store_phone: '+91 98765 43210',
    whatsapp_number: '919876543210',
    store_address: 'Shop no 2, plot, AURA (The Beginning), Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305',
    hero_headline: 'Elegance Emerges from Darkness',
    hero_subtext: 'Discover bespoke tailoring, royal silk sherwanis, obsidian bandhgalas, and modern luxury apparel.',
    hero_media_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1920&auto=format&fit=crop',
    instagram_url: 'https://instagram.com',
    store_hours: {
      monday: { open: '10:00 AM', close: '09:00 PM', closed: false },
      tuesday: { open: '10:00 AM', close: '09:00 PM', closed: false },
      wednesday: { open: '10:00 AM', close: '09:00 PM', closed: false },
      thursday: { open: '10:00 AM', close: '09:00 PM', closed: false },
      friday: { open: '10:00 AM', close: '09:00 PM', closed: false },
      saturday: { open: '10:00 AM', close: '09:30 PM', closed: false },
      sunday: { open: '10:30 AM', close: '09:00 PM', closed: false },
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await fetchApi('/settings');
        if (data) {
          setFormData({
            store_phone: data.store_phone || '+91 98765 43210',
            whatsapp_number: data.whatsapp_number || '919876543210',
            store_address: data.store_address || '',
            hero_headline: data.hero_headline || '',
            hero_subtext: data.hero_subtext || '',
            hero_media_url: data.hero_media_url || '',
            instagram_url: data.instagram_url || '',
            store_hours: data.store_hours || formData.store_hours,
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls = await uploadFilesApi([files[0]]);
      if (urls[0]) {
        setFormData((prev) => ({ ...prev, hero_media_url: urls[0] }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      await fetchApi('/settings', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-xs text-aura-subink">Loading settings...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b border-aura-gold/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-aura-ink">Store Settings</h1>
          <p className="text-xs text-aura-subink mt-1">Configure contact numbers, Dahegam address, store hours, and hero banner.</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/30 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Site settings saved successfully to PostgreSQL!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
        <div className="bg-aura-surface border border-aura-gold/20 rounded-xl p-6 space-y-4 shadow-xl">
          <h3 className="font-serif text-lg font-bold text-aura-ink border-b border-aura-gold/10 pb-2">
            Store Contact & Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-aura-ink">Store Phone</label>
              <input
                type="text"
                value={formData.store_phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, store_phone: e.target.value }))}
                className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink p-3 rounded"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-aura-ink">WhatsApp Number (digits only)</label>
              <input
                type="text"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp_number: e.target.value }))}
                className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink p-3 rounded font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-aura-ink">Store Address</label>
            <textarea
              rows={2}
              value={formData.store_address}
              onChange={(e) => setFormData((prev) => ({ ...prev, store_address: e.target.value }))}
              className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink p-3 rounded"
            />
          </div>
        </div>

        <div className="bg-aura-surface border border-aura-gold/20 rounded-xl p-6 space-y-4 shadow-xl">
          <h3 className="font-serif text-lg font-bold text-aura-ink border-b border-aura-gold/10 pb-2">
            Homepage Hero Configuration
          </h3>

          <div className="space-y-1">
            <label className="font-semibold text-aura-ink">Hero Main Headline</label>
            <input
              type="text"
              value={formData.hero_headline}
              onChange={(e) => setFormData((prev) => ({ ...prev, hero_headline: e.target.value }))}
              className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink p-3 rounded font-serif text-base"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-aura-ink">Hero Subtext</label>
            <textarea
              rows={2}
              value={formData.hero_subtext}
              onChange={(e) => setFormData((prev) => ({ ...prev, hero_subtext: e.target.value }))}
              className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink p-3 rounded"
            />
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-aura-ink block">Hero Media Image URL / File Upload</label>
            <input
              type="text"
              value={formData.hero_media_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, hero_media_url: e.target.value }))}
              className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink p-3 rounded font-mono"
            />
            <div className="relative border border-dashed border-aura-gold/30 p-3 rounded text-center bg-aura-elevated/50">
              <input type="file" accept="image/*" onChange={handleHeroFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <span className="text-[11px] text-aura-gold-soft font-bold">
                {uploading ? 'Uploading media...' : 'Upload New Hero Background File'}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-aura-gold text-aura-bg font-bold text-xs uppercase tracking-widest px-8 py-4 rounded hover:bg-aura-gold-soft transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving Settings...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Settings to PostgreSQL
            </>
          )}
        </button>
      </form>
    </div>
  );
}
