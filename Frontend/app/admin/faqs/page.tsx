'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app this would fetch from /api/faqs with auth
    setFaqs([
      { id: '1', question: 'Do you offer bespoke sizing and alterations?', answer: 'Yes. Every garment at AURA is tailored to perfection. We offer full bespoke sizing and complimentary alterations for up to 6 months after purchase to ensure an impeccable fit.' },
      { id: '2', question: 'Can I purchase online, or is it in-store only?', answer: 'AURA operates exclusively as a boutique showroom experience. We believe luxury menswear must be felt and fitted in person. You can browse our collections online, but purchases and fittings happen in our Dahegam studio.' },
      { id: '3', question: 'How do I book a fitting appointment?', answer: 'You can reach out to us via WhatsApp, phone, or directly through the "Visit Store" page to schedule a private consultation and fitting.' },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-aura-ink">Manage FAQs</h1>
          <p className="text-sm text-aura-subink mt-1">Update client services questions and answers.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-aura-gold text-[#0A0A0C] text-xs font-bold uppercase tracking-widest rounded shadow hover:bg-aura-gold-soft transition-colors cursor-pointer">
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      <div className="bg-aura-surface border border-aura-line rounded-lg shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-aura-surface-alt border-b border-aura-line text-aura-subink font-sans uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Question</th>
                <th className="px-6 py-4 font-semibold">Answer Snippet</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aura-line">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-aura-subink">
                    Loading...
                  </td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-aura-subink">
                    No FAQs found.
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-aura-surface-alt/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-aura-ink align-top w-1/3">
                      {faq.question}
                    </td>
                    <td className="px-6 py-4 text-aura-subink align-top">
                      {faq.answer.substring(0, 100)}...
                    </td>
                    <td className="px-6 py-4 text-right align-top space-x-3">
                      <button className="text-aura-ink hover:text-aura-gold transition-colors inline-block" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-600 transition-colors inline-block" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards */}
        <div className="md:hidden divide-y divide-aura-line">
          {loading ? (
            <div className="px-6 py-8 text-center text-aura-subink text-sm">Loading...</div>
          ) : faqs.length === 0 ? (
            <div className="px-6 py-8 text-center text-aura-subink text-sm">No FAQs found.</div>
          ) : (
            faqs.map((faq) => (
              <div key={faq.id} className="p-4 space-y-3 hover:bg-aura-surface-alt/50 transition-colors">
                <div>
                  <h3 className="font-bold text-aura-ink text-sm">{faq.question}</h3>
                  <p className="text-xs text-aura-subink mt-1 line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-aura-line/50">
                  <button className="p-2 bg-aura-surface-alt text-aura-ink hover:text-aura-gold rounded border border-aura-line/50" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-aura-surface-alt text-red-400 hover:text-red-300 rounded border border-red-500/20" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
