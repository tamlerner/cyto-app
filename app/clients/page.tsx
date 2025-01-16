'use client';

import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/page-header';
import { ClientList } from './components/client-list';
import { AddClientDialog } from './components/add-client-dialog';
import { BulkImportDialog } from './components/bulk-import-dialog';

export default function ClientsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Clients')}
        description={t('Clients.Description')}
        action={
          <div className="flex gap-2">
            <AddClientDialog />
            <BulkImportDialog />
          </div>
        }
      />
      <ClientList />
    </div>
  );
}