import { useState } from 'react'
import { useStudyData } from '../data/useStudyData.js'
import { useAuth } from '../auth/AuthContext.js'
import { getUserName } from '../auth/userName.js'
import { formatDuration, formatLongDate } from '../utils/time.js'
import { newestFirst, sessionsOnDay, totalDuration } from '../utils/stats.js'
import SessionRow from '../components/SessionRow.jsx'
import { useNow } from '../utils/useNow.js'
import EmptyState from '../components/EmptyState.jsx'
import SubjectPicker from '../components/SubjectPicker.jsx'
import Timer from '../components/Timer.jsx'
import './TodayScreen.css'

export default function TodayScreen({ onNavigate }) {
  const { data, actions } = useStudyData()
  const { subjects, sessions, activeTimer } = data
  const name = getUserName(useAuth().user)
  const now = useNow(60_000) // once a minute is enough for the date
  const [chosenId, setChosenId] = useState(null)

  // Which subject is selected: the running one, else the one you tapped,
  // else the subject of your most recent session (if it still exists).
  const exists = (id) => subjects.some((s) => s.id === id)
  const lastUsedId = sessions.at(-1)?.subjectId
  const selectedId =
    activeTimer?.subjectId ??
    (exists(chosenId) ? chosenId : exists(lastUsedId) ? lastUsedId : null)
  const selectedSubject = subjects.find((s) => s.id === selectedId) ?? null

  // Today's finished sessions, newest first, and their total time
  const todaySessions = newestFirst(sessionsOnDay(sessions, now))
  const todayTotal = totalDuration(todaySessions)
  const subjectsById = new Map(subjects.map((s) => [s.id, s]))

  return (
    <>
      <div className="screen-header today-header">
        <h1 className="screen-title">{name ? `Hello, ${name}` : 'Today'}</h1>
        <p className="today-date">{formatLongDate(now)}</p>
      </div>

      <div className="today-layout">
        {subjects.length === 0 ? (
          <EmptyState
            title="Add a subject first"
            text="The timer needs to know what you’re studying. Add a subject like Biology or Maths, then come back here."
            actionLabel="Add a subject"
            onAction={() => onNavigate('subjects')}
          />
        ) : (
          <div className="today-main">
            <SubjectPicker
              subjects={subjects}
              value={selectedId}
              onChange={setChosenId}
              disabled={activeTimer !== null}
            />
            <Timer
              activeTimer={activeTimer}
              subject={selectedSubject}
              canStart={selectedSubject !== null}
              onStart={() => actions.startTimer(selectedId)}
              onStop={actions.stopTimer}
            />
          </div>
        )}

        {subjects.length > 0 ? (
          <section className="today-summary" aria-labelledby="today-total-label">
            <div className="today-total">
              <h2 id="today-total-label" className="today-total-label">
                Studied today
              </h2>
              <p className="today-total-value">{formatDuration(todayTotal)}</p>
            </div>
            {todaySessions.length === 0 ? (
              <p className="today-none">No sessions yet today. Your finished sessions will appear here.</p>
            ) : (
              <ul className="ruled-list">
                {todaySessions.map((session) => (
                  <SessionRow key={session.id} session={session} subject={subjectsById.get(session.subjectId)} />
                ))}
              </ul>
            )}
          </section>
        ) : null}
      </div>
    </>
  )
}
