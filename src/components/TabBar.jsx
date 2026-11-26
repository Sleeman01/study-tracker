import Icon from './Icon.jsx'
import { TABS } from '../navigation.js'

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
              <Icon name={tab.id} />
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
