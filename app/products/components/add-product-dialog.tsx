'use client';

import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductForm } from './product-form';

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddProductDialog({ open, onOpenChange, onSuccess }: AddProductDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('Products.Add')}</DialogTitle>
        </DialogHeader>
        <ProductForm onSuccess={() => {
          onSuccess?.();
          onOpenChange(false);
        }} />
      </DialogContent>
    </Dialog>
  );
}