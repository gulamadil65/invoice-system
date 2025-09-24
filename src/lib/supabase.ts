import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gfxaishdqfmlugnxmhms.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeGFpc2hkcWZtbHVnbnhtaG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1OTAzMTIsImV4cCI6MjA1MDE2NjMxMn0.G897GcuY-MsTFSuzsf3gDkq8DcI1dbfcDVitFgWNb_0'


if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
  
  // Function to sign in anonymously
  export async function signInAnonymously() {
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) {
      console.error('Error signing in anonymously:', error)
      throw error
    }
    return data
  }
  
  