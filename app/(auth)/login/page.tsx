'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
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
import { AuthContainer } from '@/components/auth/auth-container';
import { AuthHeader } from '@/components/auth/auth-header';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
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
    <AuthContainer>
      <AuthHeader 
        title="Auth.WelcomeBack"
        description="Auth.EnterCredentials"
      />

      <div className="space-y-6">
        <GoogleAuthButton />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t('Auth.OrContinueWith')}
            </span>
          </div>
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

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? t('Auth.SigningIn') : t('Auth.SignIn')}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          {t('Auth.NoAccount')}{' '}
          <Link href="/register" className="text-primary hover:underline">
            {t('Auth.CreateAccount')}
          </Link>
        </div>
      </div>
    </AuthContainer>
  );
}