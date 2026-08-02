'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageSquare, AlertTriangle, ArrowRight, Activity, Clock } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function DashboardClient() {
  const [newTodayCount, setNewTodayCount] = useState<number>(0);
  const [lowStockCount, setLowStockCount] = useState<number>(0);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const stats = await fetchApi('/enquiries/stats');
      setNewTodayCount(stats.newTodayCount || 0);
      setLowStockCount(stats.lowStockCount || 0);
      setRecentEnquiries(stats.recentEnquiries || []);
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    const interval = setInterval(fetchDashboardStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between border-b border-aura-line pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-aura-ink">Admin Overview</h1>
          <p className="text-xs text-aura-subink mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Server Database Sync Active
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-aura-surface border border-aura-line rounded-xl p-6 space-y-2 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans tracking-widest text-aura-gold uppercase font-bold">New Today</span>
            <MessageSquare className="w-5 h-5 text-aura-gold" />
          </div>
          <p className="font-serif text-4xl font-bold text-aura-ink">{loading ? '...' : newTodayCount}</p>
          <p className="text-[11px] text-aura-subink">Customer & WhatsApp inquiries received today</p>
        </div>

        <div className="bg-aura-surface border border-amber-500/20 rounded-xl p-6 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans tracking-widest text-amber-500 uppercase font-bold">Low Stock / Out</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="font-serif text-4xl font-bold text-aura-ink">{loading ? '...' : lowStockCount}</p>
          <p className="text-[11px] text-aura-subink">Garments marked out of stock</p>
        </div>

        <div className="bg-aura-surface border border-aura-line rounded-xl p-6 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans tracking-widest text-aura-gold uppercase font-bold">Recent Activity</span>
            <Activity className="w-5 h-5 text-aura-gold" />
          </div>
          <p className="font-serif text-4xl font-bold text-aura-ink">{loading ? '...' : recentEnquiries.length}</p>
          <p className="text-[11px] text-aura-subink">Active customer communications</p>
        </div>
      </div>

      <div className="bg-aura-surface border border-aura-line rounded-xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-aura-line pb-4">
          <h2 className="font-serif text-xl font-bold text-aura-ink">Recent Enquiries</h2>
          <Link
            href="/admin/enquiries"
            className="text-xs uppercase tracking-widest text-aura-gold hover:underline font-bold inline-flex items-center gap-1"
          >
            View Full Inbox <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries.length > 0 ? (
          <div className="divide-y divide-aura-line">
            {recentEnquiries.map((enq) => (
              <div key={enq.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-aura-ink">{enq.name || enq.phone || enq.email || 'Anonymous Visitor'}</span>
                    <span className="text-[10px] bg-aura-elevated text-aura-gold px-2 py-0.5 rounded border border-aura-line">
                      {enq.source}
                    </span>
                  </div>
                  {enq.product_name && (
                    <p className="text-aura-gold">Product: {enq.product_name}</p>
                  )}
                  {enq.message && (
                    <p className="text-aura-subink line-clamp-1">{enq.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded ${
                    enq.status === 'new'
                      ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                      : enq.status === 'contacted'
                      ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                      : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                  }`}>
                    {enq.status || 'new'}
                  </span>
                  <span className="text-[10px] text-aura-subink flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(enq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-aura-subink">No enquiries logged yet.</div>
        )}
      </div>
    </div>
  );
}
