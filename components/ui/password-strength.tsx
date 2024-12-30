'use client';

import { Check, X } from 'lucide-react';

interface PasswordRequirement {
  text: string;
  validator: (value: string) => boolean;
}

interface PasswordStrengthProps {
  password: string;
}

const requirements: PasswordRequirement[] = [
  {
    text: 'At least 8 characters',
    validator: (value) => value.length >= 8,
  },
  {
    text: 'At least 2 uppercase letters',
    validator: (value) => (value.match(/[A-Z]/g) || []).length >= 2,
  },
  {
    text: 'At least 1 special character',
    validator: (value) => /[^a-zA-Z0-9]/.test(value),
  },
];

export function PasswordStrength({ password }: PasswordStrengthProps) {
  return (
    <div className="space-y-2 text-sm">
      {requirements.map(({ text, validator }, index) => {
        const isMet = validator(password);
        return (
          <div
            key={index}
            className={`flex items-center gap-2 transition-colors ${
              password ? (isMet ? 'text-green-500' : 'text-red-500') : 'text-muted-foreground'
            }`}
          >
            {password ? (
              isMet ? (
                <Check className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )
            ) : (
              <div className="h-4 w-4" />
            )}
            {text}
          </div>
        );
      })}
    </div>
  );
}