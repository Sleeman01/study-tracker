// The 4 tabs. Each icon is a small inline SVG drawing (no icon library).
const TABS = [
  {
    id: 'today',
    label: 'Today',
    icon: (
      <>
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2.5 2.5M10 2h4" />
      </>
    ),
  },
  {
    id: 'subjects',
    label: 'Subjects',
    icon: (
      <>
        <path d="M5 4h10a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z" />
        <path d="M5 18a2 2 0 0 1 2-2h10M19 7v15" />
      </>
    ),
  },
  {
    id: 'stats',
    label: 'Stats',
    icon: <path d="M4 20h16M7 16v-5M12 16V6M17 16v-8" />,
  },
  {
    id: 'history',
    label: 'History',
    icon: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />,
  },
]

export default function TabBar({ currentTab, onTabChange }) {
  return (
    <nav className="tab-bar" aria-label="Main">
      <ul className="tab-bar-list">
        {TABS.map((tab) => (
          <li key={tab.id}>
            <button
              type="button"
              className="tab-button"
              aria-current={tab.id === currentTab ? 'page' : undefined}
              onClick={() => onTabChange(tab.id)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {tab.icon}
              </svg>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
