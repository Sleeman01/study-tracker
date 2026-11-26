// The rules for "does this finger movement count as a swipe?"
// Plain functions with no React, so they are easy to test.

export const SWIPE = {
  edgeZone: 20, // px at each side left to the phone's own back gesture
  directionRatio: 1.5, // sideways must be 1.5x bigger than up/down
  distanceShare: 0.3, // a slow swipe must cover 30% of the screen width...
  flickDistance: 50, // ...or a quick flick of at least 50px
  flickSpeed: 0.4, // px per millisecond
  stretch: 0.25, // how far the screen follows when there's no tab that way
}

// 'next', 'previous' or null (not a swipe)
// dx, dy = how far the finger moved; dt = how long it took (ms)
export function swipeResult({ dx, dy, dt, width }) {
  const sideways = Math.abs(dx)
  if (sideways < Math.abs(dy) * SWIPE.directionRatio) return null
  const far = sideways >= width * SWIPE.distanceShare
  const flick = sideways >= SWIPE.flickDistance && sideways / Math.max(dt, 1) >= SWIPE.flickSpeed
  if (!far && !flick) return null
  // Finger moves left (dx < 0) = pull the next page in from the right
  return dx < 0 ? 'next' : 'previous'
}

// The tab id next to `current`, or null at either end (no wrapping)
export function neighbourTab(tabs, current, direction) {
  const index = tabs.findIndex((tab) => tab.id === current)
  const next = tabs[index + (direction === 'next' ? 1 : -1)]
  return next ? next.id : null
}

export function startsInSwipeArea(x, width) {
  return x > SWIPE.edgeZone && x < width - SWIPE.edgeZone
}

// How far the screen moves with the finger
export function dragOffset(dx, hasTabThatWay) {
  return hasTabThatWay ? dx : dx * SWIPE.stretch
}
