import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (will expand as we build)
export type Course = {
  id: string;
  user_id: string;
  topic: string;
  skill_level: string;
  goal: string;
  time_available: string;
  content: any;
  created_at: string;
  paid: boolean;
};
