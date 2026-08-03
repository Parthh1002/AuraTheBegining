import AdminShell from '@/components/admin/AdminShell';
import TestimonialsAdminClient from './TestimonialsAdminClient';

export const revalidate = 0;

export default function AdminTestimonialsPage() {
  return (
    <AdminShell>
      <TestimonialsAdminClient />
    </AdminShell>
  );
}