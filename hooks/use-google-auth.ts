'use client';

import { useState } from 'react';
import { useToast } from './use-toast';
import { handleGoogleSignIn } from '@/lib/auth/auth-utils';

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function signInWithGoogle() {
    try {
      setLoading(true);
      const redirectTo = `${window.location.origin}/auth/callback`;
      const success = await handleGoogleSignIn(redirectTo);

      if (!success) {
        throw new Error('Failed to sign in with Google');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to sign in with Google',
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  }

  return { signInWithGoogle, loading };
}