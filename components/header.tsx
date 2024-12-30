'use client';

import { LanguageSelector } from './language-selector';
import { ThemeToggle } from './theme-toggle';
import { CytoTitle } from './ui/cyto-title';

export function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="h-full flex items-center justify-between px-6">
        <CytoTitle size="md" />
        <div className="flex items-center gap-2">
          <LanguageSelector className="h-8 w-[120px]" />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}