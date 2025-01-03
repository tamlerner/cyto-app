'use client';

import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function UpgradeButton() {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center">
      <Link href="https://buy.stripe.com/28ocMX2WifYmaZi288" passHref legacyBehavior>
        <a
          className={cn(
            "inline-block relative group",
            "px-3 py-1 rounded-md",
            "bg-primary",
            "hover:bg-primary/90",
            "text-primary-foreground font-medium",
            "transition-all duration-300 ease-out",
            "overflow-hidden shadow-md hover:shadow-primary/25",
          )}
        >
          <span className="relative flex items-center justify-center">
            <Sparkles className="mr-2 h-4 w-4" />
            {t('Upgrade.ToPro')}
          </span>
        </a>
      </Link>
    </div>
  );
}