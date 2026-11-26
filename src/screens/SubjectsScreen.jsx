import { useState } from 'react'
import { useStudyData } from '../data/useStudyData.js'
import { nextFreeColor } from '../data/colors.js'
import { formatHours } from '../utils/time.js'
import Dialog from '../components/Dialog.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import EmptyState from '../components/EmptyState.jsx'
import SubjectForm from '../components/SubjectForm.jsx'
import Icon from '../components/Icon.jsx'
import AccountSection from '../components/AccountSection.jsx'

export default function SubjectsScreen() {
  const { data, actions } = useStudyData()
  const { subjects, sessions, activeTimer } = data

  // Which subject is open in the form: null = form closed, 'new' = adding
  const [editing, setEditing] = useState(null)
  // Which subject we're asking "are you sure?" about
  const [deleting, setDeleting] = useState(null)

  function handleSave(values) {
    if (editing === 'new') actions.addSubject(values)
    else actions.updateSubject(editing.id, values)
    setEditing(null)
  }

  function handleConfirmDelete() {
    actions.deleteSubject(deleting.id)
    setDeleting(null)
  }

  return (
    <>
      <div className="screen-header">
        <h1 className="screen-title">Subjects</h1>
        {subjects.length > 0 ? (
          <button type="button" className="button button-small" onClick={() => setEditing('new')}>
            <Icon name="plus" size={20} />
            Add subject
          </button>
        ) : null}
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          title="No subjects yet"
          text="Add the subjects you study, like Biology or Maths. Each one gets a color and an optional weekly goal."
          actionLabel="Add subject"
          onAction={() => setEditing('new')}
        />
      ) : (
        <ul className="ruled-list">
          {subjects.map((subject) => (
            <li key={subject.id} className="row">
              <span className="dot" style={{ '--dot': subject.color }} aria-hidden="true" />
              <div className="row-main">
                <p className="row-title">{subject.name}</p>
                <p className="row-meta">
                  {subject.weeklyGoalHours > 0
                    ? `Goal: ${formatHours(subject.weeklyGoalHours)} a week`
                    : 'No weekly goal'}
                </p>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label={`Edit ${subject.name}`}
                onClick={() => setEditing(subject)}
              >
                <Icon name="edit" />
              </button>
              <button
                type="button"
                className="icon-button icon-button-danger"
                aria-label={`Delete ${subject.name}`}
                onClick={() => setDeleting(subject)}
              >
                <Icon name="trash" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New subject' : 'Edit subject'}
      >
        <SubjectForm
          subject={editing === 'new' ? null : editing}
          defaultColor={nextFreeColor(subjects)}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      </Dialog>

      <AccountSection />

      <ConfirmDialog
        open={deleting !== null}
        title={`Delete ${deleting?.name ?? ''}?`}
        message={deleteMessage(deleting, sessions, activeTimer)}
        confirmLabel="Delete subject"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  )
}

// Tell the user exactly what will be removed
function deleteMessage(subject, sessions, activeTimer) {
  if (!subject) return ''
  const count = sessions.filter((s) => s.subjectId === subject.id).length
  let text =
    count === 0
      ? 'It has no study sessions yet.'
      : `This also deletes its ${count} study ${count === 1 ? 'session' : 'sessions'}.`
  if (activeTimer?.subjectId === subject.id) text += ' The running timer will stop.'
  return text
}
