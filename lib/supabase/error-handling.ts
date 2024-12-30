'use client';

import { PostgrestError } from '@supabase/supabase-js';

interface NetworkError extends Error {
  status?: number;
  code?: string;
}

export function handleSupabaseError(error: unknown): string {
  // Handle Supabase specific errors
  if (isPostgrestError(error)) {
    return formatPostgrestError(error);
  }

  // Handle network errors
  if (isNetworkError(error)) {
    return handleNetworkError(error);
  }

  // Handle generic errors
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' && 
    error !== null && 
    'code' in error && 
    'message' in error
  );
}

function isNetworkError(error: unknown): error is NetworkError {
  return (
    error instanceof Error && 
    ('status' in error || 'code' in error)
  );
}

function formatPostgrestError(error: PostgrestError): string {
  switch (error.code) {
    case '23505':
      return 'This record already exists';
    case '23503':
      return 'This operation would violate referential integrity';
    case '42P01':
      return 'The requested resource was not found';
    default:
      return error.message;
  }
}

function handleNetworkError(error: NetworkError): string {
  if (error.status === 429) {
    return 'Too many requests. Please try again later.';
  }
  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please try again.';
  }
  if (error.code === 'NETWORK_ERROR') {
    return 'Network error. Please check your connection.';
  }
  return error.message;
}