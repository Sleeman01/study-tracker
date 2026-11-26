import Dialog from './Dialog.jsx'

// "Are you sure?" before deleting something
export default function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel} title={title}>
      <p className="dialog-text">{message}</p>
      <div className="dialog-actions">
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="button button-danger" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  )
}
