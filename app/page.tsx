'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AuthLoading } from '@/components/auth/auth-loading';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading) {
      router.replace(user ? '/dashboard' : '/login');
    }
  }, [user, loading, router]);

  return <AuthLoading />;
}