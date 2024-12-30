'use client';

import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import './animations.css';

export function UpgradeButton() {
  const { t } = useTranslation();

  return (
    <button
      className={cn(
        "w-full relative group",
        "px-4 py-2 rounded-lg",
        "bg-gradient-to-r from-primary/90 to-primary",
        "hover:from-primary hover:to-primary/90",
        "text-primary-foreground font-medium",
        "transition-all duration-300 ease-out",
        "overflow-hidden shadow hover:shadow-md",
      )}
    >
      <span className="relative flex items-center justify-center">
        <Sparkles className="mr-2 h-4 w-4" />
        {t('Upgrade.ToPro')}
      </span>
      <div 
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-transparent via-white/20 to-transparent",
          "opacity-0 group-hover:animate-[shine_2s_ease-out]"
        )} 
      />
    </button>
  );
}