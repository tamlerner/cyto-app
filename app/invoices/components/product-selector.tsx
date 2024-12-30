'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useProducts } from '@/app/products/hooks/use-products';
import { ProductTable } from './product-table';
import { AddProductDialog } from '@/app/products/components/add-product-dialog';
import type { Product } from '@/lib/types/product';

interface ProductSelectorProps {
  onSelect: (product: Product) => void;
}

export function ProductSelector({ onSelect }: ProductSelectorProps) {
  const { t } = useTranslation();
  const { products } = useProducts();
  const [search, setSearch] = useState('');
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);

  const filteredProducts = products.filter(product =>
    product.item_description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={selectorOpen} onOpenChange={setSelectorOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          {t('Invoices.ImportProduct')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('Invoices.SelectProduct')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('Invoices.SearchProducts')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={() => setAddProductOpen(true)} type="button">
              <Plus className="mr-2 h-4 w-4" />
              {t('Products.Add')}
            </Button>
          </div>

          <ProductTable
            products={filteredProducts}
            onSelect={(product) => {
              onSelect(product);
              setSelectorOpen(false);
            }}
          />
        </div>
      </DialogContent>

      <AddProductDialog
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        onSuccess={() => setAddProductOpen(false)}
      />
    </Dialog>
  );
}