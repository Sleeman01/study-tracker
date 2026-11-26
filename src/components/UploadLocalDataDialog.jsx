import { useState } from 'react'
import Dialog from './Dialog.jsx'
import { useAuth } from '../auth/AuthContext.js'
import { useStudyData } from '../data/useStudyData.js'
import { loadData, STORAGE_KEY } from '../data/storage.js'
import { askedKey, BACKUP_KEY, describeCounts, hasLocalData, prepareUpload } from '../data/migration.js'
import { uploadStudyData } from '../data/cloudStore.js'
import { isOfflineError } from '../data/syncMessages.js'

// On first login: "You have data on this device. Upload it to your account?"
export default function UploadLocalDataDialog() {
  const { user } = useAuth()
  const { actions } = useStudyData()

  // Worked out once, when the dialog first appears
  const [local] = useState(() => prepareUpload(loadData(localStorage, STORAGE_KEY)))
  const [alreadyAsked] = useState(() => localStorage.getItem(askedKey(user.id)) !== null)
  // 'ask' -> 'uploading' -> 'done', or 'closed'
  const [step, setStep] = useState(!alreadyAsked && hasLocalData(local) ? 'ask' : 'closed')
  const [error, setError] = useState('')

  function remember(answer) {
    localStorage.setItem(askedKey(user.id), answer)
  }

  function handleNotNow() {
    remember('skipped') // the data stays on the device, and we won't ask again
    setStep('closed')
  }

  async function handleUpload() {
    setStep('uploading')
    setError('')
    try {
      await uploadStudyData(local)
    } catch (uploadError) {
      setError(
        isOfflineError(uploadError)
          ? "You're offline. Connect to the internet, then try again."
          : "The upload didn't work. Your data is still on this device, so you can try again.",
      )
      setStep('ask') // let them try again
      return
    }
    remember('uploaded')
    // Keep a backup, and clear the old key so other accounts on this
    // device aren't offered the same data again
    localStorage.setItem(BACKUP_KEY, localStorage.getItem(STORAGE_KEY) ?? '')
    localStorage.removeItem(STORAGE_KEY)
    if (local.activeTimer) actions.startTimer(local.activeTimer.subjectId, local.activeTimer.startedAt)
    await actions.refresh() // show the uploaded data on every screen
    setStep('done')
  }

  const counts = describeCounts(local)

  return (
    <Dialog
      open={step !== 'closed'}
      // Escape or tapping outside just closes it for now; we'll ask next time
      onClose={() => step !== 'uploading' && setStep('closed')}
      title={step === 'done' ? 'All uploaded' : 'Bring your old data along?'}
    >
      {step === 'done' ? (
        <>
          <p className="dialog-text">
            {counts.charAt(0).toUpperCase() + counts.slice(1)} are now saved in your account.
          </p>
          <button type="button" className="button upload-done" onClick={() => setStep('closed')}>
            Done
          </button>
        </>
      ) : (
        <>
          <p className="dialog-text">
            This device has {counts} saved from before you had an account. Upload them to your
            account so they&apos;re safe and show up on your other devices?
          </p>
          {error ? (
            <p role="alert" className="field-error upload-error">
              {error}
            </p>
          ) : null}
          <div className="dialog-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={handleNotNow}
              disabled={step === 'uploading'}
            >
              Not now
            </button>
            <button
              type="button"
              className="button"
              onClick={handleUpload}
              disabled={step === 'uploading'}
            >
              {step === 'uploading' ? 'Uploading…' : error ? 'Try again' : 'Upload'}
            </button>
          </div>
        </>
      )}
    </Dialog>
  )
}
