'use client';

import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductForm } from './product-form';
import type { Product } from '@/lib/types/product';

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export function EditProductDialog({ open, onOpenChange, product }: EditProductDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('Products.Edit')}</DialogTitle>
        </DialogHeader>
        <ProductForm 
          initialData={product} 
          onSuccess={() => onOpenChange(false)} 
          mode="edit"
        />
      </DialogContent>
    </Dialog>
  );
}