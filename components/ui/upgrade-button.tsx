'use client';

import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function UpgradeButton() {
  const { t } = useTranslation();

  return (
    <button
      className={cn(
        "w-full relative group",
        "px-4 py-2 rounded-lg",
        "bg-gradient-to-r from-primary/80 to-primary",
        "hover:from-primary hover:to-primary/90",
        "text-primary-foreground font-medium",
        "transition-all duration-300 ease-out",
        "overflow-hidden shadow-lg hover:shadow-primary/25",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        "before:-translate-x-full before:animate-[shimmer_2s_infinite]",
        "before:transition-transform before:duration-300",
        "hover:before:-translate-x-[60%]",
        "after:absolute after:inset-0",
        "after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent",
        "after:translate-x-full after:animate-[shimmer_2s_infinite]",
        "after:transition-transform after:duration-300",
        "after:delay-150",
        "hover:after:translate-x-[60%]",
      )}
    >
      <span className="relative flex items-center justify-center">
        <Sparkles className="mr-2 h-4 w-4" />
        {t('Upgrade.ToPro')}
      </span>
    </button>
  );
}