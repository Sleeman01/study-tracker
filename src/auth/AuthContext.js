import { createContext, use } from 'react'

// Shares "who is logged in" with every component (like StudyDataContext)
export const AuthContext = createContext(null)

export function useAuth() {
  const value = use(AuthContext)
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>')
  return value
}
