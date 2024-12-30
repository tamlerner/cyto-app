'use client';

import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function Avatar({ className, children, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function AvatarFallback({ className, children, ...props }: AvatarFallbackProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted font-medium',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}