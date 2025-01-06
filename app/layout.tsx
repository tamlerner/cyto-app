'use client';

import './globals.css';
import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth/auth-provider';
import { AuthGuard } from '@/lib/auth/auth-guard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Sidebar } from '@/components/sidebar';
import { AppHeader } from '@/components/header/app-header';
import { AuthModal } from '@/components/auth/auth-modal';
import '@/lib/i18n/init';
import { metadata } from './metadata'
export { metadata }

const PUBLIC_ROUTES = ['/login', '/register'];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname || '');

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AuthProvider>
            <AuthGuard>
              <Suspense fallback={<LoadingSpinner />}>
                {isPublicRoute ? (
                  children
                ) : (
                  <div className="min-h-screen bg-background">
                    <AppHeader />
                    <div className="flex h-screen pt-16">
                      <Sidebar />
                      <main className="flex-1 overflow-y-auto">
                        {children}
                      </main>
                    </div>
                    <AuthModal />
                  </div>
                )}
              </Suspense>
            </AuthGuard>
          </AuthProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}