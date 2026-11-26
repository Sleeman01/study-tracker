import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext.js'
import { openedFromResetLink, resetLinkErrorCode, supabase } from '../data/supabase.js'

// Keeps track of the logged-in user and shares it with the whole app.
// A "session" is Supabase's proof that you are logged in. It is saved in
// localStorage, so you stay logged in after closing the app.
export default function AuthProvider({ children }) {
  // undefined = still checking, null = logged out, object = logged in
  const [session, setSession] = useState(undefined)
  // true while the user must choose a new password (after a reset link)
  const [recovering, setRecovering] = useState(openedFromResetLink)
  const [linkError, setLinkError] = useState(resetLinkErrorCode)

  useEffect(() => {
    // 1. Is someone already logged in on this device?
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    // 2. Listen for changes: log in, log out, token renewed, reset link
    const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
      if (event === 'SIGNED_OUT') setRecovering(false)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      recovering,
      linkError,
      clearLinkError: () => setLinkError(null),
      finishRecovery: () => setRecovering(false),
    }),
    [session, recovering, linkError],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
