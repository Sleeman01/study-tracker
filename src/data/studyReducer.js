// A "reducer" is one function that describes every way the data can
// change. It gets the current data and an "action" (what happened),
// and returns NEW data. It never changes the old data in place, which
// is how React notices that something changed.

export const MIN_SESSION_MS = 1000 // sessions shorter than 1 second are not saved

export function studyReducer(state, action) {
  switch (action.type) {
    case 'subject/add':
      return { ...state, subjects: [...state.subjects, action.subject] }

    case 'subject/update':
      return {
        ...state,
        subjects: state.subjects.map((s) =>
          s.id === action.id ? { ...s, ...action.changes } : s,
        ),
      }

    case 'subject/delete':
      // Deleting a subject also deletes its sessions (see PLAN.md)
      // and stops the timer if it was running for that subject.
      return {
        subjects: state.subjects.filter((s) => s.id !== action.id),
        sessions: state.sessions.filter((s) => s.subjectId !== action.id),
        activeTimer: state.activeTimer?.subjectId === action.id ? null : state.activeTimer,
      }

    case 'timer/start':
      if (state.activeTimer) return state // already running
      return {
        ...state,
        activeTimer: { subjectId: action.subjectId, startedAt: action.startedAt },
      }

    case 'timer/stop': {
      const timer = state.activeTimer
      if (!timer) return state
      const tooShort = action.endedAt - timer.startedAt < MIN_SESSION_MS
      const session = {
        id: action.sessionId,
        subjectId: timer.subjectId,
        startedAt: timer.startedAt,
        endedAt: action.endedAt,
      }
      return {
        ...state,
        activeTimer: null,
        sessions: tooShort ? state.sessions : [...state.sessions, session],
      }
    }

    case 'session/delete':
      return { ...state, sessions: state.sessions.filter((s) => s.id !== action.id) }

    case 'data/replace':
      // Used when the data changes in another tab of the app
      return action.data

    default:
      return state
  }
}
