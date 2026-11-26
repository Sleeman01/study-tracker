import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatClock, formatHours } from './time.js'

test('formatClock shows hours, minutes and seconds', () => {
  assert.equal(formatClock(0), '0:00:00')
  assert.equal(formatClock(754_000), '0:12:34')
  assert.equal(formatClock(3_600_000 + 5_000), '1:00:05')
  assert.equal(formatClock(-500), '0:00:00') // never negative
})

test('formatHours rounds to one decimal place', () => {
  assert.equal(formatHours(5), '5 h')
  assert.equal(formatHours(2.5), '2.5 h')
  assert.equal(formatHours(1 / 3), '0.3 h')
})
