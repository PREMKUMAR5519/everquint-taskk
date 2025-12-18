import './TextArea.scss'

function TextArea({ label, error, helper, ...props }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <textarea className={`field__control field__control--textarea ${error ? 'field__control--error' : ''}`} {...props} />
      {helper && <span className="field__helper">{helper}</span>}
      {error && <span className="field__error">{error}</span>}
    </label>
  )
}

export default TextArea
