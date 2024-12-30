'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AuthModalContent } from './auth-modal-content';

export function AuthModal() {
  const { user } = useAuth();
  const router = useRouter();

  // Don't show modal if user is authenticated
  if (user) return null;

  return (
    <Dialog defaultOpen={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Welcome to CYTO Business App
          </DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
            onClick={() => router.push('/login')}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <AuthModalContent />
      </DialogContent>
    </Dialog>
  );
}