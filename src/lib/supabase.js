// supabase.js
// Supabase client for Flourish & Faith
// Returns null gracefully if env vars are not set (localStorage fallback is used instead)

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  } catch (e) {
    console.error('[Flourish & Faith] Supabase init failed:', e.message)
    console.warn('[Flourish & Faith] Check that VITE_SUPABASE_URL is a valid https:// URL from your Supabase project settings.')
  }
} else {
  console.warn(
    '[Flourish & Faith] Supabase env vars not set. Auth and cloud sync are disabled. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable them.'
  )
}

export { supabase }
