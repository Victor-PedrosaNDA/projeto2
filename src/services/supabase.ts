import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '').trim();
const rawSupabaseAnonKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

const isValidSupabaseUrl = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(rawSupabaseUrl);
const isValidSupabaseKey = rawSupabaseAnonKey.length > 0 && !rawSupabaseAnonKey.includes('SEU-') && !rawSupabaseAnonKey.includes('SUA_') && !rawSupabaseAnonKey.includes('SEU_');

export const supabase =
  isValidSupabaseUrl && isValidSupabaseKey
    ? createClient(rawSupabaseUrl, rawSupabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;
