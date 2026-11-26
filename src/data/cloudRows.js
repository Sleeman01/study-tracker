// "Translators" between the app's data and the database's rows.
//
// The app uses camelCase names and times as numbers (milliseconds):
//   { id, subjectId, startedAt: 1764150000000, endedAt: ... }
// The database uses snake_case names and real date-time values:
//   { id, subject_id, started_at: '2025-11-26T09:40:00.000Z', ended_at: ... }
// user_id is never sent: the database fills it in with auth.uid().

const toTime = (ms) => new Date(ms).toISOString()
const fromTime = (text) => Date.parse(text)

export function subjectToRow(subject) {
  return {
    id: subject.id,
    name: subject.name,
    color: subject.color,
    weekly_goal_hours: subject.weeklyGoalHours,
    created_at: toTime(subject.createdAt ?? Date.now()),
  }
}

export function subjectFromRow(row) {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    weeklyGoalHours: Number(row.weekly_goal_hours), // numeric can arrive as text
    createdAt: fromTime(row.created_at),
  }
}

// Only the fields that the edit form can change
export function subjectChangesToRow(changes) {
  const row = {}
  if ('name' in changes) row.name = changes.name
  if ('color' in changes) row.color = changes.color
  if ('weeklyGoalHours' in changes) row.weekly_goal_hours = changes.weeklyGoalHours
  return row
}

export function sessionToRow(session) {
  return {
    id: session.id,
    subject_id: session.subjectId,
    started_at: toTime(session.startedAt),
    ended_at: toTime(session.endedAt),
  }
}

export function sessionFromRow(row) {
  return {
    id: row.id,
    subjectId: row.subject_id,
    startedAt: fromTime(row.started_at),
    endedAt: fromTime(row.ended_at),
  }
}

export const SUBJECT_COLUMNS = 'id, name, color, weekly_goal_hours, created_at'
export const SESSION_COLUMNS = 'id, subject_id, started_at, ended_at'
