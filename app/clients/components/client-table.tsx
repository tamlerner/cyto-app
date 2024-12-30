'use client';

import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Client } from '@/lib/types/client';

interface ClientTableProps {
  clients: Client[];
}

export function ClientTable({ clients }: ClientTableProps) {
  const { t } = useTranslation();

  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('Clients.NoClients')}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('Clients.CompanyName')}</TableHead>
            <TableHead>{t('Clients.TaxId')}</TableHead>
            <TableHead>{t('Clients.City')}</TableHead>
            <TableHead>{t('Clients.Country')}</TableHead>
            <TableHead>{t('Clients.Email')}</TableHead>
            <TableHead>{t('Clients.Phone')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.company_name}</TableCell>
              <TableCell>{client.tax_id}</TableCell>
              <TableCell>{client.city}</TableCell>
              <TableCell>{client.country}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone_number || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}