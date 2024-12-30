'use client';

import { supabase } from '../supabase/client';
import { signOutUser } from './session';

export async function handleSignOut() {
  return signOutUser();
}

export async function handleGoogleSignIn(redirectTo: string) {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Google sign in error:', error);
    return false;
  }
}