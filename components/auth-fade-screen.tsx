'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FileText } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
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
import { LanguageSelector } from './language-selector';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function AuthFadeScreen() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      setLoading(true);
      await signIn(data.email, data.password);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('Auth.LoginError'),
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-lg space-y-6">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-8 w-8" />
            <h1 className="text-3xl font-bold">CYTO</h1>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('Auth.WelcomeBack')} <span className="animate-wave">👋</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {t('Auth.EnterCredentials')}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Auth.Email')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      {...field}
                    />
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
                  <FormLabel>{t('Auth.Password')}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full mt-6" type="submit" disabled={loading}>
              {loading ? t('Auth.SigningIn') : t('Auth.SignIn')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}