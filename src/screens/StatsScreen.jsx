import { useStudyData } from '../data/useStudyData.js'
import { weekTotals } from '../utils/stats.js'
import { formatDuration, startOfDay } from '../utils/time.js'
import { useNow } from '../utils/useNow.js'
import WeekChart from '../components/WeekChart.jsx'
import './StatsScreen.css'

const dayMonth = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' })

export default function StatsScreen() {
  const { data } = useStudyData()
  const now = useNow(60_000)

  const days = weekTotals(data.sessions, now)
  const weekTotal = days.reduce((sum, d) => sum + d.total, 0)
  const weekRange = dayMonth.formatRange(days[0].dayStart, days[6].dayStart)

  return (
    <>
      <div className="screen-header">
        <h1 className="screen-title">Stats</h1>
      </div>

      <section className="stats-section" aria-labelledby="week-title">
        <div className="stats-section-header">
          <div>
            <h2 id="week-title" className="stats-section-title">
              This week
            </h2>
            <p className="stats-section-meta">{weekRange}</p>
          </div>
          <p className="stats-section-value">{formatDuration(weekTotal)}</p>
        </div>
        <WeekChart key={days[0].dayStart} days={days} todayStart={startOfDay(now)} />
      </section>
    </>
  )
}
