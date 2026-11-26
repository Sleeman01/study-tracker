// Saving and loading all app data in the browser's localStorage.
// localStorage only stores text, so we turn our data into JSON text
// when saving, and back into objects when loading.

// Before accounts, everything was saved under this one key.
// Now it's only read to offer uploading it (see Story 15).
export const STORAGE_KEY = 'study-tracker-v1'

// Each account gets its own copy on the device: the running timer, plus a
// copy of the cloud data so the app still opens when you're offline.
export function userStorageKey(userId) {
  return `study-tracker-user-${userId}`
}

export function emptyData() {
  return { subjects: [], sessions: [], activeTimer: null }
}

// Small checks so that broken or old data can't crash the app
function isSubject(s) {
  return (
    s &&
    typeof s.id === 'string' &&
    typeof s.name === 'string' &&
    typeof s.color === 'string' &&
    typeof s.weeklyGoalHours === 'number'
  )
}

function isSession(s) {
  return (
    s &&
    typeof s.id === 'string' &&
    typeof s.subjectId === 'string' &&
    Number.isFinite(s.startedAt) &&
    Number.isFinite(s.endedAt) &&
    s.endedAt >= s.startedAt
  )
}

function isTimer(t) {
  return t && typeof t.subjectId === 'string' && Number.isFinite(t.startedAt)
}

// Turn saved text back into data. Anything missing or broken
// becomes an empty list instead of an error.
export function parseData(text) {
  if (!text) return emptyData()
  try {
    const raw = JSON.parse(text)
    if (!raw || typeof raw !== 'object') return emptyData()
    return {
      subjects: Array.isArray(raw.subjects) ? raw.subjects.filter(isSubject) : [],
      sessions: Array.isArray(raw.sessions) ? raw.sessions.filter(isSession) : [],
      activeTimer: isTimer(raw.activeTimer) ? raw.activeTimer : null,
    }
  } catch {
    return emptyData()
  }
}

export function loadData(storage = globalThis.localStorage, key = STORAGE_KEY) {
  try {
    return parseData(storage.getItem(key))
  } catch {
    // localStorage can be blocked (for example in some private modes)
    return emptyData()
  }
}

export function saveData(data, storage = globalThis.localStorage, key = STORAGE_KEY) {
  try {
    storage.setItem(key, JSON.stringify(data))
  } catch {
    // Storage full or blocked: the app keeps working, it just can't save.
  }
}
