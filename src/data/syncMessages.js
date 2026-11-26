// Friendly messages for when talking to Supabase fails.
// Kept apart from cloudStore.js so they can be tested without a database.

// True when the problem is "no internet", not a mistake in the data
export function isOfflineError(error) {
  return (
    (typeof navigator !== 'undefined' && navigator.onLine === false) ||
    /failed to fetch|network|load failed/i.test(error?.message ?? '')
  )
}

const loginExpired = (error) => error?.code === 'PGRST301' || error?.status === 401

// When SAVING a change failed
export function friendlySyncError(error) {
  if (isOfflineError(error)) return "You're offline, so your last change wasn't saved to your account."
  if (loginExpired(error)) return 'Your login has expired. Log out and log in again to keep saving.'
  return "Your last change couldn't be saved. Please try again."
}

// When LOADING your data failed (and there's no copy on this device yet)
export function friendlyLoadError(error) {
  if (isOfflineError(error)) {
    return "You're offline, so your study data couldn't be loaded. Connect to the internet, then try again."
  }
  if (loginExpired(error)) return 'Your login has expired. Log out and log in again.'
  return "Your study data couldn't be loaded. Please try again."
}
