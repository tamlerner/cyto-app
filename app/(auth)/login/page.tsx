'use client';

import { useState, useEffect } from 'react';
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
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import NewsletterCarousel from '@/components/newsletter-carousel';
import { AuthBackground } from '@/components/auth/auth-background';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize form
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Set client-side rendering flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  async function onSubmit(data: LoginFormData) {
    if (loading) return;

    try {
      setLoading(true);
      await signIn(data.email, data.password);
      // Successful login will be handled by useAuth hook's redirect
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
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="w-1/2 bg-background p-8 flex flex-col justify-between relative overflow-hidden">
        <AuthBackground expanded repeat />
        
        <div className="space-y-8 w-full max-w-md mx-auto relative z-10">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">CYTO</h1>
            <h2 className="text-2xl font-semibold tracking-tight">
              {t('Auth.WelcomeBack')} <span className="animate-wave">👋</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('Auth.EnterCredentials')}
            </p>
          </div>

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
                          disabled={loading}
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
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  className="w-full" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? t('Auth.SigningIn') : t('Auth.SignIn')}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm">
              {t('Auth.NoAccount')}{' '}
              <Link 
                href="/register" 
                className="text-primary hover:underline"
                tabIndex={loading ? -1 : 0}
              >
                {t('Auth.CreateAccount')}
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 relative z-10">
          <NewsletterCarousel />
        </div>
      </div>

      {/* Right side - Marketing Content */}
      <div className="w-1/2 bg-primary text-primary-foreground p-8 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <h1 className="text-4xl font-light tracking-wider mb-4">
            Top Startup to watch in Angola in 2024 - Techround UK
          </h1>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              Thrive Locally, Scale Globally.
            </h2>
            <p className="text-xl text-primary-foreground/80">
              Your partner for local growth and global expansion. Automate treasury, invoicing, and payroll with our business platform.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">1000+</h3>
              <p className="text-primary-foreground/80">Active Users</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">$10M+</h3>
              <p className="text-primary-foreground/80">Processed Monthly</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">15+</h3>
              <p className="text-primary-foreground/80">Countries Served</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}