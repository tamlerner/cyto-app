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
  user_id?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse the form data from the request body
    const { first_name, last_name, email, company_name, company_website, team_size } = req.body as FormData
    
    // Create Supabase client using your provided credentials
    const supabaseUrl = 'https://ovjhjskagglsdkmlwnjx.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92amhqc2thZ2dsc2RrbWx3bmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMzA3NTYsImV4cCI6MjA1MDYwNjc1Nn0.dOmo-s115cvaRz3oabspaAoOx0PvA8LCshMSd9_8b0c'
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Create a user with the provided email
    const password = Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-2)
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    
    if (authError) {
      console.error('Auth error:', authError)
      return res.status(400).json({ error: authError.message })
    }
    
    if (!authData?.user?.id) {
      return res.status(400).json({ error: 'Failed to create user' })
    }
    
    // The profile is automatically created by your trigger
    // Now update it with the form data
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: first_name,
        last_name: last_name,
        // Add any additional fields you want to update
      })
      .eq('user_id', authData.user.id)
    
    if (updateError) {
      console.error('Update error:', updateError)
      return res.status(400).json({ error: updateError.message })
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Registration successful!',
      user_id: authData.user.id 
    })
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}