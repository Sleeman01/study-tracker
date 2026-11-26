// Turns Supabase's technical errors into short, friendly sentences.
// Supabase gives each error a `code` (like "invalid_credentials"), which is
// more reliable than its English message, so we look at the code first.

export const MIN_PASSWORD_LENGTH = 8

const MESSAGES = {
  invalid_credentials: "That email or password isn't right. Check them and try again.",
  user_already_exists: 'There is already an account with this email. Try logging in instead.',
  email_exists: 'There is already an account with this email. Try logging in instead.',
  weak_password: `That password is too easy to guess. Use at least ${MIN_PASSWORD_LENGTH} characters.`,
  // Supabase refuses some addresses, like made-up test domains
  email_address_invalid: "That email address can't be used. Check it's typed correctly.",
  // Supabase's free built-in mailer only sends to your project team's emails
  email_address_not_authorized: "We can't send email to that address yet. Try again later.",
  validation_failed: "That doesn't look like an email address.",
  email_not_confirmed: 'Please confirm your email first. Check your inbox for the link.',
  same_password: 'Your new password must be different from your old one.',
  over_email_send_rate_limit: 'Too many emails were sent. Wait a few minutes, then try again.',
  over_request_rate_limit: 'Too many tries in a row. Wait a minute, then try again.',
  signup_disabled: 'Creating new accounts is turned off right now.',
  otp_expired: 'That link has expired or was already used. Ask for a new one.',
  session_not_found: 'You were logged out. Please log in again.',
}

export const OFFLINE_MESSAGE = "Can't reach the server. Check your internet connection and try again."

export function friendlyAuthError(error) {
  if (!error) return ''
  // No internet, or the server didn't answer
  if (
    error.name === 'AuthRetryableFetchError' ||
    error.status === 0 ||
    /failed to fetch|network|load failed/i.test(error.message ?? '')
  ) {
    return OFFLINE_MESSAGE
  }
  if (error.code && MESSAGES[error.code]) return MESSAGES[error.code]
  // Older servers sometimes send only a message, no code
  if (/invalid login credentials/i.test(error.message ?? '')) return MESSAGES.invalid_credentials
  if (/already registered/i.test(error.message ?? '')) return MESSAGES.user_already_exists
  return 'Something went wrong. Please try again.'
}

// Checks we can do before asking the server (instant feedback)
export function checkEmail(email) {
  const value = email.trim()
  if (!value) return 'Enter your email address.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "That doesn't look like an email address."
  return ''
}

export function checkNewPassword(password) {
  if (!password) return 'Choose a password.'
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  return ''
}
