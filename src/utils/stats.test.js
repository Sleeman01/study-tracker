import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chartScale, groupByDay, newestFirst, sessionsOnDay, totalDuration, weekTotals } from './stats.js'
import { addDays, formatDayLabel, formatDuration, startOfDay, startOfWeek } from './time.js'

// new Date(year, monthIndex, day, hour, minute): months start at 0, so 10 = November
const at = (day, hour, minute = 0) => new Date(2026, 10, day, hour, minute).getTime()
const MIN = 60_000

test('formatDuration', () => {
  assert.equal(formatDuration(0), '0 min')
  assert.equal(formatDuration(40_000), '40 s')
  assert.equal(formatDuration(45 * MIN), '45 min')
  assert.equal(formatDuration(120 * MIN), '2 h')
  assert.equal(formatDuration(85 * MIN + 30_000), '1 h 25 min')
})

test('startOfDay, addDays and startOfWeek (weeks start on Monday)', () => {
  assert.equal(startOfDay(at(26, 15, 30)), at(26, 0))
  assert.equal(addDays(at(26, 0), 1), at(27, 0))
  // 26 Nov 2026 is a Thursday, so its week starts on Monday 23 Nov
  assert.equal(startOfWeek(at(26, 15)), at(23, 0))
  // A Sunday belongs to the week that started the Monday before
  assert.equal(startOfWeek(at(29, 23)), at(23, 0))
  assert.equal(startOfWeek(at(23, 0)), at(23, 0))
})

test('sessionsOnDay and totalDuration only count that day', () => {
  const sessions = [
    { id: 'a', subjectId: 's', startedAt: at(26, 9), endedAt: at(26, 10) },
    { id: 'b', subjectId: 's', startedAt: at(26, 14), endedAt: at(26, 14, 30) },
    { id: 'c', subjectId: 's', startedAt: at(25, 23, 30), endedAt: at(26, 0, 30) },
  ]
  const today = sessionsOnDay(sessions, at(26, 18))
  assert.deepEqual(today.map((s) => s.id), ['a', 'b'])
  assert.equal(totalDuration(today), 90 * MIN)
  assert.deepEqual(newestFirst(today).map((s) => s.id), ['b', 'a'])
})

test('groupByDay puts newest days and sessions first', () => {
  const sessions = [
    { id: 'a', subjectId: 's', startedAt: at(24, 9), endedAt: at(24, 10) },
    { id: 'b', subjectId: 's', startedAt: at(26, 9), endedAt: at(26, 9, 30) },
    { id: 'c', subjectId: 's', startedAt: at(26, 14), endedAt: at(26, 15) },
  ]
  const groups = groupByDay(sessions)
  assert.deepEqual(groups.map((g) => g.dayStart), [at(26, 0), at(24, 0)])
  assert.deepEqual(groups[0].sessions.map((s) => s.id), ['c', 'b'])
  assert.equal(groups[0].total, 90 * MIN)
})

test('formatDayLabel says Today and Yesterday', () => {
  assert.equal(formatDayLabel(at(26, 0), at(26, 18)), 'Today')
  assert.equal(formatDayLabel(at(25, 0), at(26, 18)), 'Yesterday')
  assert.notEqual(formatDayLabel(at(20, 0), at(26, 18)), 'Today')
})

test('weekTotals gives Monday to Sunday with zero for empty days', () => {
  const sessions = [
    { id: 'a', subjectId: 's', startedAt: at(23, 9), endedAt: at(23, 10) }, // Monday
    { id: 'b', subjectId: 's', startedAt: at(26, 9), endedAt: at(26, 9, 30) }, // Thursday
    { id: 'c', subjectId: 's', startedAt: at(22, 9), endedAt: at(22, 10) }, // last week's Sunday
  ]
  const week = weekTotals(sessions, at(26, 18))
  assert.equal(week.length, 7)
  assert.equal(week[0].dayStart, at(23, 0))
  assert.deepEqual(week.map((d) => d.total / MIN), [60, 0, 0, 30, 0, 0, 0])
})

test('chartScale picks a tidy top and gridlines', () => {
  assert.deepEqual(chartScale(0), { top: 1, ticks: [0.5, 1] })
  assert.deepEqual(chartScale(150 * MIN), { top: 3, ticks: [1, 2, 3] })
  assert.deepEqual(chartScale(312 * MIN), { top: 6, ticks: [2, 4, 6] })
})
