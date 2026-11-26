import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  sessionFromRow,
  sessionToRow,
  subjectChangesToRow,
  subjectFromRow,
  subjectToRow,
} from './cloudRows.js'

const subject = { id: 's1', name: 'Biology', color: '#2F6FDB', weeklyGoalHours: 2.5, createdAt: 1764150000123 }
const session = { id: 'x1', subjectId: 's1', startedAt: 1764150000123, endedAt: 1764153600456 }

test('a subject survives the trip to the database and back', () => {
  const row = subjectToRow(subject)
  assert.equal(row.weekly_goal_hours, 2.5)
  assert.equal(row.created_at, '2025-11-26T09:40:00.123Z')
  assert.equal('user_id' in row, false) // the database fills this in
  assert.deepEqual(subjectFromRow(row), subject)
})

test('a session survives the trip, down to the millisecond', () => {
  const row = sessionToRow(session)
  assert.equal(row.subject_id, 's1')
  // Postgres sends times back in its own format; it still means the same moment
  const fromDb = { ...row, started_at: '2025-11-26 09:40:00.123+00', ended_at: '2025-11-26T10:40:00.456+00:00' }
  assert.deepEqual(sessionFromRow(fromDb), session)
})

test('numeric goals that arrive as text become numbers', () => {
  assert.equal(subjectFromRow({ ...subjectToRow(subject), weekly_goal_hours: '2.5' }).weeklyGoalHours, 2.5)
})

test('subject changes only include what changed', () => {
  assert.deepEqual(subjectChangesToRow({ name: 'Bio' }), { name: 'Bio' })
  assert.deepEqual(subjectChangesToRow({ weeklyGoalHours: 0, color: '#E0A21B' }), {
    weekly_goal_hours: 0,
    color: '#E0A21B',
  })
})
