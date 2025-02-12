'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CytoTitle } from '@/components/ui/cyto-title';
import { challenge2FA, verify2FALogin } from '@/lib/auth/auth-utils';

export default function Verify2FAPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);

  // Initiate 2FA challenge when page loads
  React.useEffect(() => {
    initiate2FAChallenge();
  }, []);

  const initiate2FAChallenge = async () => {
    const result = await challenge2FA();
    if (result.success) {
      setChallengeId(result.challengeId);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate 2FA verification"
      });
      router.push('/login');
    }
  };

  const handleVerify = async () => {
    if (!challengeId) return;
    
    setLoading(true);
    try {
      const result = await verify2FALogin(challengeId, code);
      
      if (!result.success) throw new Error('Invalid verification code');

      toast({
        title: "Verification successful",
        description: "Redirecting to dashboard..."
      });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
      setCode('');
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
            Two-Factor Verification
          </h2>
        </div>

        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground mt-2">
                Enter the verification code from your authenticator app
              </p>
            </div>

            <div className="space-y-4">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                className="text-center text-lg tracking-wider font-mono h-12"
                maxLength={6}
              />

              <Button
                onClick={handleVerify}
                className="w-full h-11"
                disabled={loading || code.length !== 6}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  'Verify'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}