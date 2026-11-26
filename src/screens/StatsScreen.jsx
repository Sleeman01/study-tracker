import { useStudyData } from '../data/useStudyData.js'
import { sessionsOnDay, studyStreak, subjectWeekTotals, weekTotals } from '../utils/stats.js'
import { formatDuration, startOfDay } from '../utils/time.js'
import { useNow } from '../utils/useNow.js'
import GoalProgress from '../components/GoalProgress.jsx'
import StreakTile from '../components/StreakTile.jsx'
import WeekChart from '../components/WeekChart.jsx'
import './StatsScreen.css'

const dayMonth = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' })

export default function StatsScreen({ onNavigate }) {
  const { data } = useStudyData()
  const { subjects, sessions } = data
  const now = useNow(60_000)

  const days = weekTotals(sessions, now)
  const weekTotal = days.reduce((sum, d) => sum + d.total, 0)
  const weekRange = dayMonth.formatRange(days[0].dayStart, days[6].dayStart)
  const perSubject = subjectWeekTotals(sessions, now)
  const streak = studyStreak(sessions, now)
  const studiedToday = sessionsOnDay(sessions, now).length > 0

  return (
    <>
      <div className="screen-header">
        <h1 className="screen-title">Stats</h1>
      </div>

      <div className="stats-layout">
        <div className="stats-main">
          <StreakTile streak={streak} studiedToday={studiedToday} />

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
        </div>

        <section className="stats-section" aria-labelledby="goals-title">
          <div className="stats-section-header">
            <h2 id="goals-title" className="stats-section-title">
              Weekly goals
            </h2>
          </div>
          {subjects.length === 0 ? (
            <div className="stats-empty">
              <p>Add subjects with a weekly goal to see your progress here.</p>
              <button type="button" className="button button-secondary" onClick={() => onNavigate('subjects')}>
                Go to Subjects
              </button>
            </div>
          ) : (
            <ul className="goal-list">
              {subjects.map((subject) => (
                <GoalProgress key={subject.id} subject={subject} doneMs={perSubject.get(subject.id) ?? 0} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
