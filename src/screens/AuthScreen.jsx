import { useRef, useState } from 'react'
import { supabase } from '../data/supabase.js'
import { useAuth } from '../auth/AuthContext.js'
import {
  checkEmail,
  checkNewPassword,
  friendlyAuthError,
  MIN_PASSWORD_LENGTH,
} from '../auth/authErrors.js'
import { Field, FormMessage, NameField } from '../components/FormField.jsx'
import { checkName, cleanName } from '../auth/userName.js'
import './AuthScreen.css'

// What the screen shows for each mode
const TITLES = {
  login: { title: 'Welcome back', intro: 'Log in to see your subjects and study time.' },
  signup: { title: 'Create your account', intro: 'Your study data is saved to your account, so it’s safe on any device.' },
  forgot: { title: 'Reset your password', intro: 'Enter your email and we’ll send you a link to choose a new password.' },
  recovery: { title: 'Choose a new password', intro: 'Pick a new password for your account.' },
}

// Shown instead of the tabs when nobody is logged in
export default function AuthScreen() {
  const { recovering, linkError, clearLinkError } = useAuth()
  const [mode, setMode] = useState(linkError ? 'forgot' : 'login')
  // The email is kept when you switch between forms, so you don't retype it
  const [email, setEmail] = useState('')
  const shown = recovering ? 'recovery' : mode

  function switchTo(nextMode) {
    clearLinkError()
    setMode(nextMode)
  }

  return (
    <main className="auth">
      <p className="auth-brand">Study Tracker</p>
      <h1 className="screen-title">{TITLES[shown].title}</h1>
      <p className="screen-intro">{TITLES[shown].intro}</p>

      <div className="auth-sheet">
        {shown === 'recovery' ? (
          <NewPasswordForm />
        ) : shown === 'forgot' ? (
          <ForgotForm
            email={email}
            setEmail={setEmail}
            linkError={linkError}
            onBack={() => switchTo('login')}
          />
        ) : (
          // key: a fresh form (no old errors) when switching log in <-> sign up
          <CredentialsForm
            key={shown}
            mode={shown}
            email={email}
            setEmail={setEmail}
            onForgot={() => switchTo('forgot')}
          />
        )}
      </div>

      {shown === 'login' ? (
        <p className="auth-switch">
          New here?{' '}
          <button type="button" className="link-button" onClick={() => switchTo('signup')}>
            Create an account
          </button>
        </p>
      ) : null}
      {shown === 'signup' ? (
        <p className="auth-switch">
          Already have an account?{' '}
          <button type="button" className="link-button" onClick={() => switchTo('login')}>
            Log in
          </button>
        </p>
      ) : null}
    </main>
  )
}

// ---------- Log in and sign up (same fields, different button) ----------
function CredentialsForm({ mode, email, setEmail, onForgot }) {
  const isSignup = mode === 'signup'
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError('')
    const newErrors = {
      name: isSignup ? checkName(name) : '',
      email: checkEmail(email),
      password: isSignup ? checkNewPassword(password) : password ? '' : 'Enter your password.',
    }
    setErrors(newErrors)
    if (newErrors.name) return nameRef.current.focus()
    if (newErrors.email) return emailRef.current.focus()
    if (newErrors.password) return passwordRef.current.focus()

    setBusy(true)
    const credentials = { email: email.trim(), password }
    // options.data = user metadata, saved on the new account straight away
    const { data, error } = isSignup
      ? await supabase.auth.signUp({ ...credentials, options: { data: { name: cleanName(name) } } })
      : await supabase.auth.signInWithPassword(credentials)
    setBusy(false)

    if (error) return setServerError(friendlyAuthError(error))
    // If email confirmation is turned on in Supabase, there's no session yet
    if (isSignup && !data.session) {
      setNotice('Almost done! Check your email and tap the link to confirm your account.')
    }
    // Otherwise AuthProvider notices the login and the app shows the tabs
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {isSignup ? (
        <NameField value={name} onChange={setName} error={errors.name} inputRef={nameRef} />
      ) : null}
      <EmailField value={email} onChange={setEmail} error={errors.email} inputRef={emailRef} />
      <Field
        label="Password"
        error={errors.password}
        hint={isSignup ? `At least ${MIN_PASSWORD_LENGTH} characters.` : null}
        inputRef={passwordRef}
        name="password"
        type={showPassword ? 'text' : 'password'}
        autoComplete={isSignup ? 'new-password' : 'current-password'}
        value={password}
        onChange={setPassword}
      />
      <label className="check">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
        />
        Show password
      </label>

      <FormMessage error={serverError} notice={notice} />

      <button type="submit" className="button" disabled={busy}>
        {busy ? (isSignup ? 'Creating account…' : 'Logging in…') : isSignup ? 'Create account' : 'Log in'}
      </button>
      {!isSignup ? (
        <button type="button" className="link-button auth-forgot" onClick={onForgot}>
          Forgot password?
        </button>
      ) : null}
    </form>
  )
}

// ---------- Forgot password: send the reset email ----------
function ForgotForm({ email, setEmail, linkError, onBack }) {
  const [error, setError] = useState('')
  const [serverError, setServerError] = useState(
    linkError ? friendlyAuthError({ code: linkError }) : '',
  )
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const emailRef = useRef(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError('')
    const emailError = checkEmail(email)
    setError(emailError)
    if (emailError) return emailRef.current.focus()

    setBusy(true)
    // The email link opens the app again at this same address
    const { error: sendError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin,
    })
    setBusy(false)
    if (sendError) return setServerError(friendlyAuthError(sendError))
    setSent(true)
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <EmailField value={email} onChange={setEmail} error={error} inputRef={emailRef} />
      <FormMessage
        error={serverError}
        notice={
          sent
            ? `If there's an account for ${email.trim()}, we've sent it a link. Check your inbox (and spam folder).`
            : ''
        }
      />
      <button type="submit" className="button" disabled={busy}>
        {busy ? 'Sending…' : sent ? 'Send again' : 'Send reset link'}
      </button>
      <button type="button" className="button button-secondary" onClick={onBack}>
        Back to log in
      </button>
    </form>
  )
}

// ---------- After the reset link: choose a new password ----------
function NewPasswordForm() {
  const { finishRecovery } = useAuth()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [serverError, setServerError] = useState('')
  const [busy, setBusy] = useState(false)
  const passwordRef = useRef(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError('')
    const passwordError = checkNewPassword(password)
    setError(passwordError)
    if (passwordError) return passwordRef.current.focus()

    setBusy(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (updateError) return setServerError(friendlyAuthError(updateError))
    finishRecovery() // you're logged in: the app shows the tabs
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <Field
        label="New password"
        error={error}
        hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
        inputRef={passwordRef}
        name="new-password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
      />
      <label className="check">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
        />
        Show password
      </label>
      <FormMessage error={serverError} />
      <button type="submit" className="button" disabled={busy}>
        {busy ? 'Saving…' : 'Save new password'}
      </button>
    </form>
  )
}

// ---------- Small shared pieces ----------
function EmailField({ value, onChange, error, inputRef }) {
  return (
    <Field
      label="Email"
      error={error}
      inputRef={inputRef}
      name="email"
      type="email"
      inputMode="email"
      autoComplete="email"
      spellCheck={false}
      autoCapitalize="none"
      placeholder="you@example.com"
      value={value}
      onChange={onChange}
    />
  )
}
