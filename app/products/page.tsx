'use client';

import { useTranslation } from 'react-i18next';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { ProductList } from './components/product-list';
import { AddProductDialog } from './components/add-product-dialog';
import { BulkImportDialog } from './components/bulk-import-dialog';
import { useState } from 'react';

export default function ProductsPage() {
  const { t } = useTranslation();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Products')}
        description={t('Products.Description')}
        action={
          <div className="flex gap-2">
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('Products.Add')}
            </Button>
            <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              {t('Products.BulkImport')}
            </Button>
          </div>
        }
      />
      <ProductList />
      <AddProductDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <BulkImportDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} />
    </div>
  );
}