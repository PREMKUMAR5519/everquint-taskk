import { forwardRef } from 'react'
import './TextInput.scss'

const TextInput = forwardRef(function TextInput({ label, error, helper, ...props }, ref) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input ref={ref} className={`field__control ${error ? 'field__control--error' : ''}`} {...props} />
      {helper && <span className="field__helper">{helper}</span>}
      {error && <span className="field__error">{error}</span>}
    </label>
  )
})

export default TextInput
