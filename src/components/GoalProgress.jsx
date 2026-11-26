import { formatDuration, formatHours } from '../utils/time.js'
import Icon from './Icon.jsx'

const HOUR_MS = 3_600_000

// One subject's progress toward its weekly goal.
// The text says the numbers, so the bar is just a visual extra.
export default function GoalProgress({ subject, doneMs }) {
  const goalMs = subject.weeklyGoalHours * HOUR_MS
  const hasGoal = goalMs > 0
  const reached = hasGoal && doneMs >= goalMs
  const percent = hasGoal ? Math.min(100, (doneMs / goalMs) * 100) : 0

  return (
    <li className="goal">
      <div className="goal-line">
        <span className="dot" style={{ '--dot': subject.color }} aria-hidden="true" />
        <p className="goal-name">{subject.name}</p>
        <p className="goal-value">
          {hasGoal
            ? `${formatDuration(doneMs)} of ${formatHours(subject.weeklyGoalHours)}`
            : formatDuration(doneMs)}
        </p>
      </div>
      {hasGoal ? (
        <>
          <div className="goal-track" aria-hidden="true">
            <div className="goal-fill" style={{ width: `${percent}%`, '--dot': subject.color }} />
          </div>
          {reached ? (
            <p className="goal-status is-reached">
              <Icon name="check" size={16} />
              Goal reached
            </p>
          ) : null}
        </>
      ) : (
        <p className="goal-status">No weekly goal</p>
      )}
    </li>
  )
}
