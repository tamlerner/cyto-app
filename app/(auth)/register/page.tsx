'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, Phone, Calendar, Upload, Building,
  CheckCircle, AlertCircle, ArrowRight, MapPin, Globe
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
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { generateComplexPassword } from '@/components/auth/auth-generate-password'; // Ensure this path is correct

const steps = [
  { title: 'Account', icon: User },
  { title: 'Verify', icon: Mail },
  { title: 'Details', icon: Phone },
  { title: 'Documents', icon: Upload },
  { title: 'Complete', icon: CheckCircle }
];

export default function RegisterPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
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
      password: '',
    },
  });

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const handleEmailVerification = async () => {
    try {
      setLoading(true);
      const password = generateComplexPassword();
      const { error } = await supabase.auth.signUp({
        email: form.getValues('email'),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) throw error;
      setStep(2);
      toast({
        title: "Verification email sent",
        description: "Please check your inbox",
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

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/document-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      toast({
        title: "Document uploaded",
        description: "Your document has been successfully uploaded",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Step indicators
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
            <div className={`w-10 h-10 rounded-full flex items-center justify-center
              ${isCurrent ? 'bg-primary/20' : isComplete ? 'bg-green-500/20' : 'bg-muted'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">{s.title}</span>
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
        className="w-full max-w-md space-y-8 bg-card rounded-xl shadow-lg p-8 border border-border relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Progress bar */}
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
          <form className="space-y-6">
            <motion.div
              key={step}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fadeIn}
              className="space-y-6"
            >
              {step === 1 && (
                <div className="space-y-4">
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
                  
                  <Button 
                    onClick={handleEmailVerification}
                    className="w-full h-11 mt-6 font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Verifying...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <AlertCircle className="w-6 h-6 text-primary mb-2" />
                    <p className="text-sm">
                      We've sent a verification code to your email. Please enter it below.
                    </p>
                  </div>
                  <Input
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    className="h-11 text-center text-lg tracking-wider"
                    maxLength={6}
                  />
                  <Button
                    onClick={() => setStep(3)}
                    className="w-full h-11"
                    disabled={verificationCode.length !== 6}
                  >
                    Verify Email
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
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
                            <Input {...field} className="h-11" />
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
                            <Input {...field} className="h-11" />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
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
                          <Input {...field} type="tel" className="h-11" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <Button
                    onClick={() => setStep(4)}
                    className="w-full h-11"
                  >
                    Continue
                  </Button>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Identity Document
                    </FormLabel>
                    <Input
                      type="file"
                      onChange={(e) => handleDocumentUpload(e, 'id')}
                      accept="image/*,.pdf"
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Proof of Address
                    </FormLabel>
                    <Input
                      type="file"
                      onChange={(e) => handleDocumentUpload(e, 'address')}
                      accept="image/*,.pdf"
                      className="h-11"
                    />
                  </div>

                  <Button
                    onClick={() => setStep(5)}
                    className="w-full h-11"
                  >
                    Submit Documents
                  </Button>
                </div>
              )}

              {step === 5 && (
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">Registration Complete!</h3>
                  <p className="text-muted-foreground">
                    Your documents have been submitted for verification. We will notify you once the verification is complete.
                  </p>
                  <Button asChild className="w-full h-11">
                    <Link href="/login">Continue to Login</Link>
                  </Button>
                </div>
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
  );
}