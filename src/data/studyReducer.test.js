import { test } from 'node:test'
import assert from 'node:assert/strict'
import { studyReducer } from './studyReducer.js'
import { emptyData } from './storage.js'

const bio = { id: 's1', name: 'Biology', color: '#2F6FDB', weeklyGoalHours: 5, createdAt: 1 }
const math = { id: 's2', name: 'Maths', color: '#E0A21B', weeklyGoalHours: 3, createdAt: 2 }

function withSubjects() {
  let state = emptyData()
  state = studyReducer(state, { type: 'subject/add', subject: bio })
  state = studyReducer(state, { type: 'subject/add', subject: math })
  return state
}

test('add and update a subject', () => {
  let state = withSubjects()
  assert.equal(state.subjects.length, 2)
  state = studyReducer(state, { type: 'subject/update', id: 's1', changes: { name: 'Bio' } })
  assert.equal(state.subjects[0].name, 'Bio')
  assert.equal(state.subjects[1].name, 'Maths')
})

test('start and stop the timer saves a session', () => {
  let state = withSubjects()
  state = studyReducer(state, { type: 'timer/start', subjectId: 's1', startedAt: 1000 })
  assert.deepEqual(state.activeTimer, { subjectId: 's1', startedAt: 1000 })
  state = studyReducer(state, { type: 'timer/stop', sessionId: 'x1', endedAt: 61000 })
  assert.equal(state.activeTimer, null)
  assert.deepEqual(state.sessions, [{ id: 'x1', subjectId: 's1', startedAt: 1000, endedAt: 61000 }])
})

test('starting twice keeps the first start time', () => {
  let state = withSubjects()
  state = studyReducer(state, { type: 'timer/start', subjectId: 's1', startedAt: 1000 })
  state = studyReducer(state, { type: 'timer/start', subjectId: 's2', startedAt: 2000 })
  assert.deepEqual(state.activeTimer, { subjectId: 's1', startedAt: 1000 })
})

test('a session shorter than 1 second is not saved', () => {
  let state = withSubjects()
  state = studyReducer(state, { type: 'timer/start', subjectId: 's1', startedAt: 1000 })
  state = studyReducer(state, { type: 'timer/stop', sessionId: 'x1', endedAt: 1500 })
  assert.equal(state.sessions.length, 0)
  assert.equal(state.activeTimer, null)
})

test('deleting a subject removes its sessions and stops its timer', () => {
  let state = withSubjects()
  state = { ...state, sessions: [
    { id: 'a', subjectId: 's1', startedAt: 0, endedAt: 10 },
    { id: 'b', subjectId: 's2', startedAt: 0, endedAt: 10 },
  ] }
  state = studyReducer(state, { type: 'timer/start', subjectId: 's1', startedAt: 50 })
  state = studyReducer(state, { type: 'subject/delete', id: 's1' })
  assert.deepEqual(state.subjects.map((s) => s.id), ['s2'])
  assert.deepEqual(state.sessions.map((s) => s.id), ['b'])
  assert.equal(state.activeTimer, null)
})

test('delete a session', () => {
  let state = { ...withSubjects(), sessions: [{ id: 'a', subjectId: 's1', startedAt: 0, endedAt: 10 }] }
  state = studyReducer(state, { type: 'session/delete', id: 'a' })
  assert.equal(state.sessions.length, 0)
})

test('loading cloud data keeps the running timer', () => {
  let state = studyReducer(withSubjects(), { type: 'timer/start', subjectId: 's1', startedAt: 50 })
  const session = { id: 'a', subjectId: 's2', startedAt: 0, endedAt: 10 }
  state = studyReducer(state, { type: 'data/loaded', subjects: [math], sessions: [session] })
  assert.deepEqual(state.subjects, [math])
  assert.deepEqual(state.sessions, [session])
  assert.deepEqual(state.activeTimer, { subjectId: 's1', startedAt: 50 })
})
