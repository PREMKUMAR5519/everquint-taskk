import { useEffect, useRef } from 'react'
import './Modal.scss'

function Modal({ title, isOpen, onClose, children, initialFocusRef }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen && initialFocusRef?.current) {
      initialFocusRef.current.focus()
    }
  }, [isOpen, initialFocusRef])

  if (!isOpen) return null

  const onOverlayClick = (event) => {
    if (event.target === overlayRef.current) {
      onClose()
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title} ref={overlayRef} onMouseDown={onOverlayClick}>
      <div className="modal__panel" role="document">
        <div className="modal__header">
          <h2>{title}</h2>
          <button className="modal__close" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
