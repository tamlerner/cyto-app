'use client';

import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChangePasswordForm } from './components/change-password-form';
import { ChangeEmailForm } from './components/change-email-form';
import { CompanyInfoForm } from './components/company-info-form';
import { UserProfileForm } from './components/user-profile-form';
import { TwoFactorSettings } from './components/two-factor-settings';

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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('Settings.ProfileSection')}</CardTitle>
              </CardHeader>
              <CardContent>
                <UserProfileForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('Settings.ChangeEmail')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ChangeEmailForm />
              </CardContent>
            </Card>
          </div>
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('Settings.ChangePassword')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ChangePasswordForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('Settings.TwoFactorAuth')}</CardTitle>
              </CardHeader>
              <CardContent>
                <TwoFactorSettings />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}