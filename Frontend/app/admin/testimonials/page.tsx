import AdminSidebar from '@/components/admin/AdminSidebar';
import TestimonialsAdminClient from './TestimonialsAdminClient';

export const revalidate = 0;

export default function AdminTestimonialsPage() {
  return (
    <div className="flex min-h-screen bg-[#0A0A0C]">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <TestimonialsAdminClient />
      </main>
    </div>
  );
}
