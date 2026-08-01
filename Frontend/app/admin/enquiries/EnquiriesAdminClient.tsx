'use client';

import { useState, useEffect } from 'react';
import { Filter, MessageSquare, Phone, Mail, Clock } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function EnquiriesAdminClient() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const data = await fetchApi(`/enquiries?status=${statusFilter}&source=${sourceFilter}`);
      setEnquiries(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, sourceFilter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetchApi(`/enquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      fetchEnquiries();
    } catch (e) {
      console.error(e);
    }
  };

  const updateNotes = async (id: string, notes: string) => {
    try {
      await fetchApi(`/enquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ notes }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4A02A]/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#F5F1E8]">Enquiries Inbox</h1>
          <p className="text-xs text-[#9C9894] mt-1">Manage incoming WhatsApp clicks, contact forms, and stock alerts.</p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-2 bg-[#151517] border border-[#D4A02A]/20 px-3 py-1.5 rounded">
            <Filter className="w-3.5 h-3.5 text-[#D4A02A]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[#F5F1E8] focus:outline-none"
            >
              <option value="all" className="bg-[#151517]">All Statuses</option>
              <option value="new" className="bg-[#151517]">New</option>
              <option value="contacted" className="bg-[#151517]">Contacted</option>
              <option value="closed" className="bg-[#151517]">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#151517] border border-[#D4A02A]/20 px-3 py-1.5 rounded">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-transparent text-[#F5F1E8] focus:outline-none"
            >
              <option value="all" className="bg-[#151517]">All Sources</option>
              <option value="whatsapp_product" className="bg-[#151517]">WhatsApp Product</option>
              <option value="contact_form" className="bg-[#151517]">Contact Form</option>
              <option value="stock_notify" className="bg-[#151517]">Stock Alert</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#151517] border border-[#D4A02A]/20 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <p className="p-8 text-center text-xs text-[#9C9894]">Loading inbox messages...</p>
        ) : enquiries.length > 0 ? (
          <div className="divide-y divide-[#D4A02A]/10">
            {enquiries.map((enq) => (
              <div key={enq.id} className="p-6 space-y-4 hover:bg-[#1D1D20]/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base font-bold text-[#F5F1E8]">
                        {enq.name || enq.phone || enq.email || 'Anonymous Customer'}
                      </span>
                      <span className="text-[10px] bg-[#1D1D20] text-[#D4A02A] px-2.5 py-0.5 rounded border border-[#D4A02A]/20 font-mono">
                        {enq.source}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-[#9C9894]">
                      {enq.phone && (
                        <a href={`tel:${enq.phone}`} className="flex items-center gap-1 hover:text-[#D4A02A]">
                          <Phone className="w-3.5 h-3.5 text-[#D4A02A]" /> {enq.phone}
                        </a>
                      )}
                      {enq.email && (
                        <a href={`mailto:${enq.email}`} className="flex items-center gap-1 hover:text-[#D4A02A]">
                          <Mail className="w-3.5 h-3.5 text-[#D4A02A]" /> {enq.email}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={enq.status || 'new'}
                      onChange={(e) => updateStatus(enq.id, e.target.value)}
                      className={`text-xs font-bold uppercase px-3 py-1.5 rounded border cursor-pointer ${
                        enq.status === 'new'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                          : enq.status === 'contacted'
                          ? 'bg-blue-950/80 text-blue-300 border-blue-500/30'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      <option value="new" className="bg-[#151517]">New</option>
                      <option value="contacted" className="bg-[#151517]">Contacted</option>
                      <option value="closed" className="bg-[#151517]">Closed</option>
                    </select>

                    <span className="text-[10px] text-[#9C9894] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(enq.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {enq.product_name && (
                  <div className="p-3 bg-[#1D1D20] border border-[#D4A02A]/15 rounded text-xs flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#D4A02A]" />
                    <span className="text-[#F5F1E8] font-semibold">Inquired Product: {enq.product_name}</span>
                  </div>
                )}

                {enq.message && (
                  <p className="text-xs text-[#9C9894] leading-relaxed bg-[#1D1D20]/50 p-3 rounded border border-[#D4A02A]/10">
                    {enq.message}
                  </p>
                )}

                <div className="pt-2">
                  <input
                    type="text"
                    defaultValue={enq.notes || ''}
                    placeholder="Add internal staff notes..."
                    onBlur={(e) => updateNotes(enq.id, e.target.value)}
                    className="w-full bg-[#1D1D20] border border-[#D4A02A]/15 text-[#F5F1E8] px-3 py-2 rounded text-xs focus:outline-none focus:border-[#D4A02A]"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-8 text-center text-xs text-[#9C9894]">No enquiries found matching filters.</p>
        )}
      </div>
    </div>
  );
}
