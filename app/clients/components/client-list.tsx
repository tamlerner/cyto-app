'use client';

import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useClients } from '../hooks/use-clients';
import { ClientTable } from './client-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function ClientList() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { clients, loading, error } = useClients();

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: t('Errors.LoadingFailed'),
        description: error,
      });
    }
  }, [error, toast, t]);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!clients?.length) {
    return (
      <div className="rounded-md border p-4 text-center text-muted-foreground">
        {t('Clients.NoClients')}
      </div>
    );
  }

  return <ClientTable clients={clients} />;
}