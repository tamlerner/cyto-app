'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ImportProducts from './import-products';

export function BulkImportDialog({ open, onOpenChange }: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('Products.BulkImport')}</DialogTitle>
        </DialogHeader>
        <ImportProducts onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}