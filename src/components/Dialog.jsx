import { useEffect, useId, useRef } from 'react'

// A pop-up sheet that slides up from the bottom of the screen.
// It uses the browser's built-in <dialog> element, which already
// handles focus, the Escape key and the dark backdrop for us.
export default function Dialog({ open, onClose, title, children }) {
  const ref = useRef(null)
  const titleId = useId()

  // Open or close the real <dialog> when the `open` prop changes
  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function handleClick(event) {
    // A click on the dark backdrop (outside the sheet) closes it
    if (event.target === ref.current) onClose()
  }

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleClick}
    >
      {open ? (
        <div className="dialog-body">
          <h2 id={titleId} className="dialog-title">
            {title}
          </h2>
          {children}
        </div>
      ) : null}
    </dialog>
  )
}
