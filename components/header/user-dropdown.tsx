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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';

// Available emoji list
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

const UserDropdown: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [avatar, setAvatar] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const supabase = createClientComponentClient();

  const fetchAvatar = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching avatar:', error);
        return;
      }

      console.log('Fetched avatar:', data?.avatar);
      if (data?.avatar) {
        setAvatar(data.avatar);
      }
    } catch (error) {
      console.error('Error in fetchAvatar:', error);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, [user?.id]);

  const handleEmojiSelect = async (emoji: string) => {
    if (!user?.id) return;

    try {
      console.log('Updating avatar to:', emoji);
      const { error } = await supabase
        .from('profiles')
        .update({ avatar: emoji })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating avatar:', error);
        toast({
          title: "Error",
          description: "Failed to update avatar",
          variant: "destructive",
        });
        return;
      }

      console.log('Successfully updated avatar');
      setAvatar(emoji);
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
      
      // Force refresh avatar
      await fetchAvatar();
    } catch (error) {
      console.error('Error in handleEmojiSelect:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

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
      <DropdownMenuContent align="end" className="w-56">
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
};

export default UserDropdown;