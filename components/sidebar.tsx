'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, FileText, Users, Package, Settings, Wallet, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Separator } from './ui/separator';
import { UpgradeButton } from './ui/upgrade-button';
import { SignOutDialog } from './auth/sign-out-dialog';

export function Sidebar() {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const [isPayrollOpen, setPayrollOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const togglePayroll = () => setPayrollOpen(!isPayrollOpen);
  const toggleSettings = () => setSettingsOpen(!isSettingsOpen);

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
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={togglePayroll}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {t('Payroll')}
            <ChevronRight
              className={`ml-auto h-4 w-4 transition-transform ${
                isPayrollOpen ? 'rotate-90' : ''
              }`}
            />
          </Button>
          <div
            className={`pl-6 space-y-1 overflow-hidden transition-[max-height] duration-300 ${
              isPayrollOpen ? 'max-h-32' : 'max-h-0'
            }`}
          >
            <Link href="/payroll/employees" passHref>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-accent"
              >
                {t('Employees')}
              </Button>
            </Link>
            <div
              title="Coming Soon"
              className="w-full p-2 opacity-50 cursor-not-allowed text-muted-foreground flex items-center hover:bg-transparent"
            >
              {t('Payments')}
              <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded-md animate-pulse">
                {t('Coming Soon')}
              </span>
            </div>
            <div
              title="Coming Soon"
              className="w-full p-2 opacity-50 cursor-not-allowed text-muted-foreground flex items-center hover:bg-transparent"
            >
              {t('Reports')}
              <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded-md animate-pulse">
                {t('Coming Soon')}
              </span>
            </div>
          </div>
        </div>
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={toggleSettings}
          >
            <Settings className="mr-2 h-4 w-4" />
            {t('Settings.Title')}
            <ChevronRight
              className={`ml-auto h-4 w-4 transition-transform ${
                isSettingsOpen ? 'rotate-90' : ''
              }`}
            />
          </Button>
          <div
            className={`pl-6 space-y-1 overflow-hidden transition-[max-height] duration-300 ${
              isSettingsOpen ? 'max-h-32' : 'max-h-0'
            }`}
          >
            <Link href="/settings?tab=account" passHref>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-accent"
              >
                {t('Settings.Account')}
              </Button>
            </Link>
            <Link href="/settings?tab=company" passHref>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-accent"
              >
                {t('Settings.Company.Title')}
              </Button>  
            </Link>
            <Link href="/settings?tab=security" passHref>
              <Button 
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-accent"
              >
                {t('Settings.Security')}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="space-y-4">
        <UpgradeButton />
        <Separator />
        <SignOutDialog onSignOut={signOut} />
      </div>
    </div>
  );
}