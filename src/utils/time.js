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
