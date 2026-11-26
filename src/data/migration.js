// Moving the data saved on this device (from before accounts) into
// the user's account. These are plain functions, so they're easy to test.
import { SUBJECT_COLORS } from './colors.js'

export const BACKUP_KEY = 'study-tracker-v1-uploaded'

// Remembers that this account already answered the question on this device
export function askedKey(userId) {
  return `study-tracker-upload-asked-${userId}`
}

export function hasLocalData(data) {
  return data.subjects.length > 0 || data.sessions.length > 0
}

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/

// Make old data fit the database's rules (see supabase/schema.sql), so
// one odd row can't make the whole upload fail.
export function prepareUpload(data) {
  const subjects = data.subjects
    .filter((s) => s.id.length >= 1 && s.id.length <= 64)
    .map((s) => ({
      id: s.id,
      name: s.name.trim().slice(0, 40) || 'Untitled subject',
      color: HEX_COLOR.test(s.color) ? s.color : SUBJECT_COLORS[0].hex,
      weeklyGoalHours: Number.isFinite(s.weeklyGoalHours)
        ? Math.min(100, Math.max(0, s.weeklyGoalHours))
        : 0,
      createdAt: Number.isFinite(s.createdAt) ? s.createdAt : Date.now(),
    }))

  // A session must belong to a subject that's being uploaded
  const subjectIds = new Set(subjects.map((s) => s.id))
  const sessions = data.sessions.filter(
    (s) => subjectIds.has(s.subjectId) && s.id.length >= 1 && s.id.length <= 64,
  )

  // A timer that was running carries over too
  const activeTimer =
    data.activeTimer && subjectIds.has(data.activeTimer.subjectId) ? data.activeTimer : null

  return { subjects, sessions, activeTimer }
}

// "3 subjects and 1 session"
export function describeCounts({ subjects, sessions }) {
  const part = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
  return `${part(subjects.length, 'subject')} and ${part(sessions.length, 'session')}`
}
