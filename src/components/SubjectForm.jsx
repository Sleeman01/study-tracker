import { useId, useRef, useState } from 'react'
import ColorSwatches from './ColorSwatches.jsx'

const MAX_GOAL_HOURS = 100

// The form for adding or editing a subject.
// `subject` is the subject being edited, or null when adding a new one.
export default function SubjectForm({ subject, defaultColor, onSave, onCancel }) {
  const [name, setName] = useState(subject?.name ?? '')
  const [color, setColor] = useState(subject?.color ?? defaultColor)
  const [goal, setGoal] = useState(subject ? String(subject.weeklyGoalHours) : '')
  const [errors, setErrors] = useState({})
  const nameId = useId()
  const goalId = useId()
  const nameRef = useRef(null)
  const goalRef = useRef(null)

  function handleSubmit(event) {
    event.preventDefault() // stop the browser reloading the page
    const trimmedName = name.trim()
    // Accept "2,5" as well as "2.5"; an empty goal means 0
    const hours = goal.trim() === '' ? 0 : Number(goal.replace(',', '.'))

    const newErrors = {}
    if (!trimmedName) newErrors.name = 'Give the subject a name.'
    if (!Number.isFinite(hours) || hours < 0 || hours > MAX_GOAL_HOURS) {
      newErrors.goal = `Enter a number of hours from 0 to ${MAX_GOAL_HOURS}.`
    }
    setErrors(newErrors)
    // Move the cursor to the first field that needs fixing
    if (newErrors.name) return nameRef.current.focus()
    if (newErrors.goal) return goalRef.current.focus()

    onSave({ name: trimmedName, color, weeklyGoalHours: hours })
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field-label" htmlFor={nameId}>
          Name
        </label>
        <input
          id={nameId}
          ref={nameRef}
          name="subject-name"
          className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          autoComplete="off"
          placeholder="e.g. Biology…"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? `${nameId}-error` : undefined}
        />
        {errors.name ? (
          <p id={`${nameId}-error`} className="field-error">
            {errors.name}
          </p>
        ) : null}
      </div>

      <ColorSwatches value={color} onChange={setColor} />

      <div className="field">
        <label className="field-label" htmlFor={goalId}>
          Weekly goal (hours)
        </label>
        <input
          id={goalId}
          ref={goalRef}
          name="weekly-goal"
          autoComplete="off"
          className="input input-short"
          type="text"
          inputMode="decimal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. 5…"
          aria-invalid={errors.goal ? true : undefined}
          aria-describedby={errors.goal ? `${goalId}-error` : `${goalId}-hint`}
        />
        {errors.goal ? (
          <p id={`${goalId}-error`} className="field-error">
            {errors.goal}
          </p>
        ) : (
          <p id={`${goalId}-hint`} className="field-hint">
            Leave empty for no goal.
          </p>
        )}
      </div>

      <div className="dialog-actions">
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button">
          {subject ? 'Save changes' : 'Add subject'}
        </button>
      </div>
    </form>
  )
}
