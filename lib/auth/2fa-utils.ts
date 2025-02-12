'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import QRCode from 'qrcode';

export async function generateTOTP(userId: string) {
  const supabase = createClientComponentClient();
  
  try {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp'
    });

    if (error) throw error;

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(data.totp.qr_code);

    return { 
      success: true, 
      qrCode: qrCodeUrl,
      secret: data.totp.secret,
      uri: data.totp.uri
    };
  } catch (error: any) {
    console.error('Error generating TOTP:', error);
    return { success: false, error: error.message };
  }
}

export async function verifyTOTP(code: string) {
  const supabase = createClientComponentClient();
  
  try {
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId: 'totp'
    });

    if (error) throw error;

    const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
      factorId: 'totp',
      challengeId: data.id,
      code
    });

    if (verifyError) throw verifyError;

    return { success: true };
  } catch (error: any) {
    console.error('Error verifying TOTP:', error);
    return { success: false, error: error.message };
  }
}

export async function setup2FA(userId: string, enable: boolean) {
  const supabase = createClientComponentClient();
  
  try {
    const { error } = await supabase
      .from('user_verification')
      .update({ 
        two_factor_enabled: enable,
        verification_status: enable ? 'two_factor_enabled' : 'two_factor_skipped'
      })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error setting up 2FA:', error);
    return { success: false, error: error.message };
  }
}