'use client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Route protection and redirection are handled securely by Next.js middleware (middleware.ts)
  // based on the presence of the 'aura-admin-token' cookie.
  // This prevents infinite client-side refresh loops.
  
  return <>{children}</>;
}
