import { SUBJECT_COLORS } from '../data/colors.js'
import Icon from './Icon.jsx'

// The 8 color circles. Underneath they are normal radio buttons,
// so they work with the keyboard and screen readers.
export default function ColorSwatches({ value, onChange }) {
  return (
    <fieldset className="field swatches">
      <legend className="field-label">Color</legend>
      <div className="swatch-list">
        {SUBJECT_COLORS.map((color) => (
          <label key={color.hex} className="swatch">
            <input
              type="radio"
              name="subject-color"
              className="sr-only"
              value={color.hex}
              checked={value === color.hex}
              onChange={() => onChange(color.hex)}
            />
            <span className="swatch-dot" style={{ '--swatch': color.hex }}>
              {value === color.hex ? <Icon name="check" size={18} /> : null}
            </span>
            <span className="sr-only">{color.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
