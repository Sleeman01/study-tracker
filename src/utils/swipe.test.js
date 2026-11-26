import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dragOffset, neighbourTab, startsInSwipeArea, swipeResult } from './swipe.js'

const W = 400 // screen width in px

test('a long swipe to the left goes to the next tab, to the right to the previous one', () => {
  assert.equal(swipeResult({ dx: -150, dy: 10, dt: 500, width: W }), 'next')
  assert.equal(swipeResult({ dx: 150, dy: -10, dt: 500, width: W }), 'previous')
})

test('a short, slow drag does nothing', () => {
  assert.equal(swipeResult({ dx: -60, dy: 0, dt: 600, width: W }), null)
})

test('a quick flick counts even when it is short', () => {
  assert.equal(swipeResult({ dx: -60, dy: 5, dt: 100, width: W }), 'next')
  assert.equal(swipeResult({ dx: -30, dy: 0, dt: 30, width: W }), null) // too tiny, even if fast
})

test('mostly-vertical movement is scrolling, not swiping', () => {
  assert.equal(swipeResult({ dx: -150, dy: 120, dt: 300, width: W }), null)
  assert.equal(swipeResult({ dx: -150, dy: 90, dt: 300, width: W }), 'next') // 150 > 1.5 x 90
})

test('next and previous tab, without wrapping around', () => {
  const tabs = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
  assert.equal(neighbourTab(tabs, 'a', 'next'), 'b')
  assert.equal(neighbourTab(tabs, 'b', 'previous'), 'a')
  assert.equal(neighbourTab(tabs, 'c', 'next'), null)
  assert.equal(neighbourTab(tabs, 'a', 'previous'), null)
})

test('touches near the screen edges are left to the phone (back gesture)', () => {
  assert.equal(startsInSwipeArea(10, W), false)
  assert.equal(startsInSwipeArea(W - 10, W), false)
  assert.equal(startsInSwipeArea(200, W), true)
})

test('the screen follows the finger, but stretches less when there is no tab that way', () => {
  assert.equal(dragOffset(-80, true), -80)
  assert.equal(dragOffset(-80, false), -20)
})
