// What a screen shows when there's nothing in it yet:
// a short explanation and one button that says what to do next.
export default function EmptyState({ title, text, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-text">{text}</p>
      {actionLabel ? (
        <button type="button" className="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
