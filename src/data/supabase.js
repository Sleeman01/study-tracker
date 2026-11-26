import { createClient } from '@supabase/supabase-js'

// The ONE Supabase client for the whole app. Every file that talks to
// Supabase imports `supabase` from here, so there is only one connection
// and one place that knows who is logged in.
//
// The two values come from .env.local (never committed to git).
// Vite only gives the app variables whose names start with VITE_.
// That is safe here: the "anon" / publishable key is meant to be public.
// What protects the data is Row Level Security in the database
// (see supabase/schema.sql). Never put the service_role / secret key here.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Missing Supabase settings. Copy .env.example to .env.local and fill in ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart `npm run dev`.',
  )
}

// When you tap the link in a "reset password" email, the app opens with
// extra info after a # in the address, like "#access_token=...&type=recovery".
// Supabase reads it and then removes it, so we note what it said FIRST
// (this line runs before createClient below).
const linkInfo = new URLSearchParams(globalThis.location?.hash.slice(1) ?? '')
export const openedFromResetLink = linkInfo.get('type') === 'recovery'
// e.g. "otp_expired" when an old reset link is used
export const resetLinkErrorCode = linkInfo.get('error_code')

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true, // stay logged in after closing the app
    autoRefreshToken: true, // quietly renew the login before it expires
    detectSessionInUrl: true, // read the login from "reset password" email links
  },
})
