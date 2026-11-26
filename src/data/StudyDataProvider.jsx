import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { StudyDataContext } from './StudyDataContext.js'
import { MIN_SESSION_MS, studyReducer } from './studyReducer.js'
import { loadData, parseData, saveData, userStorageKey } from './storage.js'
import { makeId } from './makeId.js'
import * as cloud from './cloudStore.js'
import { useAuth } from '../auth/AuthContext.js'

// Gives every screen { data, actions }, exactly like before accounts.
// The difference: each change is now also saved to Supabase.
//
// How a change works ("optimistic update"):
//   1. The reducer updates the screen straight away (feels instant).
//   2. The change is sent to Supabase in the background.
//   3. If that fails, a message appears and we reload the real data.
export default function StudyDataProvider({ children }) {
  const { user } = useAuth()
  const storageKey = userStorageKey(user.id)

  // Start from this account's copy on the device (if there is one),
  // so the screens show something at once, even offline.
  const hasDeviceCopy = useRef(localStorage.getItem(storageKey) !== null)
  const [data, dispatch] = useReducer(studyReducer, storageKey, (key) => loadData(localStorage, key))
  // 'loading' (no copy yet), 'ready', or 'failed' (couldn't load at all)
  const [status, setStatus] = useState(hasDeviceCopy.current ? 'ready' : 'loading')
  const [message, setMessage] = useState('')

  // The latest data, for actions that need it (like stopping the timer)
  const dataRef = useRef(data)
  useEffect(() => {
    dataRef.current = data
    saveData(data, localStorage, storageKey) // keep the device copy up to date
  }, [data, storageKey])

  // ----- Saving: one change at a time, in order -----------------------
  // A queue makes sure "add subject" reaches the database before
  // "add session" for that subject, even on a slow connection.
  const queue = useRef(Promise.resolve())
  const pendingSaves = useRef(0)
  const changeCount = useRef(0) // goes up with every change

  // ----- Loading from the cloud ---------------------------------------
  const refresh = useCallback(async () => {
    const changesBefore = changeCount.current
    try {
      const fresh = await cloud.fetchStudyData()
      // If you changed something while we were loading, this copy is
      // already out of date: skip it rather than undo your change.
      if (pendingSaves.current === 0 && changeCount.current === changesBefore) {
        dispatch({ type: 'data/loaded', ...fresh })
      }
      hasDeviceCopy.current = true
      setStatus('ready')
    } catch (error) {
      setStatus((current) => (current === 'loading' ? 'failed' : current))
      // Keep an existing message (like "your change wasn't saved")
      setMessage(
        (current) =>
          current ||
          (hasDeviceCopy.current
            ? "Can't reach your account right now. Showing the copy saved on this device."
            : cloud.friendlySyncError(error)),
      )
    }
  }, [])

  const save = useCallback(
    (cloudCall) => {
      changeCount.current += 1
      pendingSaves.current += 1
      queue.current = queue.current.then(async () => {
        try {
          await cloudCall()
        } catch (error) {
          setMessage(cloud.friendlySyncError(error))
          pendingSaves.current -= 1
          refresh() // show what is really saved
          return
        }
        pendingSaves.current -= 1
      })
    },
    [refresh],
  )

  // Load when the app opens, when you come back to it, and when the
  // internet comes back (you may have changed things on another device).
  useEffect(() => {
    refresh()
    function handleVisible() {
      if (document.visibilityState === 'visible') refresh()
    }
    window.addEventListener('online', refresh)
    document.addEventListener('visibilitychange', handleVisible)
    return () => {
      window.removeEventListener('online', refresh)
      document.removeEventListener('visibilitychange', handleVisible)
    }
  }, [refresh])

  // If the app is open in two tabs, keep them in sync (same as before)
  useEffect(() => {
    function handleStorage(event) {
      if (event.key === storageKey && event.newValue) {
        dispatch({ type: 'data/replace', data: parseData(event.newValue) })
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [storageKey])

  // ----- The actions the screens call (same names as before) ----------
  const actions = useMemo(
    () => ({
      addSubject: ({ name, color, weeklyGoalHours }) => {
        const subject = { id: makeId(), name, color, weeklyGoalHours, createdAt: Date.now() }
        dispatch({ type: 'subject/add', subject })
        save(() => cloud.addSubject(subject))
      },
      updateSubject: (id, changes) => {
        dispatch({ type: 'subject/update', id, changes })
        save(() => cloud.updateSubject(id, changes))
      },
      deleteSubject: (id) => {
        dispatch({ type: 'subject/delete', id })
        save(() => cloud.deleteSubject(id))
      },
      // The running timer stays on this device, so starting it saves nothing to the cloud.
      // startedAt is only passed when an old timer is carried over (Story 15).
      startTimer: (subjectId, startedAt = Date.now()) =>
        dispatch({ type: 'timer/start', subjectId, startedAt }),
      stopTimer: () => {
        const timer = dataRef.current.activeTimer
        // Mark it stopped now, so a quick double tap can't save it twice
        dataRef.current = { ...dataRef.current, activeTimer: null }
        const sessionId = makeId()
        const endedAt = Date.now()
        dispatch({ type: 'timer/stop', sessionId, endedAt })
        // Same rule as the reducer: very short sessions aren't saved
        if (timer && endedAt - timer.startedAt >= MIN_SESSION_MS) {
          const session = { id: sessionId, subjectId: timer.subjectId, startedAt: timer.startedAt, endedAt }
          save(() => cloud.addSession(session))
        }
      },
      deleteSession: (id) => {
        dispatch({ type: 'session/delete', id })
        save(() => cloud.deleteSession(id))
      },
      refresh,
    }),
    [save, refresh],
  )

  const value = useMemo(() => ({ data, actions }), [data, actions])

  if (status === 'loading') {
    return (
      <p className="splash" role="status">
        Loading your study data…
      </p>
    )
  }

  if (status === 'failed') {
    return (
      <div className="splash">
        <div className="load-failed" role="alert">
          <p>{message}</p>
          <button
            type="button"
            className="button"
            onClick={() => {
              setStatus('loading')
              refresh()
            }}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <StudyDataContext value={value}>
      {children}
      {message ? <SyncMessage text={message} onClose={() => setMessage('')} /> : null}
    </StudyDataContext>
  )
}

// A small note above the tab bar when something couldn't be saved or loaded
function SyncMessage({ text, onClose }) {
  return (
    <div className="sync-message" role="alert">
      <p>{text}</p>
      <button type="button" className="sync-message-close" onClick={onClose}>
        OK
      </button>
    </div>
  )
}
