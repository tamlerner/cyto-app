'use client';

import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggle } from '@/components/theme-toggle';

interface AuthContainerProps {
  children: React.ReactNode;
}

export function AuthContainer({ children }: AuthContainerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-md bg-card p-8 rounded-lg shadow-lg space-y-8">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <LanguageSelector className="w-[140px]" />
          <ThemeToggle />
        </div>
        {children}
      </div>
    </div>
  );
}