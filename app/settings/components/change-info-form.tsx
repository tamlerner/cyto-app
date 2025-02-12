'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AvatarSelector } from '@/components/ui/avatar-selector';

const infoSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone_number: z.string().optional(),
  avatar: z.string().optional(),
});

type InfoFormData = z.infer<typeof infoSchema>;

export function ChangeInfoForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user, userAvatar, updateAvatar } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<InfoFormData>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
      avatar: userAvatar,
    },
  });

  async function onSubmit(data: InfoFormData) {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
        },
      });

      if (error) throw error;

      if (data.avatar && data.avatar !== userAvatar) {
        await updateAvatar(data.avatar);
      }

      toast({
        title: t('Settings.InfoUpdateSuccess'),
      });
      
      form.reset(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('Settings.InfoUpdateError'),
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Settings.ProfilePicture')}</FormLabel>
              <FormControl>
                <AvatarSelector
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Settings.FirstName')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Settings.LastName')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Settings.PhoneNumber')}</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? t('Settings.Updating') : t('Settings.UpdateInfo')}
        </Button>
      </form>
    </Form>
  );
}