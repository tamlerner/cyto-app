'use client';

import { useTranslation } from 'react-i18next';
import { SocialAuthButton } from './social-auth-button';
import { useGoogleAuth } from '@/hooks/use-google-auth';
import { GoogleLogo } from './google-logo';

export function GoogleAuthButton() {
  const { t } = useTranslation();
  const { signInWithGoogle, loading } = useGoogleAuth();

  return (
    <SocialAuthButton
      icon={GoogleLogo}
      onClick={signInWithGoogle}
      loading={loading}
      className="bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-700"
    >
      {loading ? t('Auth.SigningInWithGoogle') : t('Auth.ContinueWithGoogle')}
    </SocialAuthButton>
  );
}