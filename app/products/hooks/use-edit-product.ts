'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Product } from '@/lib/types/product';

export function useEditProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function editProduct(id: string, data: Partial<Product>) {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('product_lines')
        .update(data)
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update product';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { editProduct, loading, error };
}