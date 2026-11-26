import { useState } from 'react'
import { useAuth } from './auth/AuthContext.js'
import StudyDataProvider from './data/StudyDataProvider.jsx'
import AuthScreen from './screens/AuthScreen.jsx'
import UploadLocalDataDialog from './components/UploadLocalDataDialog.jsx'
import TabBar from './components/TabBar.jsx'
import TodayScreen from './screens/TodayScreen.jsx'
import SubjectsScreen from './screens/SubjectsScreen.jsx'
import StatsScreen from './screens/StatsScreen.jsx'
import HistoryScreen from './screens/HistoryScreen.jsx'
import './App.css'

// Which screen belongs to which tab id
const SCREENS = {
  today: TodayScreen,
  subjects: SubjectsScreen,
  stats: StatsScreen,
  history: HistoryScreen,
}

// The "gate": checks if you're logged in, then shows either the
// login screen or the app with its tabs.
export default function App() {
  const { session, user, recovering } = useAuth()

  if (session === undefined) {
    return (
      <p className="splash" role="status">
        Loading…
      </p>
    )
  }
  if (!session || recovering) return <AuthScreen />

  // key={user.id}: if a different person logs in, React starts the data
  // fresh for them instead of keeping the previous person's data around.
  return (
    <StudyDataProvider key={user.id}>
      <TabsApp />
    </StudyDataProvider>
  )
}

// The app you already know: 4 screens and the bottom tab bar
function TabsApp() {
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
      <UploadLocalDataDialog />
    </div>
  )
}
