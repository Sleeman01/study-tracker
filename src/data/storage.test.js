// Run with: npm test   (uses Node's built-in test runner, no library)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { emptyData, loadData, parseData, saveData, STORAGE_KEY } from './storage.js'

// A pretend localStorage, so tests don't need a browser
function fakeStorage(initial = {}) {
  const items = { ...initial }
  return {
    getItem: (key) => (key in items ? items[key] : null),
    setItem: (key, value) => {
      items[key] = String(value)
    },
  }
}

const subject = { id: 's1', name: 'Biology', color: '#2F6FDB', weeklyGoalHours: 5, createdAt: 1 }
const session = { id: 'x1', subjectId: 's1', startedAt: 1000, endedAt: 5000 }

test('no saved data gives empty lists', () => {
  assert.deepEqual(parseData(null), emptyData())
  assert.deepEqual(loadData(fakeStorage()), emptyData())
})

test('broken saved data gives empty lists instead of crashing', () => {
  assert.deepEqual(parseData('{not json'), emptyData())
  assert.deepEqual(parseData('42'), emptyData())
  assert.deepEqual(parseData('null'), emptyData())
})

test('saved data comes back the same after a reload', () => {
  const storage = fakeStorage()
  const data = { subjects: [subject], sessions: [session], activeTimer: { subjectId: 's1', startedAt: 9 } }
  saveData(data, storage)
  assert.deepEqual(loadData(storage), data)
})

test('bad items are dropped but good ones are kept', () => {
  const text = JSON.stringify({
    subjects: [subject, { id: 3 }],
    sessions: [session, { id: 'x2', subjectId: 's1', startedAt: 5, endedAt: 1 }],
    activeTimer: 'oops',
  })
  assert.deepEqual(parseData(text), { subjects: [subject], sessions: [session], activeTimer: null })
})

test('a storage that throws does not crash loading or saving', () => {
  const broken = {
    getItem: () => {
      throw new Error('blocked')
    },
    setItem: () => {
      throw new Error('full')
    },
  }
  assert.deepEqual(loadData(broken), emptyData())
  assert.doesNotThrow(() => saveData(emptyData(), broken))
  assert.equal(typeof STORAGE_KEY, 'string')
})
