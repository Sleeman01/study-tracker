import { formatClock, formatTime } from '../utils/time.js'
import { useNow } from '../utils/useNow.js'
import Icon from './Icon.jsx'

// The big timer. While it runs, a band of the subject's color
// sweeps in behind the digits, like a highlighter.
export default function Timer({ activeTimer, subject, canStart, onStart, onStop }) {
  const running = activeTimer !== null

  return (
    <section className="timer" style={{ '--subject': subject?.color ?? 'transparent' }}>
      <div className={running ? 'timer-face is-running' : 'timer-face'}>
        <span className="timer-highlight" aria-hidden="true" />
        {running ? <RunningClock startedAt={activeTimer.startedAt} /> : <span className="timer-digits">0:00:00</span>}
      </div>

      <p className="timer-caption" aria-live="polite">
        {running
          ? `Studying ${subject?.name ?? ''} since ${formatTime(activeTimer.startedAt)}`
          : canStart
            ? `Ready to study ${subject.name}`
            : 'Choose a subject to start.'}
      </p>

      {running ? (
        <button type="button" className="button button-secondary button-large" onClick={onStop}>
          <Icon name="stop" />
          Stop and save
        </button>
      ) : (
        <button type="button" className="button button-large" onClick={onStart} disabled={!canStart}>
          <Icon name="play" />
          Start studying
        </button>
      )}
    </section>
  )
}

// Only this small part re-draws every second, not the whole screen
function RunningClock({ startedAt }) {
  const now = useNow(1000)
  return (
    <span className="timer-digits" role="timer">
      {formatClock(now - startedAt)}
    </span>
  )
}
