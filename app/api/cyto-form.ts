import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

type FormData = {
  first_name: string
  last_name: string
  email: string
  company_name: string
  company_website: string
  team_size: string
}

type ResponseData = {
  success?: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('API endpoint hit with method:', req.method);
  console.log('Raw request body:', JSON.stringify(req.body, null, 2));

  try {
    // Parse the form data from the request body
    const { first_name, last_name, email, company_name, company_website, team_size } = req.body as FormData;
    
    console.log('Parsed form data:', { first_name, last_name, email, company_name, company_website, team_size });
    
    // Validate required fields
    if (!email) {
      console.log('Validation failed: Missing email');
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Create Supabase client
    const supabaseUrl = 'https://ovjhjskagglsdkmlwnjx.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92amhqc2thZ2dsc2RrbWx3bmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMzA3NTYsImV4cCI6MjA1MDYwNjc1Nn0.dOmo-s115cvaRz3oabspaAoOx0PvA8LCshMSd9_8b0c';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Create a random password for the user
    const password = Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-2);
    
    // Sign up a new user with email/password
    console.log('Signing up new user with email:', email);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          // Add user metadata
          first_name,
          last_name,
          company_name,
          company_website,
          team_size,
          source: 'framer_form'
        }
      }
    });
    
    if (signUpError) {
      console.error('Sign up error:', signUpError);
      return res.status(400).json({ error: signUpError.message });
    }
    
    if (!signUpData?.user?.id) {
      return res.status(400).json({ error: 'Failed to create user' });
    }
    
    console.log('User created with ID:', signUpData.user.id);
    
    // No need to update the profile as the trigger will create it
    // Your RLS trigger should already create a profile with first_name and last_name
    // from the user metadata
    
    // Send a confirmation email - using the built-in email that Supabase sends on signup
    console.log('Signup confirmation email sent automatically by Supabase');
    
    // Respond with success
    return res.status(200).json({ 
      success: true, 
      message: 'Registration successful. Please check your email for verification.'
    });
    
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}