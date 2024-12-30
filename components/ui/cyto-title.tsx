'use client';

import { cn } from '@/lib/utils';

interface CytoTitleProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CytoTitle({ size = 'md', className }: CytoTitleProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <h1 className={cn(
      'font-cyto tracking-wider font-light text-foreground',
      sizeClasses[size],
      className
    )}>
      CYTO
    </h1>
  );
}