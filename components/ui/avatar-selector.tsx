'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AVATARS = ['👤', '👨', '👩', '🧑', '👶', '👧', '🧒', '👦', '👨‍🦰', '👩‍🦰', '👱‍♂️', '👱‍♀️', '👨‍🦳', '👩‍🦳', '👨‍🦲', '👩‍🦲'];

interface AvatarSelectorProps {
  value?: string;
  onChange?: (value: string) => Promise<void>;
}

export function AvatarSelector({ value, onChange }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(value);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (avatar: string) => {
    try {
      setLoading(true);
      setSelectedAvatar(avatar);
      if (onChange) {
        await onChange(avatar);
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      // Revert selection on error
      setSelectedAvatar(value);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {AVATARS.map((avatar) => (
        <Button
          key={avatar}
          variant="outline"
          className={cn(
            "relative h-16 w-16 p-0 text-2xl hover:bg-accent transition-colors",
            avatar === selectedAvatar && "border-primary ring-2 ring-primary",
            loading && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !loading && handleSelect(avatar)}
          disabled={loading}
        >
          {avatar}
          {avatar === selectedAvatar && (
            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-0.5">
              <Check className="h-3 w-3" />
            </div>
          )}
        </Button>
      ))}
    </div>
  );
}