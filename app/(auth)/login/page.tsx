'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import Image from 'next/image';
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
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LoginPage() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  async function onSubmit(data: LoginFormData) {
    if (loading) return;

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
    <div className="h-full flex justify-center items-center relative">
      {/* Center - Login Form */}
      <div className="w-full h-full bg-background p-8 flex flex-col justify-between relative overflow-hidden">
        <AuthBackground expanded repeat className="absolute top-0 left-0 w-full h-full" />
        
        <motion.div 
          className="space-y-8 w-full max-w-md mx-auto relative z-10"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div 
            className="flex flex-col items-center space-y-4"
            variants={fadeIn}
          >
            <div className="mt-16 mb-4"> {/* Added space before the logo */}
              <Image
                src="/cyto-logo.png"
                alt="CYTO"
                width={60}
                height={20}
                className="dark:invert-0"
                priority
              />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                {t('Auth.WelcomeBack')} <span className="inline-block animate-bounce">👋</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('Auth.EnterCredentials')}
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="space-y-6"
            variants={fadeIn}
          >
            <div className="relative">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 bg-muted/5 border-muted/20 text-muted-foreground/70"
                disabled
              >
                <svg className="w-5 h-5 opacity-60" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Sign in with Google</span>
                <div className="absolute right-3 text-xs font-normal text-muted-foreground/50">Temporarily Disabled</div>
              </Button>
            </div>

            
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
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
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
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  className="w-full transition-all duration-200 hover:shadow-lg" 
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
                href="https://www.appcyto.com/" 
                className="text-primary hover:underline transition-colors"
                tabIndex={loading ? -1 : 0}
              >
                {t('Auth.CreateAccount')}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}