import { test } from 'node:test'
import assert from 'node:assert/strict'
import { friendlyLoadError, friendlySyncError, isOfflineError } from './syncMessages.js'

const offline = { message: 'TypeError: Failed to fetch' }

test('spots "no internet" errors', () => {
  assert.equal(isOfflineError(offline), true)
  assert.equal(isOfflineError({ code: '23505', message: 'duplicate key' }), false)
})

test('saving and loading get different messages', () => {
  assert.match(friendlySyncError(offline), /wasn't saved/)
  assert.match(friendlyLoadError(offline), /couldn't be loaded/)
  assert.doesNotMatch(friendlyLoadError(offline), /saved/)
})

test('other load problems still say what to do', () => {
  assert.match(friendlyLoadError({ code: 'XX000', message: 'boom' }), /try again/i)
})
