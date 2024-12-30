'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AuthLoading } from '@/components/auth/auth-loading';

const PUBLIC_ROUTES = ['/login', '/register'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname || '');

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicRoute) {
        router.replace('/login');
      } else if (user && isPublicRoute) {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, router, isPublicRoute]);

  if (loading) {
    return <AuthLoading />;
  }

  if (!loading && !user && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}