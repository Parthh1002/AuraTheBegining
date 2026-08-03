'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';

/**
 * AdminShell — wraps every admin page with sidebar + proper mobile padding
 */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen"
      style={{ background: '#0C0C0F' }}
    >
      <AdminSidebar />
      {/* Main content — pt-20 on mobile to clear h-14 top bar + gap, extra pb-24 for mobile scrolling */}
      <main className="flex-1 overflow-y-auto pt-20 pb-24 lg:pt-8 lg:pb-8 px-3 sm:px-6 lg:px-8 max-w-full">
        {children}
      </main>
    </div>
  );
}
