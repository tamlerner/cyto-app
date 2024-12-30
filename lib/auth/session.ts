'use client';

import { supabase } from '../supabase/client';

export async function clearAuthSession() {
  try {
    // Clear all auth-related data from localStorage
    const authKeys = [
      'supabase.auth.token',
      'supabase.auth.refreshToken',
      'supabase.auth.expires_at',
      'supabase.auth.expires_in'
    ];
    
    authKeys.forEach(key => window.localStorage.removeItem(key));
    
    // Clear session cookie if exists
    document.cookie = 'supabase-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    return true;
  } catch (error) {
    console.error('Error clearing auth session:', error);
    return false;
  }
}

export async function signOutUser() {
  try {
    // First clear all local auth data
    await clearAuthSession();
    
    // Then sign out from Supabase
    const { error } = await supabase.auth.signOut({
      scope: 'local'
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    return false;
  }
}