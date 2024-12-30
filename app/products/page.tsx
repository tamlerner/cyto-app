'use client';

import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { ProductList } from './components/product-list';
import { AddProductDialog } from './components/add-product-dialog';
import { useState } from 'react';

export default function ProductsPage() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Products')}
        description={t('Products.Description')}
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('Products.Add')}
          </Button>
        }
      />
      <ProductList />
      <AddProductDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}