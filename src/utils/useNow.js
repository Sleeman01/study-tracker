import { useEffect, useState } from 'react'

// Gives the current time, updated every `intervalMs` milliseconds.
// It also updates straight away when you come back to the app,
// because phones pause timers in apps that are in the background.
export function useNow(intervalMs) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const tick = () => setNow(Date.now())
    const id = setInterval(tick, intervalMs)
    const handleVisibility = () => {
      if (!document.hidden) tick()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [intervalMs])

  return now
}
