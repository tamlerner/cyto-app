'use client';

import { supabase } from '../supabase/client';

export async function handleGoogleSignIn(redirectTo: string) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        },
        skipBrowserRedirect: false
      }
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}