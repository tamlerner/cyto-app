'use client';

import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';

interface AuthHeaderProps {
  title: string;
  description?: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-8 w-8" />
        <h1 className="text-3xl font-bold">CYTO</h1>
      </div>
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