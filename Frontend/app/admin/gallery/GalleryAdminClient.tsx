'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2, X, Check, Loader2, Upload } from 'lucide-react';
import { fetchApi, uploadFilesApi } from '@/lib/api';

export default function GalleryAdminClient() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ storage_path: '', caption: '', instagram_url: '' });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/gallery');
      setItems(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const urls = await uploadFilesApi([files[0]]);
      if (urls[0]) {
        setFormData((prev) => ({ ...prev, storage_path: urls[0] }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetchApi('/gallery', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setModalOpen(false);
      setFormData({ storage_path: '', caption: '', instagram_url: '' });
      fetchGallery();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete lookbook photo?')) return;
    try {
      await fetchApi(`/gallery/${id}`, { method: 'DELETE' });
      fetchGallery();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4A02A]/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#F5F1E8]">Lookbook & Editorial Gallery</h1>
          <p className="text-xs text-[#9C9894] mt-1">Manage photoshoot highlights and Instagram editorial photos.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#D4A02A] text-[#0A0A0C] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-[#E8C168] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" /> Upload Lookbook Photo
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <p className="text-xs text-[#9C9894]">Loading photos...</p>
        ) : items.map((item) => (
          <div key={item.id} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#D4A02A]/20 group">
            <Image src={item.storage_path} alt={item.caption || 'AURA'} fill className="object-cover" />
            <div className="absolute inset-0 bg-[#0A0A0C]/80 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
              <p className="text-xs font-serif text-[#F5F1E8] font-bold">{item.caption}</p>
              <button
                onClick={() => handleDelete(item.id)}
                className="self-end p-2 bg-red-950/80 text-red-300 rounded border border-red-500/30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0C]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#151517] border border-[#D4A02A]/30 rounded-2xl p-6 space-y-6 relative shadow-2xl">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-[#9C9894]">
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#F5F1E8]">Add Lookbook Item</h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#F5F1E8]">Caption</label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData((prev) => ({ ...prev, caption: e.target.value }))}
                  placeholder="e.g. Royal Silk Sherwani Editorial 2026"
                  className="w-full bg-[#1D1D20] border border-[#D4A02A]/20 text-[#F5F1E8] p-3 rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#F5F1E8]">Instagram Link (Optional)</label>
                <input
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, instagram_url: e.target.value }))}
                  placeholder="https://instagram.com/p/..."
                  className="w-full bg-[#1D1D20] border border-[#D4A02A]/20 text-[#F5F1E8] p-3 rounded"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-[#F5F1E8] block">Image URL or File Upload *</label>
                <input
                  type="text"
                  required
                  value={formData.storage_path}
                  onChange={(e) => setFormData((prev) => ({ ...prev, storage_path: e.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-[#1D1D20] border border-[#D4A02A]/20 text-[#F5F1E8] p-3 rounded"
                />
                <div className="relative border border-dashed border-[#D4A02A]/30 p-4 rounded text-center bg-[#1D1D20]/50">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <Upload className="w-5 h-5 text-[#D4A02A] mx-auto mb-1" />
                  <span className="text-[11px] text-[#E8C168] font-bold">
                    {uploading ? 'Uploading image...' : 'Upload Image File'}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#D4A02A] text-[#0A0A0C] font-bold text-xs uppercase tracking-widest py-3.5 rounded hover:bg-[#E8C168] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-4"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save Lookbook Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
