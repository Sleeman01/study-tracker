// Every database call for subjects and sessions lives here.
// Row Level Security makes sure each call only touches the logged-in
// user's own rows, so we never have to filter by user ourselves.
import { supabase } from './supabase.js'
import {
  SESSION_COLUMNS,
  SUBJECT_COLUMNS,
  sessionFromRow,
  sessionToRow,
  subjectChangesToRow,
  subjectFromRow,
  subjectToRow,
} from './cloudRows.js'

// Supabase sends at most 1000 rows per request, so we ask page by page
const PAGE_SIZE = 1000

async function fetchAllRows(table, columns, orderBy) {
  const rows = []
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .order(orderBy)
      .order('id') // a second sort so pages never overlap
      .range(from, from + PAGE_SIZE - 1)
    if (error) throw error
    rows.push(...data)
    if (data.length < PAGE_SIZE) return rows
  }
}

export async function fetchStudyData() {
  const [subjectRows, sessionRows] = await Promise.all([
    fetchAllRows('subjects', SUBJECT_COLUMNS, 'created_at'),
    fetchAllRows('sessions', SESSION_COLUMNS, 'started_at'),
  ])
  return {
    subjects: subjectRows.map(subjectFromRow),
    sessions: sessionRows.map(sessionFromRow),
  }
}

// Supabase doesn't throw on errors, it returns { error }. We throw it,
// so the caller can use one simple try/catch.
async function run(request) {
  const { error } = await request
  if (error) throw error
}

export const addSubject = (subject) => run(supabase.from('subjects').insert(subjectToRow(subject)))

export const updateSubject = (id, changes) =>
  run(supabase.from('subjects').update(subjectChangesToRow(changes)).eq('id', id))

// The database also deletes the subject's sessions (on delete cascade)
export const deleteSubject = (id) => run(supabase.from('subjects').delete().eq('id', id))

export const addSession = (session) => run(supabase.from('sessions').insert(sessionToRow(session)))

export const deleteSession = (id) => run(supabase.from('sessions').delete().eq('id', id))

// Friendly text when saving or loading fails
export function friendlySyncError(error) {
  const offline =
    (typeof navigator !== 'undefined' && navigator.onLine === false) ||
    /failed to fetch|network|load failed/i.test(error?.message ?? '')
  if (offline) return "You're offline, so your last change wasn't saved to your account."
  if (error?.code === 'PGRST301' || error?.status === 401) {
    return 'Your login has expired. Log out and log in again to keep saving.'
  }
  return "Your last change couldn't be saved. Please try again."
}
