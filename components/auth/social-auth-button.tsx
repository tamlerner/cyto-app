'use client';

import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialAuthButtonProps {
  icon: LucideIcon;
  onClick: () => Promise<void>;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function SocialAuthButton({
  icon: Icon,
  onClick,
  loading,
  className,
  children
}: SocialAuthButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn("w-full", className)}
      onClick={onClick}
      disabled={loading}
    >
      <Icon className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
}