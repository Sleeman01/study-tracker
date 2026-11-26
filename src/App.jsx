import { useState } from 'react'
import { useAuth } from './auth/AuthContext.js'
import StudyDataProvider from './data/StudyDataProvider.jsx'
import AuthScreen from './screens/AuthScreen.jsx'
import NameScreen from './screens/NameScreen.jsx'
import { getUserName } from './auth/userName.js'
import UploadLocalDataDialog from './components/UploadLocalDataDialog.jsx'
import MainNav from './components/MainNav.jsx'
import TodayScreen from './screens/TodayScreen.jsx'
import SubjectsScreen from './screens/SubjectsScreen.jsx'
import StatsScreen from './screens/StatsScreen.jsx'
import HistoryScreen from './screens/HistoryScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import './App.css'

// Which screen belongs to which tab id
const SCREENS = {
  today: TodayScreen,
  subjects: SubjectsScreen,
  stats: StatsScreen,
  history: HistoryScreen,
  profile: ProfileScreen,
}

// The "gate": checks if you're logged in, then shows either the
// login screen or the app with its tabs.
export default function App() {
  const { session, user, recovering } = useAuth()
  // Which account chose "Continue without a name" (only offered when offline).
  // It's not saved anywhere, so the question comes back next time.
  const [skippedNameFor, setSkippedNameFor] = useState(null)

  if (session === undefined) {
    return (
      <p className="splash" role="status">
        Loading…
      </p>
    )
  }
  if (!session || recovering) return <AuthScreen />
  if (!getUserName(user) && skippedNameFor !== user.id) {
    return <NameScreen onContinue={() => setSkippedNameFor(user.id)} />
  }

  // key={user.id}: if a different person logs in, React starts the data
  // fresh for them instead of keeping the previous person's data around.
  return (
    <StudyDataProvider key={user.id}>
      <TabsApp />
    </StudyDataProvider>
  )
}

// The app you already know: 5 screens and the main navigation
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
      <MainNav currentTab={currentTab} onTabChange={handleTabChange} />
      <main className="screen" data-screen={currentTab}>
        <Screen onNavigate={handleTabChange} />
      </main>
      <UploadLocalDataDialog />
    </div>
  )
}
