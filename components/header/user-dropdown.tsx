'use client';

import { Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { UserAvatar } from './user-avatar';
import { Button } from '@/components/ui/button';

export function UserDropdown() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-9 w-9 rounded-full"
          aria-label="User menu"
        >
          <UserAvatar email={user.email || ''} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => router.push('/settings')}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          {t('Settings.Title')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut()}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('Auth.SignOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}