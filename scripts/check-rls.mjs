// Security check: can one user see or change another user's data?
// Run with:  npm run check:rls
//
// It signs up two NEW test users (A and B) on your Supabase project, using
// only the public anon key from .env.local. User A saves a subject and a
// session. User B then tries to read, change, delete and fake A's data.
// Every attempt must fail. At the end A's test rows are deleted again.
//
// The test accounts stay in Authentication -> Users (deleting accounts
// needs the secret key, which we never use). Delete them there by hand.
import { createClient } from '@supabase/supabase-js'

process.loadEnvFile('.env.local')
const url = process.env.VITE_SUPABASE_URL
const anonKey = process.env.VITE_SUPABASE_ANON_KEY

let failures = 0
function check(label, ok) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`)
  if (!ok) failures++
}

// Each user gets their own client, like two different phones
async function newUser(letter) {
  const client = createClient(url, anonKey, { auth: { persistSession: false } })
  const email = `rls-test-${letter}-${Date.now()}@example.com`
  const password = crypto.randomUUID()
  const { data, error } = await client.auth.signUp({ email, password })
  if (error) throw new Error(`Sign up ${letter} failed: ${error.message}`)
  if (!data.session) throw new Error('No session after sign up. Is email confirmation turned off?')
  console.log(`Signed up test user ${letter.toUpperCase()}: ${email}`)
  return { client, id: data.user.id }
}

const a = await newUser('a')
const b = await newUser('b')
const subjectId = crypto.randomUUID()
const sessionId = crypto.randomUUID()

// --- User A saves their own data -------------------------------------
const ins1 = await a.client
  .from('subjects')
  .insert({ id: subjectId, name: 'A secret subject', color: '#2F6FDB', weekly_goal_hours: 2 })
check('A can add a subject', !ins1.error)
const ins2 = await a.client.from('sessions').insert({
  id: sessionId,
  subject_id: subjectId,
  started_at: new Date(Date.now() - 3600_000).toISOString(),
  ended_at: new Date().toISOString(),
})
check('A can add a session', !ins2.error)
const aSees = await a.client.from('subjects').select('*')
check('A can read their own subject', aSees.data?.length === 1)

// --- User B tries to get at A's data ---------------------------------
const bSubjects = await b.client.from('subjects').select('*')
const bSessions = await b.client.from('sessions').select('*')
check('B sees none of A\'s subjects', !bSubjects.error && bSubjects.data.length === 0)
check('B sees none of A\'s sessions', !bSessions.error && bSessions.data.length === 0)

const bFiltered = await b.client.from('subjects').select('*').eq('user_id', a.id)
check('B sees nothing even when asking for A\'s user_id', bFiltered.data?.length === 0)

const bUpdate = await b.client
  .from('subjects')
  .update({ name: 'Hacked' })
  .eq('user_id', a.id)
  .select()
check('B cannot change A\'s subject', bUpdate.data?.length === 0 || !!bUpdate.error)

const bDelete = await b.client.from('sessions').delete().eq('user_id', a.id).select()
check('B cannot delete A\'s session', bDelete.data?.length === 0 || !!bDelete.error)

const bFake = await b.client
  .from('subjects')
  .insert({ user_id: a.id, id: 'fake', name: 'Fake', color: '#2F6FDB', weekly_goal_hours: 0 })
check('B cannot add a row in A\'s name', !!bFake.error)

const bSteal = await b.client.from('sessions').insert({
  id: 'steal',
  subject_id: subjectId, // A's subject id, but the row would belong to B
  started_at: new Date().toISOString(),
  ended_at: new Date().toISOString(),
})
check('B cannot attach a session to A\'s subject', !!bSteal.error)

// --- A's data is untouched -------------------------------------------
const after = await a.client.from('subjects').select('name')
check('A\'s subject is unchanged', after.data?.[0]?.name === 'A secret subject')
const afterSessions = await a.client.from('sessions').select('id')
check('A\'s session still exists', afterSessions.data?.length === 1)

// --- Logged out ------------------------------------------------------
const anon = createClient(url, anonKey, { auth: { persistSession: false } })
const anonRead = await anon.from('subjects').select('*')
check('A logged-out visitor cannot read anything', !!anonRead.error || anonRead.data.length === 0)

// --- Clean up: deleting A's subject also deletes its session (cascade)
await a.client.from('subjects').delete().eq('id', subjectId)
const cleaned = await a.client.from('sessions').select('id')
check('Deleting a subject also deletes its sessions', cleaned.data?.length === 0)

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) FAILED.`)
process.exit(failures === 0 ? 0 : 1)
