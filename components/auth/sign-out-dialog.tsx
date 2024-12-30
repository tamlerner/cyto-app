'use client';

import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface SignOutDialogProps {
  onSignOut: () => Promise<void>;
}

export function SignOutDialog({ onSignOut }: SignOutDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('Auth.SignOut')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('Auth.SignOut')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('Auth.SignOutConfirm')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('Form.Cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onSignOut}
            className="bg-primary hover:bg-primary/90"
          >
            {t('Auth.SignOut')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}