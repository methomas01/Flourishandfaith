// supabase.ts
// Supabase client initialization for Flourish & Faith
// Copy this file to your frontend project's src/ directory

import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
  )
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Export types for TypeScript (optional but recommended)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          daily_devotional_enabled: boolean
          devotional_time: string
          timezone: string
          subscription_status: string
          subscription_expires_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          daily_devotional_enabled?: boolean
          devotional_time?: string
          timezone?: string
          subscription_status?: string
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          daily_devotional_enabled?: boolean
          devotional_time?: string
          timezone?: string
          subscription_status?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string | null
          created_at: string
          updated_at: string
          archived: boolean
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          role: string
          content: string
          created_at: string
        }
      }
      devotionals: {
        Row: {
          id: string
          title: string
          scripture: string
          content: string
          reflection_prompt: string | null
          prayer: string | null
          tags: string[] | null
          publish_date: string | null
          created_at: string
          is_published: boolean
        }
      }
      prayer_requests: {
        Row: {
          id: string
          user_id: string
          request: string
          is_private: boolean
          answered: boolean
          answered_at: string | null
          answer_note: string | null
          created_at: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          current_streak: number
          longest_streak: number
          total_devotionals_completed: number
          total_conversations: number
          last_activity_date: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
