import { useRef, useState } from 'react'
import { supabase } from '../data/supabase.js'
import { useAuth } from '../auth/AuthContext.js'
import { checkName, cleanName, getUserName } from '../auth/userName.js'
import {
  checkNewPassword,
  friendlyAuthError,
  isWrongCurrentPassword,
  MIN_PASSWORD_LENGTH,
  WRONG_CURRENT_PASSWORD,
} from '../auth/authErrors.js'
import { Field, FormMessage, NameField } from '../components/FormField.jsx'
import './ProfileScreen.css'

// Your account: name, email, password and log out
export default function ProfileScreen() {
  const { user } = useAuth()
  return (
    <>
      <div className="screen-header">
        <h1 className="screen-title">Profile</h1>
      </div>
      <section className="profile-section" aria-label="Your details">
        <NameSection savedName={getUserName(user)} />
        <div className="field profile-email">
          <p className="field-label">Email</p>
          <p>{user.email}</p>
        </div>
      </section>
      <PasswordSection email={user.email} />
      <LogOutSection />
    </>
  )
}

// ---------- Name ----------
function NameSection({ savedName }) {
  const [name, setName] = useState(savedName)
  const [error, setError] = useState('')
  const [serverError, setServerError] = useState('')
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  const nameRef = useRef(null)
  const unchanged = cleanName(name) === savedName

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError('')
    setSaved(false)
    const nameError = checkName(name)
    setError(nameError)
    if (nameError) return nameRef.current.focus()
    if (unchanged) return setSaved(true) // nothing new to save

    setBusy(true)
    // Supabase announces USER_UPDATED, so "Hello, <name>" updates everywhere
    const { error: saveError } = await supabase.auth.updateUser({ data: { name: cleanName(name) } })
    setBusy(false)
    if (saveError) return setServerError(friendlyAuthError(saveError))
    setName(cleanName(name))
    setSaved(true)
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <NameField
        label="Name"
        value={name}
        onChange={(value) => {
          setName(value)
          setSaved(false)
        }}
        error={error}
        inputRef={nameRef}
      />
      <FormMessage error={serverError} notice={saved ? 'Name saved.' : ''} />
      <button type="submit" className="button profile-button" disabled={busy}>
        {busy ? 'Saving…' : 'Save name'}
      </button>
    </form>
  )
}

// ---------- Password ----------
function PasswordSection({ email }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [changed, setChanged] = useState(false)
  const [busy, setBusy] = useState(false)
  const currentRef = useRef(null)
  const nextRef = useRef(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError('')
    setChanged(false)
    const newErrors = {
      current: current ? '' : 'Enter your current password.',
      next:
        checkNewPassword(next) ||
        (next === current ? 'Your new password must be different from your current one.' : ''),
    }
    setErrors(newErrors)
    if (newErrors.current) return currentRef.current.focus()
    if (newErrors.next) return nextRef.current.focus()

    setBusy(true)
    const result = await changePassword(email, current, next)
    setBusy(false)
    if (result.error) {
      if (result.wrongCurrent) {
        setErrors({ current: WRONG_CURRENT_PASSWORD })
        currentRef.current.focus()
      } else {
        setServerError(result.error)
      }
      return
    }
    setCurrent('')
    setNext('')
    setChanged(true)
  }

  return (
    <section className="profile-section" aria-labelledby="password-title">
      <h2 id="password-title" className="profile-title">
        Change password
      </h2>
      <form className="form" onSubmit={handleSubmit} noValidate>
        {/* Helps password managers know which account this is for */}
        <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
        <Field
          label="Current password"
          error={errors.current}
          inputRef={currentRef}
          name="current-password"
          type={show ? 'text' : 'password'}
          autoComplete="current-password"
          value={current}
          onChange={setCurrent}
        />
        <Field
          label="New password"
          error={errors.next}
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
          inputRef={nextRef}
          name="new-password"
          type={show ? 'text' : 'password'}
          autoComplete="new-password"
          value={next}
          onChange={setNext}
        />
        <label className="check">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
          Show passwords
        </label>
        <FormMessage error={serverError} notice={changed ? 'Password changed.' : ''} />
        <button type="submit" className="button profile-button" disabled={busy}>
          {busy ? 'Changing…' : 'Change password'}
        </button>
      </form>
    </section>
  )
}

// Two locks on the same door:
// 1. The app checks the current password by logging in with it.
// 2. Supabase's built-in current_password is sent too, so the server checks
//    it as well when "Require current password when updating" is on.
async function changePassword(email, current, next) {
  const check = await supabase.auth.signInWithPassword({ email, password: current })
  if (check.error) {
    return isWrongCurrentPassword(check.error)
      ? { error: WRONG_CURRENT_PASSWORD, wrongCurrent: true }
      : { error: friendlyAuthError(check.error) }
  }
  const { error } = await supabase.auth.updateUser({ password: next, current_password: current })
  if (error) {
    return isWrongCurrentPassword(error)
      ? { error: WRONG_CURRENT_PASSWORD, wrongCurrent: true }
      : { error: friendlyAuthError(error) }
  }
  return {}
}

// ---------- Log out ----------
function LogOutSection() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleLogOut() {
    setBusy(true)
    setError('')
    // scope 'local' = this device only; works offline too
    const { error: logOutError } = await supabase.auth.signOut({ scope: 'local' })
    setBusy(false)
    if (logOutError) setError(friendlyAuthError(logOutError))
  }

  return (
    <section className="profile-section" aria-label="Log out">
      <button
        type="button"
        className="button button-secondary profile-button"
        onClick={handleLogOut}
        disabled={busy}
      >
        {busy ? 'Logging out…' : 'Log out'}
      </button>
      <FormMessage error={error} />
    </section>
  )
}
