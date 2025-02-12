'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Loader2, Smartphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CytoTitle } from '@/components/ui/cyto-title';
import { generateTOTP, verifyTOTP, setup2FA } from '@/lib/auth/2fa-utils';

export default function Setup2FAPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'intro' | 'setup' | 'verify'>('intro');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const supabase = createClientComponentClient();

  const handleStartSetup = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const result = await generateTOTP(user.id);
      if (!result.success) throw new Error(result.error);

      setQrCode(result.qrCode);
      setSecret(result.secret);
      setStep('setup');
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

  const handleVerify = async () => {
    setLoading(true);
    try {
      const result = await verifyTOTP(verificationCode);
      if (!result.success) throw new Error(result.error);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      await setup2FA(user.id, true);

      toast({
        title: "2FA Enabled",
        description: "Your account is now protected with two-factor authentication",
      });

      setStep('verify');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
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

  const skipSetup = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      await setup2FA(user.id, false);

      toast({
        title: "2FA Skipped",
        description: "You can enable 2FA later in your account settings",
      });
      
      router.push('/dashboard');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <CytoTitle size="lg" className="mb-6" />
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Two-Factor Authentication
          </h2>
        </div>

        <Card>
          <CardContent className="space-y-6 pt-6">
            {step === 'intro' && (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Protect your account with two-factor authentication
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg text-sm">
                    <h3 className="font-medium mb-2">You'll need:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        An authenticator app (Google Authenticator, Authy, etc.)
                      </li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleStartSetup}
                    className="w-full h-11"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Starting setup...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Start Setup
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={skipSetup}
                    className="w-full h-11"
                    disabled={loading}
                  >
                    Skip for now
                  </Button>
                </div>
              </>
            )}

            {step === 'setup' && qrCode && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Scan QR Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Scan this QR code with your authenticator app
                  </p>
                </div>

                <div className="flex justify-center">
                  <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                </div>

                {secret && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Or enter this code manually:
                    </p>
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                      {secret}
                    </code>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Enter verification code:
                    </label>
                    <Input
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="000000"
                      className="text-center text-lg tracking-wider font-mono"
                      maxLength={6}
                    />
                  </div>

                  <Button
                    onClick={handleVerify}
                    className="w-full h-11"
                    disabled={loading || verificationCode.length !== 6}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying...
                      </div>
                    ) : (
                      'Verify Code'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === 'verify' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold">Setup Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  Two-factor authentication has been enabled for your account
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}