'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, Phone, Upload, Building,
  CheckCircle, AlertCircle, ArrowRight, UserCircle2,
  Loader2
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggle } from '@/components/theme-toggle';
import { CytoTitle } from '@/components/ui/cyto-title';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { 
  signUpWithEmail,
  sendMagicLink,
  resendMagicLink,
  updateUserProfile,
  handleGoogleSignIn 
} from '@/lib/auth/auth-utils';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';

const steps = [
  { title: 'Account', icon: User, description: 'Create your account' },
  { title: 'Verify', icon: Mail, description: 'Verify your email' },
  { title: 'Done', icon: CheckCircle, description: 'Ready to go!' }
];

export default function RegisterPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  
  const progress = (step / steps.length) * 100;

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      countryCode: '+244',
      country: '', // Add this
      city: '', // Add this
      password: '',
      confirmPassword: '',
    },
  });

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const handleGoogleSignInClick = async () => {
    const success = await handleGoogleSignIn(`${window.location.origin}/auth/callback`);
    if (!success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign in with Google"
      });
    }
  };

  const handleEmailVerification = async () => {
    try {
      const formData = form.getValues();
      
      // Validate all required fields are filled
      if (!formData.firstName || !formData.lastName || !formData.country || !formData.city) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields"
        });
        return;
      }
  
      setLoading(true);
      
      // First sign up the user
      const signUpResult = await signUpWithEmail(formData.email, formData.password);
      if (!signUpResult.success) throw new Error(signUpResult.error);
  
      // Then update their profile
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
  
      const profileResult = await updateUserProfile(user?.id, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        country: formData.country,
        city: formData.city
      });
  
      if (!profileResult.success) throw new Error(profileResult.error);
  
      // Finally send the magic link
      const magicLinkResult = await sendMagicLink(formData.email);
      if (!magicLinkResult.success) throw new Error(magicLinkResult.error);
  
      setStep(2);
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link",
        duration: 5000
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      const email = form.getValues('email');
      const result = await resendMagicLink(email);
      
      if (!result.success) throw new Error(result.error);
      
      toast({
        title: "Email resent",
        description: "Please check your inbox for the verification link",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    try {
      setLoading(true);
      const formData = form.getValues();
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const result = await updateUserProfile(user?.id, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber
      });

      if (!result.success) throw new Error(result.error);

      setStep(4);
      toast({
        title: "Profile completed",
        description: "Your account is now ready to use",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex justify-between mb-8">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const isCurrent = i + 1 === step;
        const isComplete = i + 1 < step;
        return (
          <motion.div 
            key={i}
            className={`flex flex-col items-center gap-2
              ${isCurrent ? 'text-primary' : isComplete ? 'text-green-500' : 'text-muted-foreground'}`}
            initial={false}
            animate={{ scale: isCurrent ? 1.1 : 1 }}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center
              ${isCurrent ? 'bg-primary/20 ring-2 ring-primary' : 
                isComplete ? 'bg-green-500/20 ring-2 ring-green-500' : 
                'bg-muted'}`}>
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium">{s.title}</span>
            <span className="text-[10px] text-muted-foreground hidden md:block">
              {s.description}
            </span>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
      <div className="fixed top-4 right-4 flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <motion.div 
        className="w-full max-w-2xl space-y-8 bg-card rounded-xl shadow-lg p-8 border border-border relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 left-0 w-full">
          <Progress value={progress} className="h-1" />
        </div>

        <div className="flex flex-col items-center justify-center text-center mb-8">
          <CytoTitle size="lg" className="mb-6" />
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('Auth.CreateAccount')}
          </h2>
          <p className="text-sm text-muted-foreground mt-3">
            {t('Auth.EnterCredentials')}
          </p>
        </div>

        <StepIndicator />

        <Form {...form}>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <motion.div
              key={step}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fadeIn}
              className="space-y-6"
            >
              {step === 1 && (
                <Card>
                  <CardContent className="space-y-6 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 font-medium"
                      onClick={handleGoogleSignInClick}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                          <path
                            fill="#FFC107"
                            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                          />
                          <path
                            fill="#FF3D00"
                            d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                          />
                          <path
                            fill="#4CAF50"
                            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                          />
                          <path
                            fill="#1976D2"
                            d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                          />
                        </svg>
                        Continue with Google
                      </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Or continue with email
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Personal Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {t('Auth.FirstName')}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className="h-11" placeholder="First name" />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {t('Auth.LastName')}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className="h-11" placeholder="Last name" />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Location Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium flex items-center gap-2">
                                <Building className="w-4 h-4" />
                                {t('Auth.Country')}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className="h-11" placeholder="Country" />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium flex items-center gap-2">
                                <Building className="w-4 h-4" />
                                {t('Auth.City')}
                              </FormLabel>
                              <FormControl>
                                <Input {...field} className="h-11" placeholder="City" />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Contact Information */}
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {t('Auth.Phone')}
                            </FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" className="h-11" placeholder="Phone number" />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      {/* Email & Password */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {t('Auth.Email')}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                type="email"
                                className="h-11"
                                placeholder="Enter your email"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              {t('Auth.Password')}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                type="password"
                                className="h-11"
                                placeholder="Create a strong password"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              {t('Auth.ConfirmPassword')}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                type="password"
                                className="h-11"
                                placeholder="Confirm your password"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      onClick={handleEmailVerification}
                      className="w-full h-11 font-medium"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Verifying...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardContent className="space-y-6 pt-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <AlertCircle className="w-6 h-6 text-primary mb-2" />
                      <p className="text-sm text-foreground">
                        We've sent a verification link to your email. Please check your inbox and click the link to verify your account.
                      </p>
                    </div>
                    <Button
                      onClick={handleResendEmail}
                      className="w-full h-11"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </div>
                      ) : (
                        'Resend verification email'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardContent className="space-y-6 pt-6 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Registration Complete!</h3>
                      <p className="text-muted-foreground">
                        Your account has been created and verified successfully.
                      </p>
                    </div>
                    <Button asChild className="w-full h-11">
                      <Link href="/login">Continue to Login</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </form>
        </Form>

        {step === 1 && (
          <div className="text-center text-sm pt-4 border-t border-border">
            {t('Auth.HaveAccount')}{' '}
            <Link 
              href="/login" 
              className="text-primary hover:underline font-medium transition-colors"
            >
              {t('Auth.SignIn')}
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}