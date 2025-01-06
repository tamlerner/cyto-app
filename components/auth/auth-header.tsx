'use client';

import { useTranslation } from 'react-i18next';

interface AuthHeaderProps {
  title: string;
  description?: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center pt-8">
      <img src="/white-cyto-logo.png" className="h-8 w-8 mb-4 animate-pulse" />
      <h1 className="text-4xl font-light tracking-wider mb-4">CYTO</h1>
      <h2 className="text-2xl font-semibold tracking-tight">
        {t(title)} {title === 'Auth.WelcomeBack' && <span className="animate-wave">👋</span>}
      </h2>
      {description && (
        <p className="text-sm text-muted-foreground mt-2">
          {t(description)}
        </p>
      )}
    </div>
  );
}