'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WalletCards } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/page-header';

const PayrollPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title={t('Payroll & HR Management')}
        description={t('Manage employees, payroll, and generate reports')}
      />
      <div className="text-center py-12 text-muted-foreground">
        <WalletCards className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
        <h3 className="text-lg font-medium mb-2">{t('Coming Soon')}</h3>
        <p>{t('Payroll management features will be available soon')}</p>
      </div>
    </div>
  );
};

export default PayrollPage;