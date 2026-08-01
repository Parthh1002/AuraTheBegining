'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit3, Trash2, X, Check, Loader2, Upload } from 'lucide-react';
import { fetchApi, uploadFilesApi } from '@/lib/api';
import { slugify } from '@/lib/utils';

export default function CollectionsAdminClient() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    cover_image_url: '',
    is_featured: true,
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadCollections = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/collections');
      setCollections(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '', cover_image_url: '', is_featured: true });
    setModalOpen(true);
  };

  const openEditModal = (col: any) => {
    setEditingId(col.id);
    setFormData({
      name: col.name,
      slug: col.slug,
      description: col.description || '',
      cover_image_url: col.cover_image_url || '',
      is_featured: col.is_featured,
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const urls = await uploadFilesApi([files[0]]);
      if (urls[0]) {
        setFormData((prev) => ({ ...prev, cover_image_url: urls[0] }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        await fetchApi(`/collections/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await fetchApi('/collections', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }

      setModalOpen(false);
      loadCollections();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    try {
      await fetchApi(`/collections/${id}`, { method: 'DELETE' });
      loadCollections();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4A02A]/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#F5F1E8]">Categories & Collections</h1>
          <p className="text-xs text-[#9C9894] mt-1">Organize suit styles, wedding ethnic apparel, and luxury lines.</p>
        </div>

        <button
          onClick={openNewModal}
          className="bg-[#D4A02A] text-[#0A0A0C] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-[#E8C168] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" /> Create Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-xs text-[#9C9894]">Loading categories...</p>
        ) : collections.map((col) => (
          <div
            key={col.id}
            className="bg-[#151517] border border-[#D4A02A]/20 rounded-xl overflow-hidden shadow-xl space-y-4 p-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative w-full aspect-[16/9] bg-[#1D1D20] rounded-lg overflow-hidden border border-[#D4A02A]/10">
                {col.cover_image_url && (
                  <Image src={col.cover_image_url} alt={col.name} fill className="object-cover" />
                )}
              </div>
              <h3 className="font-serif text-xl font-bold text-[#F5F1E8]">{col.name}</h3>
              <p className="text-xs text-[#9C9894] line-clamp-2">{col.description}</p>
            </div>

            <div className="pt-3 border-t border-[#D4A02A]/10 flex items-center justify-between">
              <span className="text-[10px] text-[#D4A02A] uppercase font-bold">
                {col.product_count || 0} Products
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => openEditModal(col)}
                  className="p-1.5 bg-[#1D1D20] text-[#F5F1E8] hover:text-[#D4A02A] rounded border border-[#D4A02A]/20"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(col.id)}
                  className="p-1.5 bg-[#1D1D20] text-red-400 hover:text-red-300 rounded border border-red-500/20"
                >
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
              {editingId ? 'Edit Collection' : 'Create New Collection'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#F5F1E8]">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value, slug: slugify(e.target.value) }))}
                  className="w-full bg-[#1D1D20] border border-[#D4A02A]/20 text-[#F5F1E8] p-3 rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#F5F1E8]">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  className="w-full bg-[#1D1D20] border border-[#D4A02A]/20 text-[#F5F1E8] p-3 rounded font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#F5F1E8]">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-[#1D1D20] border border-[#D4A02A]/20 text-[#F5F1E8] p-3 rounded"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-[#F5F1E8] block">Cover Image URL</label>
                <input
                  type="text"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cover_image_url: e.target.value }))}
                  className="w-full bg-[#1D1D20] border border-[#D4A02A]/20 text-[#F5F1E8] p-3 rounded"
                />
                <div className="relative border border-dashed border-[#D4A02A]/30 p-3 rounded text-center bg-[#1D1D20]/50">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <span className="text-[11px] text-[#E8C168] font-bold">
                    {uploading ? 'Uploading cover...' : 'Or upload cover image file'}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#D4A02A] text-[#0A0A0C] font-bold text-xs uppercase tracking-widest py-3.5 rounded hover:bg-[#E8C168] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-4"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save Collection
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
