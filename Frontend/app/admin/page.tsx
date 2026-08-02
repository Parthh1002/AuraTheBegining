import { redirect } from 'next/navigation';

export default function AdminIndexPage() {
  // Automatically redirect /admin to the dashboard.
  // The layout.tsx will handle redirecting to /admin/login if not authenticated.
  redirect('/admin/dashboard');
}
