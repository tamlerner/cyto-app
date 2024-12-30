'use client';

import { useState, useEffect } from 'react';
import { handleSupabaseError } from '@/lib/supabase/error-handling';

interface UseFetchOptions<T> {
  fetchFn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  dependencies?: any[];
  retryCount?: number;
  retryDelay?: number;
}

export function useDataFetch<T>({ 
  fetchFn, 
  onSuccess, 
  onError,
  dependencies = [],
  retryCount = 3,
  retryDelay = 1000
}: UseFetchOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn();
        
        if (mounted) {
          setData(result);
          onSuccess?.(result);
          setRetries(0); // Reset retries on success
        }
      } catch (err) {
        const errorMessage = handleSupabaseError(err);
        
        if (mounted) {
          // Retry logic
          if (retries < retryCount) {
            setRetries(prev => prev + 1);
            retryTimeout = setTimeout(fetchData, retryDelay);
          } else {
            setError(errorMessage);
            onError?.(errorMessage);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
      clearTimeout(retryTimeout);
    };
  }, [...dependencies, retries]);

  return { data, loading, error, refetch: () => setRetries(0) };
}