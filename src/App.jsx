import { useState } from 'react'
import TabBar from './components/TabBar.jsx'
import TodayScreen from './screens/TodayScreen.jsx'
import SubjectsScreen from './screens/SubjectsScreen.jsx'
import StatsScreen from './screens/StatsScreen.jsx'
import HistoryScreen from './screens/HistoryScreen.jsx'
import './App.css'
import './components/ui.css'

// Which screen belongs to which tab id
const SCREENS = {
  today: TodayScreen,
  subjects: SubjectsScreen,
  stats: StatsScreen,
  history: HistoryScreen,
}

export default function App() {
  // The one piece of state that decides which screen is showing
  const [currentTab, setCurrentTab] = useState('today')

  function handleTabChange(tabId) {
    setCurrentTab(tabId)
    window.scrollTo(0, 0) // start each screen at the top
  }

  const Screen = SCREENS[currentTab]

  return (
    <div className="app">
      <main className="screen">
        <Screen onNavigate={handleTabChange} />
      </main>
      <TabBar currentTab={currentTab} onTabChange={handleTabChange} />
    </div>
  )
}
