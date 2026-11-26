// Adding up study sessions. A session counts toward the day it STARTED.
import { addDays, startOfDay, startOfWeek } from './time.js'

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

const HOUR_MS = 3_600_000

// The 7 days of the week that `now` is in (Monday to Sunday),
// each with its total study time: [{ dayStart, total }]
export function weekTotals(sessions, now) {
  const monday = startOfWeek(now)
  return Array.from({ length: 7 }, (_, i) => {
    const dayStart = addDays(monday, i)
    const total = totalDuration(sessionsBetween(sessions, dayStart, addDays(dayStart, 1)))
    return { dayStart, total }
  })
}

// Picks a nice top for the chart's scale and where to draw gridlines.
// For example, 5.2 hours -> top 6 h with lines at 2, 4, 6.
export function chartScale(maxMs) {
  const maxHours = maxMs / HOUR_MS
  if (maxHours <= 1) return { top: 1, ticks: [0.5, 1] }
  const step = maxHours <= 4 ? 1 : maxHours <= 8 ? 2 : 4
  const top = Math.ceil(maxHours / step) * step
  const ticks = []
  for (let t = step; t <= top; t += step) ticks.push(t)
  return { top, ticks }
}
