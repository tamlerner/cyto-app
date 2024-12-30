'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useDeleteProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteProduct(id: string) {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('product_lines')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { deleteProduct, loading, error };
}