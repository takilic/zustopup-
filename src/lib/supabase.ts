import { createClient } from '@supabase/supabase-js';

// These should be configured in .env
// We use a safe fallback for type-checking, but we'll check validity in usage
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isPlaceholder = !rawUrl || rawUrl.includes('placeholder');
const supabaseUrl = rawUrl || 'https://none.supabase.co';
const supabaseAnonKey = rawKey || 'none';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Extra helper to check if real Supabase is ready
export const isSupabaseConfigured = !isPlaceholder;

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
      }
      game_packages: {
        Row: {
          id: string
          game_name: string
          package_name: string
          price: number
          bonus_info: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          game_name: string
          player_id: string
          package_id: string
          amount_paid: number
          payment_method: string
          transaction_id: string | null
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          created_at: string
        }
      }
    }
  }
}
