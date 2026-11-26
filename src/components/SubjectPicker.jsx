// Choose which subject you're about to study.
// Each "chip" is a radio button underneath, so only one can be picked.
export default function SubjectPicker({ subjects, value, onChange, disabled }) {
  return (
    <fieldset className="picker" disabled={disabled}>
      <legend className="picker-legend">What are you studying?</legend>
      <div className="picker-list">
        {subjects.map((subject) => (
          <label key={subject.id} className="chip">
            <input
              type="radio"
              name="study-subject"
              className="sr-only"
              value={subject.id}
              checked={value === subject.id}
              onChange={() => onChange(subject.id)}
            />
            <span className="chip-face" style={{ '--dot': subject.color }}>
              <span className="dot" aria-hidden="true" />
              {subject.name}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
