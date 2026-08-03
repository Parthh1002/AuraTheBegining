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
      {/* Main content — pt-14 on mobile for fixed top bar, no offset on desktop */}
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-full">
        {children}
      </main>
    </div>
  );
}
