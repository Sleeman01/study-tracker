import { use } from 'react'
import { StudyDataContext } from './StudyDataContext.js'

// Any screen can call useStudyData() to get { data, actions }
export function useStudyData() {
  const value = use(StudyDataContext)
  if (!value) throw new Error('useStudyData must be used inside <StudyDataProvider>')
  return value
}
