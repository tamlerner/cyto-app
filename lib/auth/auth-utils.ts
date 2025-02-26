'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

// Google Sign-In
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

    if (error) {
      console.error('Google Sign-In Error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Google Sign-In Unexpected Error:', error);
    return false;
  }
}

// Check 2FA Status
export async function check2FAStatus(userId: string) {
  const supabase = createClientComponentClient();
  
  try {
    const { data, error } = await supabase
      .from('user_verification')
      .select('two_factor_enabled')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[2FA STATUS CHECK ERROR]:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { 
      success: true, 
      enabled: data?.two_factor_enabled 
    };
  } catch (error: any) {
    console.error('[2FA STATUS CHECK UNEXPECTED ERROR]:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to check 2FA status' 
    };
  }
}

// Enable 2FA
export async function enable2FA(userId: string) {
  const supabase = createClientComponentClient();
  
  try {
    const { error } = await supabase
      .from('user_verification')
      .update({ two_factor_enabled: true })
      .eq('id', userId);

    if (error) {
      console.error('[ENABLE 2FA ERROR]:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('[ENABLE 2FA UNEXPECTED ERROR]:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to enable 2FA' 
    };
  }
}

// Disable 2FA
export async function disable2FA(userId: string) {
  const supabase = createClientComponentClient();
  
  try {
    const { error } = await supabase
      .from('user_verification')
      .update({ two_factor_enabled: false })
      .eq('id', userId);

    if (error) {
      console.error('[DISABLE 2FA ERROR]:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('[DISABLE 2FA UNEXPECTED ERROR]:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to disable 2FA' 
    };
  }
}

// Check User 2FA
export async function checkUserHas2FA(userId: string) {
  const supabase = createClientComponentClient();
  
  try {
    const { data, error } = await supabase
      .from('user_verification')
      .select('two_factor_enabled')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[CHECK USER 2FA ERROR]:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { 
      success: true, 
      has2FA: data?.two_factor_enabled 
    };
  } catch (error: any) {
    console.error('[CHECK USER 2FA UNEXPECTED ERROR]:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to check user 2FA status' 
    };
  }
}

// 2FA Challenge
export async function challenge2FA() {
  const supabase = createClientComponentClient();
  
  try {
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId: 'totp'
    });

    if (error) {
      console.error('[2FA CHALLENGE ERROR]:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { 
      success: true, 
      challengeId: data.id 
    };
  } catch (error: any) {
    console.error('[2FA CHALLENGE UNEXPECTED ERROR]:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to initiate 2FA challenge' 
    };
  }
}

// Verify 2FA Login
export async function verify2FALogin(challengeId: string, code: string) {
  const supabase = createClientComponentClient();
  
  try {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId: 'totp',
      challengeId,
      code
    });

    if (error) {
      console.error('[2FA VERIFY ERROR]:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('[2FA VERIFY UNEXPECTED ERROR]:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to verify 2FA' 
    };
  }
}

// Email Sign-Up
export async function signUpWithEmail(email: string, password: string) {
  const supabase = createClientComponentClient();
  
  try {
    console.log('[SIGNUP] Starting simplified signup process...');

    // Basic signup with minimal options
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error('[SIGNUP DETAILED ERROR]', JSON.stringify(error, null, 2));
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (unexpectedError) {
    console.error('[UNEXPECTED SIGNUP ERROR]', unexpectedError);
    return { success: false, error: unexpectedError.message };
  }
}

// Send Magic Link
export async function sendMagicLink(email: string) {
  const supabase = createClientComponentClient();
  
  try {
    console.log('[MAGIC LINK] Sending magic link to', email);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('[MAGIC LINK ERROR]:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    console.log('[MAGIC LINK] Magic link sent successfully');
    return { success: true };
  } catch (error: any) {
    console.error('[MAGIC LINK UNEXPECTED ERROR]:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send magic link' 
    };
  }
}

// Resend Magic Link
export async function resendMagicLink(email: string) {
  console.log('[RESEND MAGIC LINK] Resending to', email);
  return sendMagicLink(email);
}

// Update User Profile
// Get Current User
export async function getCurrentUser() {
  const supabase = createClientComponentClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('[GET USER ERROR]:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { 
      success: true, 
      user 
    };
  } catch (error: any) {
    console.error('[GET USER UNEXPECTED ERROR]:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to get current user' 
    };
  }
}

// Update User Profile
export async function updateUserProfile(userId: string, profile: {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  country?: string;
  city?: string;
}) {
  const supabase = createClientComponentClient();
  console.log('[UPDATE PROFILE] Updating profile for user', userId);

  try {
    // Update auth.users metadata
    const { error: updateAuthError } = await supabase.auth.updateUser({
      data: profile
    });

    if (updateAuthError) {
      console.error('[AUTH UPDATE ERROR]:', updateAuthError);
      throw updateAuthError;
    }

    console.log('[UPDATE PROFILE] Auth metadata updated successfully');

    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('[PROFILE CHECK ERROR]:', checkError);
      throw checkError;
    }

    const profileUpdate = {
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      phone_number: profile.phone_number || '',
      country: profile.country || '',
      city: profile.city || ''
    };

    let profileResult;
    
    if (existingProfile) {
      // Update existing profile
      console.log('[UPDATE PROFILE] Updating existing profile');
      profileResult = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('user_id', userId);
    } else {
      // Create new profile if it doesn't exist
      console.log('[UPDATE PROFILE] Creating new profile');
      profileResult = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          avatar: '👤',
          ...profileUpdate
        });
    }

    if (profileResult.error) {
      console.error('[PROFILE UPDATE ERROR]:', profileResult.error);
      throw profileResult.error;
    }

    console.log('[UPDATE PROFILE] Profile updated successfully');
    return { success: true };
  } catch (error: any) {
    console.error('[PROFILE UPDATE CATCH ERROR]:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update profile' 
    };
  }
}