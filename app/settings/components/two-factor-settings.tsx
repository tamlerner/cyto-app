'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Shield, Loader2, QrCode, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export function TwoFactorSettings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [is2FAEnabled, set2FAEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    check2FAStatus();
  }, []);

  const check2FAStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_verification')
        .select('two_factor_enabled')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      set2FAEnabled(!!data?.two_factor_enabled);
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  };

  const handle2FASetup = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });

      if (error) throw error;

      setQrCode(data.totp.qr_code);
      setShowSetup(true);
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
    try {
      setLoading(true);
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: 'totp'
      });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: 'totp',
        challengeId: challenge.id,
        code: verificationCode
      });

      if (verifyError) throw verifyError;

      // Update user_verification table
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error: updateError } = await supabase
        .from('user_verification')
        .update({ two_factor_enabled: true })
        .eq('id', user.id);

      if (updateError) throw updateError;

      set2FAEnabled(true);
      setShowSetup(false);
      setVerificationCode('');
      
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled for your account"
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

  const handleDisable2FA = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Disable MFA
      const { error: mfaError } = await supabase.auth.mfa.unenroll({
        factorId: 'totp'
      });

      if (mfaError) throw mfaError;

      // Update user_verification table
      const { error: updateError } = await supabase
        .from('user_verification')
        .update({ two_factor_enabled: false })
        .eq('id', user.id);

      if (updateError) throw updateError;

      set2FAEnabled(false);
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled"
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication (2FA)
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account by requiring both a password and an authentication code.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showSetup ? (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">
                {is2FAEnabled ? '2FA is enabled' : '2FA is disabled'}
              </p>
              <p className="text-sm text-muted-foreground">
                {is2FAEnabled 
                  ? 'Your account is protected with two-factor authentication.' 
                  : 'Enable 2FA for additional security.'}
              </p>
            </div>
            <Button
              variant={is2FAEnabled ? "destructive" : "default"}
              onClick={is2FAEnabled ? handleDisable2FA : handle2FASetup}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {qrCode && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="mb-4">
                    <h4 className="font-medium">Scan QR Code</h4>
                    <p className="text-sm text-muted-foreground">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <img src={qrCode} alt="2FA QR Code" className="h-48 w-48" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4" />
                    <label className="text-sm font-medium">
                      Enter verification code:
                    </label>
                  </div>
                  <Input
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="000000"
                    className="font-mono text-center text-lg tracking-wider"
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleVerify}
                    disabled={loading || verificationCode.length !== 6}
                    className="flex-1"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify & Enable
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSetup(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}