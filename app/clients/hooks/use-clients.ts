'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import type { Client } from '@/lib/types/client';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    let mounted = true;

    async function loadClients() {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          setClients([]);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        
        if (mounted) {
          setClients(data || []);
        }
      } catch (err) {
        console.error('Error loading clients:', err);
        const message = err instanceof Error ? err.message : 'Failed to load clients';
        setError(message);
        toast({
          variant: 'destructive',
          title: t('Errors.LoadingFailed'),
          description: message
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadClients();

    // Set up real-time subscription
    const channel = supabase
      .channel('clients_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'clients',
          filter: `user_id=eq.${user?.id}`
        }, 
        () => {
          loadClients();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, [user, toast, t]);

  return { clients, loading, error };
}