'use client';

import { useTranslation } from 'react-i18next';
import { Building2, FileText, Users, Package, Settings, Wallet } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Separator } from './ui/separator';
import { UpgradeButton } from './ui/upgrade-button';
import { SignOutDialog } from './auth/sign-out-dialog';

export function Sidebar() {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  return (
    <div className="w-64 bg-card border-r h-full p-4 flex flex-col">
      <nav className="space-y-2 flex-1">
        <Link href="/dashboard" passHref>
          <Button variant="ghost" className="w-full justify-start">
            <Building2 className="mr-2 h-4 w-4" />
            {t('Dashboard')}
          </Button>
        </Link>
        <Link href="/clients" passHref>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            {t('Clients')}
          </Button>
        </Link>
        <Link href="/products" passHref>
          <Button variant="ghost" className="w-full justify-start">
            <Package className="mr-2 h-4 w-4" />
            {t('Products')}
          </Button>
        </Link>
        <Link href="/invoices" passHref>
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            {t('Invoices')}
          </Button>
        </Link>
        <Link href="/payroll" passHref>
          <Button variant="ghost" className="w-full justify-start">
            <Wallet className="mr-2 h-4 w-4" />
            {t('Payroll')}
          </Button>
        </Link>
        <Link href="/settings" passHref>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            {t('Settings.Title')}
          </Button>
        </Link>
      </nav>

      <div className="space-y-4">
        <UpgradeButton />
        <Separator />
        <SignOutDialog onSignOut={signOut} />
      </div>
    </div>
  );
}