'use client';

import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function DeleteProductDialog({ 
  open, 
  onOpenChange, 
  onConfirm,
  loading 
}: DeleteProductDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('Products.DeleteConfirmTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('Products.DeleteConfirmDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {t('Form.Cancel')}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? t('Form.Deleting') : t('Form.Delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}