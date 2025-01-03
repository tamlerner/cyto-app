// settings/page.tsx
'use client';

import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChangePasswordForm } from './components/change-password-form';
import { ChangeEmailForm } from './components/change-email-form';
import { CompanyInfoForm } from './components/company-info-form';

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={t('Settings.Title')}
        description={t('Settings.Description')}
        icon={Settings}
      />

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">{t('Settings.Account')}</TabsTrigger>
          <TabsTrigger value="company">{t('Settings.Company.Title')}</TabsTrigger>  
          <TabsTrigger value="security">{t('Settings.Security')}</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>{t('Settings.ChangeEmail')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChangeEmailForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>{t('Settings.Company.Title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CompanyInfoForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t('Settings.ChangePassword')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}