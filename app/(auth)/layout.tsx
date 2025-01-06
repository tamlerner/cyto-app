'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!loading && (user || session?.user)) {
        router.replace('/dashboard');
      }
    };

    checkAuth();
  }, [user, loading, router, supabase]);

  if (loading) return null;
  if (user) return null;

  return children;
}