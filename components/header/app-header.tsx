'use client';

import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggle } from '@/components/theme-toggle';
import { CytoTitle } from '@/components/ui/cyto-title';
import { UserDropdown } from './user-dropdown';

export function AppHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="h-full max-w-[1920px] mx-auto flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <CytoTitle />
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector className="w-[140px] h-9" />
          <ThemeToggle />
          <UserDropdown />
        </div>
      </div>
    </div>
  );
}