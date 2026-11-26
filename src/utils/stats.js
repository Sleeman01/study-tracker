// Adding up study sessions. A session counts toward the day it STARTED.
import { addDays, startOfDay } from './time.js'

export function sessionDuration(session) {
  return session.endedAt - session.startedAt
}

export function totalDuration(sessions) {
  return sessions.reduce((sum, s) => sum + sessionDuration(s), 0)
}

// Sessions that started between `from` (included) and `to` (not included)
export function sessionsBetween(sessions, from, to) {
  return sessions.filter((s) => s.startedAt >= from && s.startedAt < to)
}

// Sessions that started on the same day as `timestamp`
export function sessionsOnDay(sessions, timestamp) {
  const dayStart = startOfDay(timestamp)
  return sessionsBetween(sessions, dayStart, addDays(dayStart, 1))
}

// Newest first, without changing the original list
export function newestFirst(sessions) {
  return sessions.toSorted((a, b) => b.startedAt - a.startedAt)
}

// Groups sessions by the day they started, newest day first:
// [{ dayStart, sessions: [...newest first], total }]
export function groupByDay(sessions) {
  const groups = new Map()
  for (const session of newestFirst(sessions)) {
    const day = startOfDay(session.startedAt)
    if (!groups.has(day)) groups.set(day, [])
    groups.get(day).push(session)
  }
  return [...groups].map(([dayStart, daySessions]) => ({
    dayStart,
    sessions: daySessions,
    total: totalDuration(daySessions),
  }))
}
