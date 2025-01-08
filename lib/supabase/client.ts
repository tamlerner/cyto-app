import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './types';

export const supabase = createClientComponentClient<Database>();

// Add error handling utility
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error details:', error);
  
  if (error?.code === 'PGRST301') {
    return 'Authentication required. Please sign in.';
  }
  
  if (error?.code === '42501') {
    return 'You do not have permission to perform this action.';
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};