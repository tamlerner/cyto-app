'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase/client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface UserProfile {
  first_name: string;
  last_name: string;
  phone_number: string;
  country: string;
  city: string;
}

export function UserProfileForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    first_name: '',
    last_name: '',
    phone_number: '',
    country: '',
    city: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone_number: data.phone_number || '',
          country: data.country || '',
          city: data.city || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone_number: profile.phone_number,
          country: profile.country,
          city: profile.city,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: t('Settings.Profile.SaveSuccess'),
        description: t('Settings.Profile.SaveSuccessMessage'),
        variant: "default",
        className: "border-green-500 bg-green-50",
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      
      toast({
        title: t('Settings.Profile.SaveError'),
        description: t('Settings.Profile.SaveErrorMessage'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">{t('Settings.Profile.FirstName')}</Label>
          <Input
            id="first_name"
            name="first_name"
            value={profile.first_name}
            onChange={handleChange}
            placeholder={t('Settings.Profile.EnterFirstName')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">{t('Settings.Profile.LastName')}</Label>
          <Input
            id="last_name"
            name="last_name"
            value={profile.last_name}
            onChange={handleChange}
            placeholder={t('Settings.Profile.EnterLastName')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number">{t('Settings.Profile.PhoneNumber')}</Label>
          <Input
            id="phone_number"
            name="phone_number"
            value={profile.phone_number}
            onChange={handleChange}
            placeholder={t('Settings.Profile.EnterPhoneNumber')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">{t('Settings.Profile.Country')}</Label>
          <Input
            id="country"
            name="country"
            value={profile.country}
            onChange={handleChange}
            placeholder={t('Settings.Profile.EnterCountry')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">{t('Settings.Profile.City')}</Label>
          <Input
            id="city"
            name="city"
            value={profile.city}
            onChange={handleChange}
            placeholder={t('Settings.Profile.EnterCity')}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full md:w-auto">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t('Settings.Profile.SaveChanges')}
      </Button>
    </form>
  );
}