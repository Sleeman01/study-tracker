import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkName, cleanName, getUserName, MAX_NAME_LENGTH } from './userName.js'

test('reads the name from the user metadata', () => {
  assert.equal(getUserName({ user_metadata: { name: 'Sam' } }), 'Sam')
})

test('no user, no metadata or a blank name all mean "no name yet"', () => {
  assert.equal(getUserName(null), '')
  assert.equal(getUserName({}), '')
  assert.equal(getUserName({ user_metadata: { name: '   ' } }), '')
  assert.equal(getUserName({ user_metadata: { name: 42 } }), '')
})

test('a name is trimmed and extra spaces inside are squeezed', () => {
  assert.equal(cleanName('  Sam   Lee  '), 'Sam Lee')
})

test('a name must be 1 to 40 characters', () => {
  assert.equal(checkName(''), 'Enter your name.')
  assert.equal(checkName('   '), 'Enter your name.')
  assert.equal(checkName('S'), '')
  assert.equal(checkName('x'.repeat(MAX_NAME_LENGTH)), '')
  assert.match(checkName('x'.repeat(MAX_NAME_LENGTH + 1)), /40 characters or fewer/)
})

test('an emoji counts as one character, not two', () => {
  assert.equal(checkName('😀'.repeat(MAX_NAME_LENGTH)), '')
})
