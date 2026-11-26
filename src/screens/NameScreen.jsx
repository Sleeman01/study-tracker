import { useRef, useState } from 'react'
import { supabase } from '../data/supabase.js'
import { checkName, cleanName } from '../auth/userName.js'
import { friendlyAuthError, OFFLINE_MESSAGE } from '../auth/authErrors.js'
import { FormMessage, NameField } from '../components/FormField.jsx'
import './AuthScreen.css'

// Shown once to accounts that don't have a name yet (made before Story 16).
// onContinue lets you in without a name, but only after saving failed
// because you're offline. The question comes back next time.
export default function NameScreen({ onContinue }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [serverError, setServerError] = useState('')
  const [offline, setOffline] = useState(false)
  const [busy, setBusy] = useState(false)
  const nameRef = useRef(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError('')
    const nameError = checkName(name)
    setError(nameError)
    if (nameError) return nameRef.current.focus()

    setBusy(true)
    // "data" is the user metadata. Supabase then announces USER_UPDATED,
    // AuthProvider gets the new name, and the app opens by itself.
    const { error: saveError } = await supabase.auth.updateUser({ data: { name: cleanName(name) } })
    setBusy(false)
    if (!saveError) return
    const message = friendlyAuthError(saveError)
    setOffline(message === OFFLINE_MESSAGE)
    setServerError(
      message === OFFLINE_MESSAGE
        ? "You're offline, so your name couldn't be saved. You can carry on now, and we'll ask again next time."
        : message,
    )
  }

  return (
    <main className="auth">
      <p className="auth-brand">Study Tracker</p>
      <h1 className="screen-title">What’s your name?</h1>
      <p className="screen-intro">We’ll use it to greet you on the Today screen.</p>

      <div className="auth-sheet">
        <form className="form" onSubmit={handleSubmit} noValidate>
          <NameField value={name} onChange={setName} error={error} inputRef={nameRef} />
          <FormMessage error={serverError} />
          <button type="submit" className="button" disabled={busy}>
            {busy ? 'Saving…' : 'Save and start'}
          </button>
          {offline ? (
            <button type="button" className="button button-secondary" onClick={onContinue}>
              Continue without a name
            </button>
          ) : null}
        </form>
      </div>
    </main>
  )
}
