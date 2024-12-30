'use client';

import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils/currency';
import type { Product } from '@/lib/types/product';

interface ProductTableProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export function ProductTable({ products, onSelect }: ProductTableProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('Products.Description')}</TableHead>
            <TableHead className="text-right">{t('Products.UnitPrice')}</TableHead>
            <TableHead className="text-right">{t('Products.TaxRate')}</TableHead>
            <TableHead className="text-right">{t('Products.Actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                {product.item_description}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.unit_price, product.currency)}
              </TableCell>
              <TableCell className="text-right">
                {product.tax_rate}%
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelect(product)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('Invoices.Select')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}