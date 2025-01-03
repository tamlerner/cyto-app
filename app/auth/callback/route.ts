// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/supabase/types';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => Promise.resolve(cookieStore)
    });

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      console.log('Exchange result:', { data, error });
      
      if (!error) {
        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
      }
    }

    return NextResponse.redirect(new URL('/login', requestUrl.origin));
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}