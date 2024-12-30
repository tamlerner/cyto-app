'use client';

import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InvoiceItemForm } from '../invoice-item-form';
import type { UseFormReturn } from 'react-hook-form';
import type { InvoiceFormData } from '../../types';

interface InvoiceItemsListProps {
  form: UseFormReturn<InvoiceFormData>;
  items: { id: string }[];
  setItems: (items: { id: string }[]) => void;
  currency: string;
}

export function InvoiceItemsList({ form, items, setItems, currency }: InvoiceItemsListProps) {
  const { t } = useTranslation();

  function addItem() {
    setItems([...items, { id: Math.random().toString() }]);
    form.setValue('items', [
      ...form.getValues('items'),
      { description: '', quantity: 1, unit_price: 0, tax_rate: 0 },
    ]);
  }

  function removeItem(index: number) {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);

    const formItems = form.getValues('items');
    formItems.splice(index, 1);
    form.setValue('items', formItems);
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <InvoiceItemForm
          key={item.id}
          form={form}
          index={index}
          onRemove={() => removeItem(index)}
          isRemoveDisabled={items.length === 1}
          currency={currency}
        />
      ))}
      
      <Button type="button" variant="outline" onClick={addItem}>
        <Plus className="mr-2 h-4 w-4" />
        {t('Invoices.AddItem')}
      </Button>
    </div>
  );
}