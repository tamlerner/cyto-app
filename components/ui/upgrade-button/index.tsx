'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Check, ArrowRight, Badge } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import './animations.css';

const FEATURES = [
  'UnlimitedInvoices',
  'MultiCurrency',
  'AdvancedAnalytics',
  'PrioritySupport',
  'CustomBranding',
  'ApiAccess',
  'TeamCollaboration',
  'AutomatedWorkflows'
];

const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/28ocMX2WifYmaZi288';

export function UpgradeButton() {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleUpgradeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  const handleUpgradeConfirm = () => {
    window.location.href = STRIPE_CHECKOUT_URL;
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Button
        onClick={handleUpgradeClick}
        className="relative w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 transition-all duration-300"
      >
        <div className="flex items-center justify-center">
          <span className="relative z-10">{t('Upgrade.ToPro')}</span>
        </div>
      </Button>

      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/80" />
        
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex flex-col items-center">
            <Image
              src="/cyto-logo.png"
              alt="CYTO"
              width={100}
              height={32}
              className="mb-2"
            />
            <span className="text-xl font-semibold text-foreground">
              {t('Upgrade.SpecialOffer')}
            </span>
          </DialogTitle>
          <DialogDescription className="text-center">
            <div className="relative">
              {/* Savings Badge */}
              <div className="absolute -right-2 -top-4 bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full animate-subtle-bounce">
                Save 25%
              </div>
              
              {/* Price Display */}
              <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-primary/5">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-semibold text-muted-foreground line-through opacity-70">$20</span>
                  <span className="text-xs text-muted-foreground">{t('Upgrade.PerMonth')}</span>
                </div>
                <div className="text-2xl font-bold">→</div>
                <div className="flex flex-col items-center highlight-price">
                  <span className="text-3xl font-bold text-primary">$15</span>
                  <span className="text-xs text-primary/80">{t('Upgrade.PerMonth')}</span>
                </div>
              </div>
              
              <p className="text-sm text-primary font-medium mt-2">{t('Upgrade.LimitedTime')}</p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="py-3">
          <div className="space-y-2">
            {FEATURES.map((feature) => (
              <div key={feature} 
                className="flex items-center gap-2 text-sm py-1"
              >
                <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-foreground/90">{t(`Upgrade.Features.${feature}`)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4">
            <Button
              onClick={handleUpgradeConfirm}
              className="w-full h-10 text-base font-medium bg-primary hover:bg-primary/90 transition-colors duration-200"
            >
              <div className="flex items-center justify-center">
                {t('Upgrade.UpgradeNow')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {t('Upgrade.MoneyBack')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}