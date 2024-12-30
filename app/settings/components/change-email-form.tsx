'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase/client';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password is required'),
});

type EmailFormData = z.infer<typeof emailSchema>;

export function ChangeEmailForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user?.email || '',
      password: '',
    },
  });

  async function onSubmit(data: EmailFormData) {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ 
        email: data.email 
      });

      if (error) throw error;

      toast({
        title: t('Settings.EmailUpdateSuccess'),
      });
      
      form.reset({ email: data.email, password: '' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('Settings.EmailUpdateError'),
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Settings.NewEmail')}</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Settings.CurrentPassword')}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? t('Settings.Updating') : t('Settings.UpdateEmail')}
        </Button>
      </form>
    </Form>
  );
}