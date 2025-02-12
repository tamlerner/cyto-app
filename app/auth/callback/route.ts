// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      // Exchange code for session
      const { data: { user } } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!user) {
        throw new Error('No user found');
      }

      // Check if user has already setup 2FA
      const { data: verificationData } = await supabase
        .from('user_verification')
        .select('two_factor_enabled')
        .eq('id', user.id)
        .single();

      // If user hasn't made a 2FA choice yet, redirect to setup
      if (!verificationData?.two_factor_enabled) {
        return NextResponse.redirect(new URL('/auth/setup-2fa', requestUrl.origin));
      }

      // If 2FA is already set up or explicitly disabled, go to dashboard
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.redirect(new URL('/login', requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL('/login', requestUrl.origin));
}