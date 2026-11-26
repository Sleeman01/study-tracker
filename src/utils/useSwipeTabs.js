import { useEffect, useRef } from 'react'
import { TABS } from '../navigation.js'
import { dragOffset, neighbourTab, startsInSwipeArea, swipeResult } from './swipe.js'

// Swipe left/right on the screen to move between tabs.
// - Touch only: a mouse (pointerType 'mouse') never swipes.
// - CSS gives the screen `touch-action: pan-y`, so the browser still scrolls
//   up and down by itself. When it does, it sends "pointercancel" and the swipe stops.
// - Ignored inside dialogs, form fields, and anything marked data-no-swipe (the chart).
// - "Reduce motion": swiping still works, but nothing slides.
const IGNORE = 'dialog, input, textarea, select, [contenteditable], [data-no-swipe]'
const SLIDE_MS = 220

export function useSwipeTabs(screenRef, currentTab, onTabChange) {
  // Refs hold the latest values without making the listeners re-attach
  const tabRef = useRef(currentTab)
  const changeRef = useRef(onTabChange)
  useEffect(() => {
    tabRef.current = currentTab
    changeRef.current = onTabChange
  })

  useEffect(() => {
    const el = screenRef.current
    if (!el) return
    let gesture = null // { id, x, y, t, dragging }
    const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function reset() {
      gesture = null
      el.style.transform = ''
      el.style.transition = ''
    }

    function springBack(fromX) {
      if (reduceMotion() || !fromX) return reset()
      el.animate([{ transform: `translateX(${fromX}px)` }, { transform: 'none' }], {
        duration: 180,
        easing: 'ease-out',
      })
      reset()
    }

    function onDown(event) {
      if (event.pointerType !== 'touch' || !event.isPrimary) return
      if (document.querySelector('dialog[open]')) return
      if (event.target.closest(IGNORE)) return
      if (!startsInSwipeArea(event.clientX, window.innerWidth)) return
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, t: event.timeStamp, dragging: false }
    }

    function onMove(event) {
      if (!gesture || event.pointerId !== gesture.id) return
      const dx = event.clientX - gesture.x
      const dy = event.clientY - gesture.y
      if (!gesture.dragging) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) return reset() // scrolling
        if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy) * 1.5) return // not sure yet
        gesture.dragging = true
      }
      if (reduceMotion()) return
      const direction = dx < 0 ? 'next' : 'previous'
      const hasTab = neighbourTab(TABS, tabRef.current, direction) !== null
      el.style.transform = `translateX(${dragOffset(dx, hasTab)}px)`
    }

    function onUp(event) {
      if (!gesture || event.pointerId !== gesture.id) return
      const dx = event.clientX - gesture.x
      const result = swipeResult({
        dx,
        dy: event.clientY - gesture.y,
        dt: event.timeStamp - gesture.t,
        width: window.innerWidth,
      })
      const target = result ? neighbourTab(TABS, tabRef.current, result) : null
      const offset = gesture.dragging ? dragOffset(dx, target !== null) : 0
      if (!target) return springBack(offset)

      reset()
      changeRef.current(target)
      if (reduceMotion()) return
      // After React has drawn the new screen, slide it in from the side
      const from = result === 'next' ? Math.max(window.innerWidth * 0.35, -offset) : Math.min(-window.innerWidth * 0.35, -offset)
      requestAnimationFrame(() => {
        el.animate(
          [
            { transform: `translateX(${from}px)`, opacity: 0.4 },
            { transform: 'none', opacity: 1 },
          ],
          { duration: SLIDE_MS, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
        )
      })
    }

    function onCancel(event) {
      if (gesture && event.pointerId === gesture.id) springBack(0)
    }

    // passive: we never block scrolling, which keeps it smooth
    el.addEventListener('pointerdown', onDown, { passive: true })
    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerup', onUp, { passive: true })
    el.addEventListener('pointercancel', onCancel, { passive: true })
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onCancel)
    }
  }, [screenRef])
}
