'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function handleGoogleSignIn(redirectTo: string) {
  try {
    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}