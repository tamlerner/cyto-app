'use client';

import { supabase } from '../supabase/client';

export async function clearAuthSession() {
  try {
    // Clear all auth-related data from localStorage
    const authKeys = [
      'supabase.auth.token',
      'supabase.auth.refreshToken',
      'supabase.auth.expires_at',
      'supabase.auth.expires_in',
      'supabase.auth.provider-token'
    ];
    
    authKeys.forEach(key => window.localStorage.removeItem(key));
    
    // Clear session cookie
    document.cookie = 'supabase-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    return true;
  } catch (error) {
    console.error('Error clearing auth session:', error);
    return false;
  }
}

export async function signOutUser() {
  try {
    // Clear local storage and cookies first
    await clearAuthSession();
    
    // Sign out from Supabase with global scope
    const { error } = await supabase.auth.signOut({
      scope: 'global'
    });
    
    if (error) throw error;
    
    // Wait for cleanup
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}