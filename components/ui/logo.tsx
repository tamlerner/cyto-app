'use client';

import { FileText } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const { theme } = useTheme();
  
  return (
    <div className={cn('relative', className)}>
      <FileText 
        className={cn(
          'w-full h-full',
          theme === 'dark' ? 'text-white' : 'text-black'
        )}
      />
    </div>
  );
}