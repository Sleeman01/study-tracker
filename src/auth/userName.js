// The user's name lives in Supabase "user metadata": small facts saved on
// the account itself (auth.users), next to the email. Only the logged-in
// user can read or change their own metadata.
//
// Important: the user can change their metadata, so it's fine for a
// display name, but it must NEVER be used to decide what someone is allowed to do.

export const MAX_NAME_LENGTH = 40

// Characters as people count them, so an emoji counts as 1, not 2
const length = (text) => Array.from(text).length

// "  Sam   Lee " -> "Sam Lee"
export function cleanName(name) {
  return name.trim().replace(/\s+/g, ' ')
}

// The saved name, or '' when there isn't one yet
export function getUserName(user) {
  const name = user?.user_metadata?.name
  return typeof name === 'string' ? cleanName(name) : ''
}

// '' when the name is fine, otherwise a friendly message
export function checkName(name) {
  const cleaned = cleanName(name)
  if (!cleaned) return 'Enter your name.'
  if (length(cleaned) > MAX_NAME_LENGTH) return `Use ${MAX_NAME_LENGTH} characters or fewer.`
  return ''
}
