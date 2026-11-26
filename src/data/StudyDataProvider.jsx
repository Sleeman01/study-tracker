import { useEffect, useMemo, useReducer } from 'react'
import { StudyDataContext } from './StudyDataContext.js'
import { studyReducer } from './studyReducer.js'
import { loadData, parseData, saveData, STORAGE_KEY } from './storage.js'
import { makeId } from './makeId.js'

export default function StudyDataProvider({ children }) {
  // loadData runs once, when the app starts
  const [data, dispatch] = useReducer(studyReducer, undefined, () => loadData())

  // Save every time the data changes
  useEffect(() => {
    saveData(data)
  }, [data])

  // If the app is open in two tabs, keep them in sync
  useEffect(() => {
    function handleStorage(event) {
      if (event.key === STORAGE_KEY) {
        dispatch({ type: 'data/replace', data: parseData(event.newValue) })
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Friendly functions the screens call. Ids and times are created
  // here, so the reducer itself stays simple and predictable.
  const actions = useMemo(
    () => ({
      addSubject: ({ name, color, weeklyGoalHours }) =>
        dispatch({
          type: 'subject/add',
          subject: { id: makeId(), name, color, weeklyGoalHours, createdAt: Date.now() },
        }),
      updateSubject: (id, changes) => dispatch({ type: 'subject/update', id, changes }),
      deleteSubject: (id) => dispatch({ type: 'subject/delete', id }),
      startTimer: (subjectId) =>
        dispatch({ type: 'timer/start', subjectId, startedAt: Date.now() }),
      stopTimer: () => dispatch({ type: 'timer/stop', sessionId: makeId(), endedAt: Date.now() }),
      deleteSession: (id) => dispatch({ type: 'session/delete', id }),
    }),
    [],
  )

  const value = useMemo(() => ({ data, actions }), [data, actions])

  return <StudyDataContext value={value}>{children}</StudyDataContext>
}
