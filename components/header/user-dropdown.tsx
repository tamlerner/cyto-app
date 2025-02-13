import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/hooks/use-auth';
import { Settings, LogOut, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';

const EMOJI_OPTIONS = ['👤', '👩', '👨', '🎯', '⭐', '🌟', '💫', '✨', '🔥', '💪', '👑', '💼', '📊', '💡', '🎨'];

interface UserAvatarProps {
  email: string;
  avatar?: string;
  className?: string;
}

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

interface UserProfile {
  first_name: string;
  last_name: string;
  avatar: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ email, avatar, className }) => {
  const initial = email ? email[0].toUpperCase() : '?';
  
  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
        {avatar || initial}
      </AvatarFallback>
    </Avatar>
  );
};

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose }) => {
  return (
    <div className="grid grid-cols-5 gap-2 p-4">
      {EMOJI_OPTIONS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => {
            onSelect(emoji);
            onClose();
          }}
          className="text-2xl hover:bg-secondary p-2 rounded-md transition-colors"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default function UserDropdown() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [avatar, setAvatar] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const supabase = createClientComponentClient();

  const fetchUserProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;

      if (data) {
        setProfile(data);
        setAvatar(data.avatar);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user?.id]);

  const handleEmojiSelect = async (emoji: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar: emoji })
        .eq('user_id', user.id);

      if (error) throw error;

      setAvatar(emoji);
      toast({
        title: t('Settings.Profile.AvatarUpdateSuccess'),
        description: t('Settings.Profile.AvatarUpdateSuccessMessage'),
        className: "bg-green-50 border-green-200",
      });
      
      await fetchUserProfile();
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        title: t('Settings.Profile.AvatarUpdateError'),
        description: t('Settings.Profile.AvatarUpdateErrorMessage'),
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  const userFullName = profile && (profile.first_name || profile.last_name)
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : user.email?.split('@')[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-9 w-9 rounded-full"
          aria-label="User menu"
        >
          <UserAvatar 
            email={user.email || ''} 
            avatar={avatar} 
            className="h-9 w-9"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{userFullName}</p>
          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              {t('Settings.ChangeAvatar')}
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('Settings.SelectEmoji')}</DialogTitle>
            </DialogHeader>
            <EmojiPicker 
              onSelect={handleEmojiSelect}
              onClose={() => setIsOpen(false)}
            />
          </DialogContent>
        </Dialog>
        
        <DropdownMenuItem
          onClick={() => router.push('/settings')}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          {t('Settings.Title')}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
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