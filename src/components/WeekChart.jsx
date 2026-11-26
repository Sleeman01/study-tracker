import { useState } from 'react'
import { chartScale } from '../utils/stats.js'
import { formatDuration, formatHours } from '../utils/time.js'

const HOUR_MS = 3_600_000
const shortDay = new Intl.DateTimeFormat(undefined, { weekday: 'short' })
const longDay = new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' })

// Bar chart of study time for each day of the week.
// Each bar is a real button: tap it to see that day's exact time.
export default function WeekChart({ days, todayStart }) {
  const todayIndex = days.findIndex((d) => d.dayStart === todayStart)
  const [selected, setSelected] = useState(todayIndex === -1 ? 0 : todayIndex)
  const { top, ticks } = chartScale(Math.max(...days.map((d) => d.total)))
  const chosen = days[selected]

  return (
    // data-no-swipe: tapping and dragging across the bars must not change tabs
    <figure className="week-chart" data-no-swipe>
      <figcaption className="sr-only">Hours studied each day this week</figcaption>

      {/* The readout: shows the exact time of the tapped day */}
      <p className="week-readout" aria-live="polite">
        <span className="week-readout-day">
          {selected === todayIndex ? 'Today' : longDay.format(chosen.dayStart)}
        </span>
        <span className="week-readout-value">{formatDuration(chosen.total)}</span>
      </p>

      <div className="week-plot">
        {/* Gridlines with hour labels, positioned as a % of the bar area */}
        <div className="week-grid-layer" aria-hidden="true">
          {ticks.map((tick) => (
            <div key={tick} className="week-grid" style={{ bottom: `${(tick / top) * 100}%` }}>
              <span className="week-tick">{formatHours(tick)}</span>
            </div>
          ))}
        </div>

        <div className="week-bars">
          {days.map((day, i) => {
            const height = (day.total / HOUR_MS / top) * 100
            return (
              <button
                key={day.dayStart}
                type="button"
                className={i === selected ? 'week-col is-selected' : 'week-col'}
                aria-pressed={i === selected}
                aria-label={`${longDay.format(day.dayStart)}: ${formatDuration(day.total)}`}
                onClick={() => setSelected(i)}
              >
                <span className="week-bar-area">
                  <span
                    className={day.total > 0 ? 'week-bar' : 'week-bar is-zero'}
                    style={day.total > 0 ? { height: `${height}%` } : undefined}
                  />
                </span>
                <span className={i === todayIndex ? 'week-day is-today' : 'week-day'}>
                  {shortDay.format(day.dayStart)}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </figure>
  )
}
