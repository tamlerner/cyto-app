'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GoogleAuthButton } from './google-auth-button';
import { Separator } from '@/components/ui/separator';

export function AuthModalContent() {
  const router = useRouter();

  return (
    <div className="px-4 py-6">
      <p className="text-center text-muted-foreground mb-8">
        Please log in or create an account to access the CYTO business tools
      </p>

      <div className="space-y-4">
        <GoogleAuthButton />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          <Button onClick={() => router.push('/login')}>
            Log In
          </Button>
          <Button variant="outline" onClick={() => router.push('/register')}>
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}