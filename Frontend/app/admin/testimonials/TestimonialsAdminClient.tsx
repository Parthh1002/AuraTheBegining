'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Star, X, Check, Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function TestimonialsAdminClient() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ customer_name: '', rating: 5, review_text: '' });
  const [saving, setSaving] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/testimonials');
      setItems(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ customer_name: '', rating: 5, review_text: '' });
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setFormData({ customer_name: item.customer_name, rating: item.rating, review_text: item.review_text });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await fetchApi(`/testimonials/${editingId}`, { method: 'PUT', body: JSON.stringify(formData) });
      } else {
        await fetchApi('/testimonials', { method: 'POST', body: JSON.stringify(formData) });
      }
      setModalOpen(false);
      fetchReviews();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete customer review?')) return;
    try {
      await fetchApi(`/testimonials/${id}`, { method: 'DELETE' });
      fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4A02A]/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#F5F1E8]">Customer Testimonials</h1>
          <p className="text-xs text-[#9C9894] mt-1">Manage 5.0★ Google reviews and clientele feedback.</p>
        </div>

        <button
          onClick={openNewModal}
          className="bg-[#D4A02A] text-[#0A0A0C] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-[#E8C168] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-xs text-[#9C9894]">Loading reviews...</p>
        ) : items.map((item) => (
          <div key={item.id} className="bg-[#151517] border border-[#D4A02A]/20 rounded-xl p-5 space-y-3 flex flex-col justify-between shadow-xl">
            <div className="space-y-2">
              <div className="flex text-[#D4A02A]">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D4A02A]" />
                ))}
              </div>
              <p className="text-xs text-[#F5F1E8] italic leading-relaxed">&ldquo;{item.review_text}&rdquo;</p>
            </div>

            <div className="pt-3 border-t border-[#D4A02A]/10 flex items-center justify-between">
              <span className="font-serif text-sm font-bold text-[#E8C168]">{item.customer_name}</span>
              <div className="space-x-2">
                <button onClick={() => openEditModal(item)} className="p-1.5 bg-[#1D1D20] text-[#F5F1E8] hover:text-[#D4A02A] rounded">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-[#1D1D20] text-red-400 hover:text-red-300 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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

            <h2 className="font-serif text-2xl font-bold text-[#F5F1E8]">
              {editingId ? 'Edit Review' : 'Add Testimonial'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#F5F1E8]">Client Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customer_name: e.target.value }))}
                  className="w-full bg-[#1D1D20] border border-[#D4A02A]/20 text-[#F5F1E8] p-3 rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#F5F1E8]">Rating (1 to 5) *</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                  className="w-full bg-[#1D1D20] border border-[#D4A02A]/20 text-[#F5F1E8] p-3 rounded"
                >
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★</option>
                  <option value={3}>3 Stars ★★★</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#F5F1E8]">Review Text *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.review_text}
                  onChange={(e) => setFormData((prev) => ({ ...prev, review_text: e.target.value }))}
                  className="w-full bg-[#1D1D20] border border-[#D4A02A]/20 text-[#F5F1E8] p-3 rounded"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#D4A02A] text-[#0A0A0C] font-bold text-xs uppercase tracking-widest py-3.5 rounded hover:bg-[#E8C168] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
