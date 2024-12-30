'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import type { Product } from '@/lib/types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          setProducts([]);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('product_lines')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        
        if (mounted) {
          setProducts(data || []);
        }
      } catch (err) {
        console.error('Error loading products:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load products');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    // Set up real-time subscription
    const channel = supabase
      .channel('products_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'product_lines',
          filter: `user_id=eq.${user?.id}`
        }, 
        () => {
          loadProducts();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, [user]);

  return { products, loading, error };
}