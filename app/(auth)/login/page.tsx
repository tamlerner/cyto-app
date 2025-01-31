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
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="w-1/2 bg-background p-8 flex flex-col justify-between relative overflow-hidden">
        <AuthBackground expanded repeat />
        
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
            <Image
              src="/cyto-logo.png"
              alt="CYTO"
              width={120}
              height={40}
              className="dark:invert"
              priority
            />
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
                href="/register" 
                className="text-primary hover:underline transition-colors"
                tabIndex={loading ? -1 : 0}
              >
                {t('Auth.CreateAccount')}
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="pt-8 relative z-10"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <NewsletterCarousel />
        </motion.div>
      </div>

      {/* Right side - Marketing Content */}
      <div className="w-1/2 bg-primary text-primary-foreground p-8 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        
        <motion.div 
          className="relative z-10 max-w-2xl mx-auto space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl font-light tracking-wider mb-4">
            Top Startup to watch in Angola in 2024 - Techround UK
          </h1>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Thrive Locally, Scale Globally.
            </h2>
            <p className="text-xl text-primary-foreground/80">
              Your partner for local growth and global expansion. Automate treasury, invoicing, and payroll with our business platform.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12">
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-2xl font-bold">1000+</h3>
              <p className="text-primary-foreground/80">Active Users</p>
            </motion.div>
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-2xl font-bold">$10M+</h3>
              <p className="text-primary-foreground/80">Processed Monthly</p>
            </motion.div>
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-2xl font-bold">15+</h3>
              <p className="text-primary-foreground/80">Countries Served</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}