import Icon from './Icon.jsx'
import { TABS } from '../navigation.js'
import { useAuth } from '../auth/AuthContext.js'
import { getUserName } from '../auth/userName.js'

// The app's main navigation. It's ONE list of buttons; CSS decides how it looks:
//   phone  (< 700px):    a bar along the bottom
//   tablet (700-1099px): a narrow rail down the left side
//   PC     (>= 1100px):  a sidebar, drawn like a notebook's margin
export default function MainNav({ currentTab, onTabChange }) {
  const name = getUserName(useAuth().user)
  return (
    <nav className="main-nav" aria-label="Main">
      <p className="nav-brand">Study Tracker</p>
      <ul className="nav-list">
        {TABS.map((tab) => (
          <li key={tab.id} className={`nav-item nav-item-${tab.id}`}>
            <button
              type="button"
              className="nav-button"
              aria-current={tab.id === currentTab ? 'page' : undefined}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon name={tab.id} />
              <span className="nav-text">
                <span className="nav-label">{tab.label}</span>
                {/* Only shown in the PC sidebar */}
                {tab.id === 'profile' && name ? <span className="nav-name">{name}</span> : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
