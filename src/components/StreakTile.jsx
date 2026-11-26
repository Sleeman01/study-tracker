import Icon from './Icon.jsx'

// The study streak as one big number with a short explanation
export default function StreakTile({ streak, studiedToday }) {
  let hint
  if (streak === 0) hint = 'Study today to start a streak.'
  else if (studiedToday) hint = 'You studied today. Come back tomorrow to keep it going.'
  else hint = 'Study today to keep it going.'

  return (
    <section className="streak" aria-labelledby="streak-title">
      <span className={streak > 0 ? 'streak-icon is-on' : 'streak-icon'}>
        <Icon name="flame" size={28} />
      </span>
      <div>
        <h2 id="streak-title" className="streak-title">
          {streak === 0 ? 'No streak yet' : `${streak}-day streak`}
        </h2>
        <p className="streak-hint">{hint}</p>
      </div>
    </section>
  )
}
