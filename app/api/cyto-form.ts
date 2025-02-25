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

  try {
    // Parse the form data from the request body
    console.log('Raw request body:', req.body);
    
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
    
    // Send magic link with form data in the metadata
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: 'https://web.appcyto.com/auth/callback',
        data: {
          // Include form data in the metadata
          first_name,
          last_name,
          company_name,
          company_website,
          team_size,
          source: 'cyto_framer_form'
        }
      }
    });
    
    if (error) {
      console.error('Error sending magic link:', error);
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Magic link sent successfully. Please check your email to complete registration.'
    });
    
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}