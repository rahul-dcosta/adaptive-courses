import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Create Supabase client
// Environment variables differ between web (NEXT_PUBLIC_) and mobile (EXPO_PUBLIC_)
function getSupabaseUrl(): string {
  if (typeof process !== 'undefined') {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ||
           process.env.EXPO_PUBLIC_SUPABASE_URL ||
           '';
  }
  return '';
}

function getSupabaseKey(): string {
  if (typeof process !== 'undefined') {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
           process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
           '';
  }
  return '';
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const url = getSupabaseUrl();
    const key = getSupabaseKey();

    if (!url || !key) {
      throw new Error('Supabase URL and Key must be set in environment variables');
    }

    supabaseInstance = createClient(url, key);
  }
  return supabaseInstance;
}

// Initialize with custom URL/key (useful for testing or mobile)
export function initSupabase(url: string, key: string): SupabaseClient {
  supabaseInstance = createClient(url, key);
  return supabaseInstance;
}
