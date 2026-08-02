'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Search, Edit3, Trash2, Upload, Star, Check, X, Loader2 } from 'lucide-react';
import { fetchApi, uploadFilesApi } from '@/lib/api';
import { slugify } from '@/lib/utils';

export default function ProductsAdminClient() {
  const [products, setProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    collection_id: '',
    description: '',
    fabric: '',
    sizes: '38, 40, 42, 44',
    tags: 'new-arrival, bestseller',
    price_label: 'Starting at ₹14,999',
    sku: 'AURA-ETH-001',
    in_stock: true,
    is_featured: false,
  });

  const [uploadedImages, setUploadedImages] = useState<{ path: string; is_primary: boolean }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProductsAndCollections = async () => {
    setLoading(true);
    try {
      const cols = await fetchApi('/collections');
      setCollections(cols || []);

      const prods = await fetchApi('/products');
      setProducts(prods || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCollections();
  }, []);

  const handleNameChange = (nameVal: string) => {
    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      slug: editingId ? prev.slug : slugify(nameVal),
    }));
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      collection_id: collections[0]?.id || '',
      description: '',
      fabric: '',
      sizes: '38, 40, 42, 44',
      tags: 'new-arrival',
      price_label: 'Starting at ₹14,999',
      sku: `AURA-${Math.floor(100 + Math.random() * 900)}`,
      in_stock: true,
      is_featured: false,
    });
    setUploadedImages([]);
    setModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      collection_id: product.collection_id || '',
      description: product.description || '',
      fabric: product.fabric || '',
      sizes: product.sizes?.join(', ') || '',
      tags: product.tags?.join(', ') || '',
      price_label: product.price_label || '',
      sku: product.sku || '',
      in_stock: product.in_stock,
      is_featured: product.is_featured,
    });

    const imgs = (product.product_images || []).map((img: any) => ({
      path: img.storage_path,
      is_primary: img.is_primary,
    }));
    setUploadedImages(imgs);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const urls = await uploadFilesApi(Array.from(files));
      const newItems = urls.map((url, i) => ({
        path: url,
        is_primary: uploadedImages.length === 0 && i === 0,
      }));
      setUploadedImages((prev) => [...prev, ...newItems]);
    } catch (err) {
      console.error('Upload Error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const sizesArr = formData.sizes.split(',').map((s) => s.trim()).filter(Boolean);
    const tagsArr = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);

    const payload = {
      name: formData.name,
      slug: formData.slug || slugify(formData.name),
      collection_id: formData.collection_id || null,
      description: formData.description,
      fabric: formData.fabric,
      sizes: sizesArr,
      tags: tagsArr,
      price_label: formData.price_label,
      sku: formData.sku,
      in_stock: formData.in_stock,
      is_featured: formData.is_featured,
      images: uploadedImages,
    };

    try {
      if (editingId) {
        await fetchApi(`/products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchProductsAndCollections();
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await fetchApi(`/products/${id}`, { method: 'DELETE' });
      fetchProductsAndCollections();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.collection_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aura-gold/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-aura-ink">Product Catalog</h1>
          <p className="text-xs text-aura-subink mt-1">Manage designs, fabrics, pricing labels, and high-res image uploads.</p>
        </div>

        <button
          onClick={openNewModal}
          className="bg-aura-gold text-aura-bg font-bold text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-aura-gold-soft transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add New Design
        </button>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter products by name, SKU, collection..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-aura-surface border border-aura-gold/20 text-aura-ink pl-10 pr-4 py-2.5 rounded text-xs focus:outline-none focus:border-aura-gold"
        />
        <Search className="w-4 h-4 text-aura-subink absolute left-3 top-3" />
      </div>

      <div className="bg-aura-surface border border-aura-gold/20 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-aura-ink">
            <thead className="bg-aura-elevated text-aura-gold uppercase tracking-wider text-[10px] border-b border-aura-gold/15">
              <tr>
                <th className="p-4">Design Name</th>
                <th className="p-4">Collection</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Price Label</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4A02A]/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-aura-subink">Loading catalog...</td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const primaryImg = p.product_images?.find((i: any) => i.is_primary)?.storage_path || p.product_images?.[0]?.storage_path;
                  return (
                    <tr key={p.id} className="hover:bg-aura-elevated/50 transition-colors">
                      <td className="p-4 font-bold flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded overflow-hidden bg-aura-elevated shrink-0 border border-aura-gold/20">
                          {primaryImg && <Image src={primaryImg} alt={p.name} fill className="object-cover" />}
                        </div>
                        <div>
                          <span>{p.name}</span>
                          {p.is_featured && (
                            <span className="block text-[9px] text-aura-gold font-sans uppercase">★ Featured</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-aura-subink">{p.collection_name || 'Uncategorized'}</td>
                      <td className="p-4 font-mono text-[11px] text-aura-gold-soft">{p.sku || '-'}</td>
                      <td className="p-4">{p.price_label}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.in_stock ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                        }`}>
                          {p.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 bg-aura-elevated hover:text-aura-gold rounded border border-aura-gold/20"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 bg-aura-elevated hover:text-red-400 rounded border border-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-aura-subink">No products found matching criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-aura-bg/90 backdrop-blur-md flex items-start justify-center p-4 pt-10 pb-10 overflow-y-auto" data-lenis-prevent="true">
          <div className="w-full max-w-2xl bg-aura-surface border border-aura-gold/30 rounded-2xl p-6 sm:p-8 space-y-6 relative my-auto shadow-2xl shrink-0">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-aura-subink hover:text-aura-ink"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-aura-ink">
              {editingId ? 'Edit Product Design' : 'Add New Garment Design'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-aura-ink">Garment Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Obsidian Velvet Bandhgala"
                    className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink p-3 rounded"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-aura-ink">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink p-3 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-aura-ink">Collection / Category *</label>
                  <select
                    value={formData.collection_id}
                    onChange={(e) => setFormData((prev) => ({ ...prev, collection_id: e.target.value }))}
                    className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink p-3 rounded"
                  >
                    <option value="">Select Collection</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-aura-ink">Price Label *</label>
                  <input
                    type="text"
                    value={formData.price_label}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price_label: e.target.value }))}
                    placeholder="e.g. Starting at ₹14,999"
                    className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink p-3 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-aura-ink">Fabric & Hardware</label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fabric: e.target.value }))}
                    placeholder="e.g. Italian Silk Velvet & Gold Hardware"
                    className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink p-3 rounded"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-aura-ink">SKU Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                    className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink p-3 rounded font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-aura-ink">Available Sizes (Comma separated)</label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sizes: e.target.value }))}
                  placeholder="38, 40, 42, 44"
                  className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink p-3 rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-aura-ink">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="new-arrival, bestseller"
                  className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink p-3 rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-aura-ink">Detailed Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-aura-elevated border border-aura-gold/20 text-aura-ink p-3 rounded"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.in_stock}
                    onChange={(e) => setFormData((prev) => ({ ...prev, in_stock: e.target.checked }))}
                    className="w-4 h-4 accent-[#D4A02A]"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 accent-[#D4A02A]"
                  />
                  <span>Featured Design</span>
                </label>
              </div>

              <div className="space-y-3 pt-4 border-t border-aura-gold/15">
                <label className="font-semibold text-aura-ink block">Product Images Upload (PostgreSQL Upload Endpoint)</label>

                <div className="border-2 border-dashed border-aura-gold/30 rounded-xl p-6 text-center bg-aura-elevated/50 hover:border-aura-gold transition-colors relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-aura-gold mx-auto mb-2" />
                  <p className="text-xs text-aura-ink font-bold">Drag & Drop images or click to select</p>
                </div>

                {uploading && (
                  <p className="text-xs text-aura-gold-soft flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading image files...
                  </p>
                )}

                {uploadedImages.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-24 rounded border border-aura-gold/30 overflow-hidden group">
                        <Image src={img.path} alt="Uploaded" fill className="object-cover" />
                        <div className="absolute inset-0 bg-aura-bg/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity">
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedImages((prev) =>
                                prev.map((item, i) => ({ ...item, is_primary: i === idx }))
                              );
                            }}
                            className={`p-1 rounded text-[10px] font-bold uppercase ${
                              img.is_primary ? 'text-aura-gold' : 'text-aura-ink'
                            }`}
                          >
                            <Star className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-aura-gold text-aura-bg font-bold text-xs uppercase tracking-widest py-3.5 rounded hover:bg-aura-gold-soft transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-4"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Garment...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Save Design to PostgreSQL
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
