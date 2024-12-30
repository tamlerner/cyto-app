'use client';

import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProducts } from '../hooks/use-products';
import { ProductTable } from './product-table';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductList() {
  const { t } = useTranslation();
  const { products, loading, error } = useProducts();

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

  if (!products.length) {
    return (
      <div className="rounded-md border p-4 text-center text-muted-foreground">
        {t('Products.NoProducts')}
      </div>
    );
  }

  return <ProductTable products={products} />;
}