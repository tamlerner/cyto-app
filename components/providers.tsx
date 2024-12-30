'use client';

import { ThemeProvider } from 'next-themes';
import { I18nextProvider } from 'react-i18next';
import { Suspense } from 'react';
import i18n from '@/lib/i18n/config';
import { LoadingSpinner } from './ui/loading-spinner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n} defaultNS="common">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </ThemeProvider>
    </I18nextProvider>
  );
}