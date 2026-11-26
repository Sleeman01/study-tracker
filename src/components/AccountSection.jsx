import { useState } from 'react'
import { useAuth } from '../auth/AuthContext.js'
import { supabase } from '../data/supabase.js'
import { friendlyAuthError } from '../auth/authErrors.js'

// "Logged in as ..." and the Log out button, at the bottom of Subjects
export default function AccountSection() {
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleLogOut() {
    setBusy(true)
    setError('')
    // scope 'local' = log out on THIS device only. It works even offline,
    // because the phone forgets the login before it contacts the server.
    const { error: logOutError } = await supabase.auth.signOut({ scope: 'local' })
    setBusy(false)
    if (logOutError) setError(friendlyAuthError(logOutError))
    // On success AuthProvider hears "SIGNED_OUT" and shows the login screen
  }

  return (
    <section className="account" aria-labelledby="account-title">
      <h2 id="account-title" className="account-title">
        Account
      </h2>
      <div className="row">
        <div className="row-main">
          <p className="row-meta">Logged in as</p>
          <p className="row-title">{user.email}</p>
        </div>
        <button
          type="button"
          className="button button-secondary button-small account-logout"
          onClick={handleLogOut}
          disabled={busy}
        >
          {busy ? 'Logging out…' : 'Log out'}
        </button>
      </div>
      {error ? (
        <p role="alert" className="field-error">
          {error}
        </p>
      ) : null}
    </section>
  )
}
