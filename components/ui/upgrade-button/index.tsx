'use client';

import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './styles.css';

const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/28ocMX2WifYmaZi288';

export function UpgradeButton() {
  const { t } = useTranslation();

  const handleUpgrade = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(STRIPE_CHECKOUT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      onClick={handleUpgrade}
      className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium transition-all duration-300"
    >
      <Sparkles className="mr-2 h-4 w-4" />
      {t('Upgrade.ToPro')}
    </Button>
  );
}