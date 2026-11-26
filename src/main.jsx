import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/ui.css'
import App from './App.jsx'
import StudyDataProvider from './data/StudyDataProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StudyDataProvider>
      <App />
    </StudyDataProvider>
  </StrictMode>,
)

// Register the service worker (offline support). Only in the built app:
// during development it would keep serving old files and confuse you.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
