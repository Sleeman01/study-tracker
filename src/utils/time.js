// Helpers for turning times and durations into friendly text.
// `undefined` as the locale means "use the phone's language settings".

// 5 -> "5 h", 2.5 -> "2.5 h"
export function formatHours(hours) {
  const rounded = Math.round(hours * 10) / 10
  return `${rounded} h`
}

// Timer display: 754000 ms -> "0:12:34"
export function formatClock(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// Clock time of day: "14:05" or "2:05 PM", depending on the phone
export function formatTime(timestamp) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(
    timestamp,
  )
}

// "Wednesday 26 November"
export function formatLongDate(timestamp) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(timestamp)
}

// "1 h 25 min", "45 min", "2 h", or "40 s" for very short sessions
export function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  if (totalSeconds < 60) return `${totalSeconds} s`
  const totalMinutes = Math.floor(totalSeconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes} min`
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`
}

// ---------- Days and weeks ----------
// We use the Date object so that daylight-saving changes
// (23- or 25-hour days) are handled for us.

// Midnight at the start of the day that `timestamp` is in
export function startOfDay(timestamp) {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

// Move forward (or back, with a negative number) by whole days
export function addDays(timestamp, days) {
  const date = new Date(timestamp)
  date.setDate(date.getDate() + days)
  return date.getTime()
}

// Monday midnight at the start of the week. getDay() gives
// 0 for Sunday, 1 for Monday ... 6 for Saturday.
export function startOfWeek(timestamp) {
  const day = new Date(timestamp).getDay()
  const daysSinceMonday = (day + 6) % 7
  return addDays(startOfDay(timestamp), -daysSinceMonday)
}
