// All the app's icons in one place: small SVG drawings, no icon library.
// Each one is drawn on a 24 x 24 grid with lines (strokes).
const PATHS = {
  today: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M10 2h4" />
    </>
  ),
  subjects: (
    <>
      <path d="M5 4h10a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z" />
      <path d="M5 18a2 2 0 0 1 2-2h10M19 7v15" />
    </>
  ),
  stats: <path d="M4 20h16M7 16v-5M12 16V6M17 16v-8" />,
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
    </>
  ),
  history: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />,
  plus: <path d="M12 5v14M5 12h14" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  play: <path d="M8 5.5v13l10.5-6.5z" />,
  stop: <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />,
  flame: <path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.5-5.4 3.7-8.3.4 1.9 1.4 3 2.5 3.6C12 7 13 4.6 15 3c.2 3.2 3.5 5.6 3.5 10.1 0 4.5-2.8 7.9-6.5 7.9z" />,
}

export default function Icon({ name, size = 24 }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}
