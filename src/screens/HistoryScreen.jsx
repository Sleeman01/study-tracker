import { useState } from 'react'
import { useStudyData } from '../data/useStudyData.js'
import { groupByDay, sessionDuration } from '../utils/stats.js'
import { formatDayLabel, formatDuration, formatTime, startOfDay } from '../utils/time.js'
import { useNow } from '../utils/useNow.js'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import EmptyState from '../components/EmptyState.jsx'
import SessionRow from '../components/SessionRow.jsx'
import './HistoryScreen.css'

export default function HistoryScreen({ onNavigate }) {
  const { data, actions } = useStudyData()
  const now = useNow(60_000)
  const [deleting, setDeleting] = useState(null) // the session we're asking about

  const subjectsById = new Map(data.subjects.map((s) => [s.id, s]))
  const days = groupByDay(data.sessions)

  function handleConfirmDelete() {
    actions.deleteSession(deleting.id)
    setDeleting(null)
  }

  return (
    <>
      <div className="screen-header">
        <h1 className="screen-title">History</h1>
      </div>

      {days.length === 0 ? (
        <EmptyState
          title="No sessions yet"
          text="Choose a subject on the Today tab and press Start studying. When you stop, the session is saved here."
          actionLabel="Go to Today"
          onAction={() => onNavigate('today')}
        />
      ) : (
        days.map((day) => (
          <section key={day.dayStart} className="history-day" aria-label={formatDayLabel(day.dayStart, now)}>
            <div className="history-day-header">
              <h2 className="history-day-title">{formatDayLabel(day.dayStart, now)}</h2>
              <p className="history-day-total">{formatDuration(day.total)}</p>
            </div>
            <ul className="ruled-list">
              {day.sessions.map((session) => (
                <SessionRow
                  key={session.id}
                  session={session}
                  subject={subjectsById.get(session.subjectId)}
                  onDelete={setDeleting}
                />
              ))}
            </ul>
          </section>
        ))
      )}

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this session?"
        message={deleting ? describeSession(deleting, subjectsById, now) : ''}
        confirmLabel="Delete session"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  )
}

// "Biology, 50 min (Today, 9:22 AM). This can’t be undone."
function describeSession(session, subjectsById, now) {
  const name = subjectsById.get(session.subjectId)?.name ?? 'Deleted subject'
  const day = formatDayLabel(startOfDay(session.startedAt), now)
  const duration = formatDuration(sessionDuration(session))
  return `${name}, ${duration} (${day}, ${formatTime(session.startedAt)}). This can’t be undone.`
}
