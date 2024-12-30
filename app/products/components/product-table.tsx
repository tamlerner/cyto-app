'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils/currency';
import { useDeleteProduct } from '../hooks/use-delete-product';
import { EditProductDialog } from './edit-product-dialog';
import { DeleteProductDialog } from './delete-product-dialog';
import type { Product } from '@/lib/types/product';

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { deleteProduct, loading: deleting } = useDeleteProduct();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  async function handleDelete() {
    if (!deletingProduct) return;

    try {
      await deleteProduct(deletingProduct.id);
      toast({
        title: t('Products.DeleteSuccess'),
      });
      setDeletingProduct(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('Products.DeleteError'),
        description: error instanceof Error ? error.message : undefined,
      });
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('Products.Description')}</TableHead>
              <TableHead className="text-right">{t('Products.UnitPrice')}</TableHead>
              <TableHead className="text-right">{t('Products.TaxRate')}</TableHead>
              <TableHead className="text-right">{t('Products.Total')}</TableHead>
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
                  {formatCurrency(product.total, product.currency)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingProduct(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingProduct && (
        <EditProductDialog
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          product={editingProduct}
        />
      )}

      {deletingProduct && (
        <DeleteProductDialog
          open={!!deletingProduct}
          onOpenChange={(open) => !open && setDeletingProduct(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
    </>
  );
}