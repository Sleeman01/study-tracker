import { sessionDuration } from '../utils/stats.js'
import { formatDuration, formatTime } from '../utils/time.js'
import Icon from './Icon.jsx'

// One study session as a line: color, subject, times, duration.
// `onDelete` is optional: without it there's no delete button.
export default function SessionRow({ session, subject, onDelete }) {
  const name = subject?.name ?? 'Deleted subject'
  const duration = formatDuration(sessionDuration(session))

  return (
    <li className="row">
      <span className="dot" style={{ '--dot': subject?.color ?? 'var(--rule)' }} aria-hidden="true" />
      <div className="row-main">
        <p className="row-title">{name}</p>
        <p className="row-meta">
          {formatTime(session.startedAt)} – {formatTime(session.endedAt)}
        </p>
      </div>
      <span className="row-value">{duration}</span>
      {onDelete ? (
        <button
          type="button"
          className="icon-button icon-button-danger"
          aria-label={`Delete ${name} session from ${formatTime(session.startedAt)}`}
          onClick={() => onDelete(session)}
        >
          <Icon name="trash" />
        </button>
      ) : null}
    </li>
  )
}
