'use client';

import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import { useToast } from '@/hooks/use-toast';
import { signOutUser } from './session';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (mounted) {
            setSession(newSession);
            setUser(newSession?.user ?? null);

            if (event === 'SIGNED_OUT') {
              router.push('/login');
            } else if (event === 'TOKEN_REFRESHED') {
              // Handle successful token refresh
              console.log('Auth token refreshed successfully');
            }
          }
        });

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUser(null);
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();
  }, [router]);

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async function signUp(email: string, password: string) {
    try {
      setLoading(true);
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email_confirmed: true
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error('Failed to create user');

      toast({
        title: 'Account created successfully',
        description: 'You can now sign in with your credentials'
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      // Clear state first for better UX
      setUser(null);
      setSession(null);
      
      // Sign out and clean up
      await signOutUser();
      
      // Force navigation to login
      router.replace('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, clear state and redirect
      setUser(null);
      setSession(null);
      router.replace('/login');
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}