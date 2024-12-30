'use client';

import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/page-header';
import { ClientList } from './components/client-list';
import { AddClientDialog } from './components/add-client-dialog';

export default function ClientsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Clients')}
        description={t('Clients.Description')}
        action={<AddClientDialog />}
      />
      <ClientList />
    </div>
  );
}