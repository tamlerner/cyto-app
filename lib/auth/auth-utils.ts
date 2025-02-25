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

// Email Sign-Up
export async function signUpWithEmail(email: string, password: string) {
  const supabase = createClientComponentClient();
  
  try {
    // Input validation
    if (!email) {
      console.error('[SIGNUP] Email is required');
      return { 
        success: false, 
        error: 'Email is required' 
      };
    }

    if (!password || password.length < 6) {
      console.error('[SIGNUP] Password is too short');
      return { 
        success: false, 
        error: 'Password must be at least 6 characters' 
      };
    }

    // Signup attempt
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    // Error handling
    if (error) {
      console.error('[SIGNUP ERROR]', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    // Verify user creation
    if (!data.user) {
      console.error('[SIGNUP] No user object created');
      return { 
        success: false, 
        error: 'User creation failed' 
      };
    }

    // Profile creation
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,  // Use auth user's ID as profile ID
          user_id: data.user.id,  // Explicitly set user_id
          email: email,
          avatar: '👤'
        });

      if (profileError) {
        console.error('[PROFILE INSERT ERROR]', profileError);
        return {
          success: false,
          error: profileError.message
        };
      }
    } catch (profileInsertError) {
      console.error('[PROFILE INSERT CATCH ERROR]', profileInsertError);
      return {
        success: false,
        error: 'Failed to create profile'
      };
    }

    return { 
      success: true, 
      user: data.user 
    };
  } catch (unexpectedError: any) {
    console.error('[UNEXPECTED SIGNUP ERROR]', unexpectedError);
    return { 
      success: false, 
      error: unexpectedError.message 
    };
  }
}

// Send Magic Link
export async function sendMagicLink(email: string) {
  const supabase = createClientComponentClient();
  
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Magic Link Error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Magic Link Unexpected Error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send magic link' 
    };
  }
}

// Resend Magic Link
export async function resendMagicLink(email: string) {
  return sendMagicLink(email);
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

  try {
    // Update auth.users metadata if needed
    const { error: updateAuthError } = await supabase.auth.updateUser({
      data: profile
    });

    if (updateAuthError) {
      console.error('Auth Update Error:', updateAuthError);
      throw updateAuthError;
    }

    // Update profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        country: profile.country || '',
        city: profile.city || ''
      })
      .eq('user_id', userId);

    if (profileError) {
      console.error('Profile Update Error:', profileError);
      throw profileError;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Profile Update Catch Error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update profile' 
    };
  }
}

// Get Current User
export async function getCurrentUser() {
  const supabase = createClientComponentClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Get User Error:', error);
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
    console.error('Get User Unexpected Error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to get current user' 
    };
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
      console.error('2FA Status Check Error:', error);
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
    console.error('2FA Status Check Unexpected Error:', error);
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
      console.error('Enable 2FA Error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Enable 2FA Unexpected Error:', error);
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
      console.error('Disable 2FA Error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Disable 2FA Unexpected Error:', error);
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
      console.error('Check User 2FA Error:', error);
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
    console.error('Check User 2FA Unexpected Error:', error);
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
      console.error('2FA Challenge Error:', error);
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
    console.error('2FA Challenge Unexpected Error:', error);
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
      console.error('2FA Verify Error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('2FA Verify Unexpected Error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to verify 2FA' 
    };
  }
}