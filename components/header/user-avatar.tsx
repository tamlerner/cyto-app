'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserAvatarProps {
  email: string;
  className?: string;
}

export function UserAvatar({ email, className }: UserAvatarProps) {
  const initial = email ? email[0].toUpperCase() : '?';
  
  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-primary text-primary-foreground">
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}