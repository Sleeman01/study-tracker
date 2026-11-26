import { useId } from 'react'
import { MAX_NAME_LENGTH } from '../auth/userName.js'

// Form pieces shared by the login, name and profile screens

// A labelled input with an optional hint or error underneath
export function Field({ label, error, hint, inputRef, onChange, ...inputProps }) {
  const id = useId()
  const messageId = `${id}-message`
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        {...inputProps}
        id={id}
        ref={inputRef}
        className="input"
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
      />
      {error ? (
        <p id={messageId} className="field-error">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

// A message from the server. role="alert" makes screen readers read an
// error out straight away; role="status" reads good news politely.
export function FormMessage({ error, notice }) {
  if (error) {
    return (
      <p role="alert" className="form-error">
        {error}
      </p>
    )
  }
  if (notice) {
    return (
      <p role="status" className="form-notice">
        {notice}
      </p>
    )
  }
  return null
}

// The name field (sign up, "What's your name?" and Profile)
export function NameField({ value, onChange, error, inputRef, label = 'Your name' }) {
  return (
    <Field
      label={label}
      error={error}
      inputRef={inputRef}
      name="name"
      type="text"
      autoComplete="name"
      autoCapitalize="words"
      maxLength={MAX_NAME_LENGTH + 10}
      placeholder="e.g. Sam…"
      value={value}
      onChange={onChange}
    />
  )
}
