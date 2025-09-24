import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL='https://suttpcovwugbqtghzkpq.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1dHRwY292d3VnYnF0Z2h6a3BxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MTU5MzcsImV4cCI6MjA2MTQ5MTkzN30.h6SEkGv4EsCbUa0Pcx6Sc3eQ78sSlZ0L39g_zbueDRU'


if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  export const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  // export async function signInWithEmail(email: string, password: string) {
  //   const { data, error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   })
  //   if (error) {
  //     if (error instanceof AuthError) {
  //       throw new Error('Invalid login credentials')
  //     }
  //     throw error
  //   }
  //   return data
  // }
  
  // export async function signOut() {
  //   const { error } = await supabase.auth.signOut()
  //   if (error) throw error
  // }
  
  // export async function getCurrentUser(): Promise<User | null> {
  //   const { data: { user } } = await supabase.auth.getUser()
  //   return user
  // }
  
  // export async function registerUser(email: string, password: string) {
  //   const { data, error } = await supabase.auth.signUp({
  //     email,
  //     password,
  //   })
  //   if (error) {
  //     throw error
  //   }
  //   return data
  // }
  
  