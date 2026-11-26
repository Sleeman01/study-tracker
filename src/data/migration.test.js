import { test } from 'node:test'
import assert from 'node:assert/strict'
import { describeCounts, hasLocalData, prepareUpload } from './migration.js'
import { emptyData } from './storage.js'

const bio = { id: 's1', name: 'Biology', color: '#2F6FDB', weeklyGoalHours: 5, createdAt: 1 }
const session = { id: 'x1', subjectId: 's1', startedAt: 1000, endedAt: 5000 }

test('knows when there is something to upload', () => {
  assert.equal(hasLocalData(emptyData()), false)
  assert.equal(hasLocalData({ ...emptyData(), subjects: [bio] }), true)
})

test('good data is uploaded unchanged', () => {
  const data = { subjects: [bio], sessions: [session], activeTimer: { subjectId: 's1', startedAt: 9 } }
  assert.deepEqual(prepareUpload(data), data)
})

test('odd values are fixed to fit the database rules', () => {
  const odd = { id: 's2', name: '  ' + 'x'.repeat(50), color: 'red', weeklyGoalHours: 500 }
  const [fixed] = prepareUpload({ ...emptyData(), subjects: [odd] }).subjects
  assert.equal(fixed.name.length, 40)
  assert.equal(fixed.color, '#2F6FDB')
  assert.equal(fixed.weeklyGoalHours, 100)
  assert.equal(typeof fixed.createdAt, 'number')
})

test('sessions and timers for missing subjects are left out', () => {
  const orphan = { ...session, id: 'x2', subjectId: 'gone' }
  const result = prepareUpload({
    subjects: [bio],
    sessions: [session, orphan],
    activeTimer: { subjectId: 'gone', startedAt: 1 },
  })
  assert.deepEqual(result.sessions, [session])
  assert.equal(result.activeTimer, null)
})

test('counts are described in plain words', () => {
  assert.equal(describeCounts({ subjects: [bio], sessions: [] }), '1 subject and 0 sessions')
  assert.equal(describeCounts({ subjects: [bio, bio], sessions: [session] }), '2 subjects and 1 session')
})
