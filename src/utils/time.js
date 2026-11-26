// Helpers for turning times and durations into friendly text.

// 5 -> "5 h", 2.5 -> "2.5 h"
export function formatHours(hours) {
  const rounded = Math.round(hours * 10) / 10
  return `${rounded} h`
}
