'use client';

import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size="lg" />
    </div>
  );
}