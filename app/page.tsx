'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AuthLoading } from '@/components/auth/auth-loading';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const siteTitle = 'CYTO Business Suite';
  
  useEffect(() => {
    if (!loading) {
      router.replace(user ? '/dashboard' : '/login');
    }
  }, [user, loading, router]);

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <AuthLoading />
    </>
  );
}