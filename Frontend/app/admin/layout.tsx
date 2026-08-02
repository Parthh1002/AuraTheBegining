'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Client-side authentication check
    const token = localStorage.getItem('aura-admin-token');
    
    if (token === 'aura-admin-hardcoded-token-12345') {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      // If not on login page and not authorized, redirect to login
      if (pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
    }
    
    setIsChecking(false);
  }, [pathname, router]);

  // Show a premium loading state while checking credentials
  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-aura-gold/20 border-t-aura-gold rounded-full animate-spin" />
          <p className="text-aura-gold tracking-[0.2em] text-xs uppercase font-bold">Verifying Access...</p>
        </div>
      </div>
    );
  }

  // Prevent rendering the dashboard content if unauthorized
  if (!isAuthorized && pathname !== '/admin/login') {
    return null; 
  }

  // If authorized, or if we are exactly on the login page (which handles its own state), render children
  return <>{children}</>;
}
