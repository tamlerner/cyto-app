'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function handleGoogleSignIn(redirectTo: string) {
  try {
    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = createClientComponentClient();
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    if (error) throw error;

    // Only try to create verification record if we have a user
    if (data?.user?.id) {
      // Wait briefly for auth.users to be updated
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        await supabase
          .from('user_verification')
          .insert({
            id: data.user.id,
            email_verified: false,
            verification_status: 'pending'
          });
      } catch (verificationError) {
        // Log but don't throw - user is still created
        console.log('Verification record creation deferred:', verificationError);
      }
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Error signing up:', error);
    return { success: false, error: error.message };
  }
}

export async function sendMagicLink(email: string) {
  const supabase = createClientComponentClient();
  
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error sending magic link:', error);
    return { success: false, error: error.message };
  }
}

export async function resendMagicLink(email: string) {
  return sendMagicLink(email);
}

export const updateUserProfile = async (userId: string, profileData: {
  first_name: string;
  last_name: string;
  phone_number: string;
  country: string;
  city: string;
}) => {
  try {
    const supabase = createClientComponentClient();
    
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone_number: profileData.phone_number,
        country: profileData.country,
        city: profileData.city,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCurrentUser() {
  const supabase = createClientComponentClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { success: true, user };
  } catch (error: any) {
    console.error('Error getting user:', error);
    return { success: false, error: error.message };
  }
}

export async function check2FAStatus(userId: string) {
  const supabase = createClientComponentClient();
  
  try {
    const { data, error } = await supabase
      .from('user_verification')
      .select('two_factor_enabled')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { success: true, enabled: data?.two_factor_enabled };
  } catch (error: any) {
    console.error('Error checking 2FA status:', error);
    return { success: false, error: error.message };
  }
}

export async function enable2FA(userId: string) {
  const supabase = createClientComponentClient();
  
  try {
    const { error } = await supabase
      .from('user_verification')
      .update({ two_factor_enabled: true })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error enabling 2FA:', error);
    return { success: false, error: error.message };
  }
}

export async function disable2FA(userId: string) {
  const supabase = createClientComponentClient();
  
  try {
    const { error } = await supabase
      .from('user_verification')
      .update({ two_factor_enabled: false })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error disabling 2FA:', error);
    return { success: false, error: error.message };
  }
}

export async function checkUserHas2FA(userId: string) {
  const supabase = createClientComponentClient();
  
  try {
    const { data, error } = await supabase
      .from('user_verification')
      .select('two_factor_enabled')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { success: true, has2FA: data?.two_factor_enabled };
  } catch (error: any) {
    console.error('Error checking 2FA status:', error);
    return { success: false, error: error.message };
  }
}

export async function challenge2FA() {
  const supabase = createClientComponentClient();
  
  try {
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId: 'totp'
    });

    if (error) throw error;
    return { success: true, challengeId: data.id };
  } catch (error: any) {
    console.error('Error initiating 2FA challenge:', error);
    return { success: false, error: error.message };
  }
}

export async function verify2FALogin(challengeId: string, code: string) {
  const supabase = createClientComponentClient();
  
  try {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId: 'totp',
      challengeId,
      code
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error verifying 2FA:', error);
    return { success: false, error: error.message };
  }
}