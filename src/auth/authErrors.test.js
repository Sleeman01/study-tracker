import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  checkEmail,
  checkNewPassword,
  friendlyAuthError,
  isWrongCurrentPassword,
  OFFLINE_MESSAGE,
  WRONG_CURRENT_PASSWORD,
} from './authErrors.js'

test('known error codes become friendly sentences', () => {
  assert.match(friendlyAuthError({ code: 'invalid_credentials' }), /email or password isn't right/)
  assert.match(friendlyAuthError({ code: 'user_already_exists' }), /already an account/)
  assert.match(friendlyAuthError({ code: 'weak_password' }), /too easy to guess/)
  assert.match(friendlyAuthError({ code: 'email_address_invalid' }), /can't be used/)
})

test('no internet gives the offline message', () => {
  assert.equal(friendlyAuthError({ name: 'AuthRetryableFetchError', status: 0 }), OFFLINE_MESSAGE)
  assert.equal(friendlyAuthError({ message: 'TypeError: Failed to fetch' }), OFFLINE_MESSAGE)
})

test('errors with only a message still work', () => {
  assert.match(friendlyAuthError({ message: 'Invalid login credentials' }), /isn't right/)
})

test('unknown errors never show the raw code', () => {
  const text = friendlyAuthError({ code: 'weird_internal_thing', message: 'PGRST 500' })
  assert.equal(text, 'Something went wrong. Please try again.')
  assert.equal(friendlyAuthError(null), '')
})

test('email and password checks', () => {
  assert.equal(checkEmail(''), 'Enter your email address.')
  assert.match(checkEmail('sam@'), /doesn't look like/)
  assert.equal(checkEmail(' sam@school.org '), '')
  assert.equal(checkNewPassword(''), 'Choose a password.')
  assert.match(checkNewPassword('short'), /at least 8/)
  assert.equal(checkNewPassword('long enough'), '')
})

test('recognises a wrong current password, whichever way Supabase says it', () => {
  assert.equal(isWrongCurrentPassword({ code: 'invalid_credentials' }), true)
  assert.equal(isWrongCurrentPassword({ code: 'current_password_mismatch' }), true)
  // The real code Supabase sends (checked on the server, 26 Nov)
  assert.equal(isWrongCurrentPassword({ code: 'current_password_invalid' }), true)
  assert.equal(isWrongCurrentPassword({ code: 'current_password_required' }), true)
  assert.equal(isWrongCurrentPassword({ code: 'reauthentication_not_valid' }), true)
  assert.equal(isWrongCurrentPassword({ message: 'Current password is incorrect' }), true)
  assert.equal(isWrongCurrentPassword({ code: 'weak_password' }), false)
  assert.equal(isWrongCurrentPassword(null), false)
  assert.match(WRONG_CURRENT_PASSWORD, /current password isn't right/)
})
