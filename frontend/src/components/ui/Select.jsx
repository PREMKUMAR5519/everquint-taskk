import { useEffect, useRef, useState } from 'react'
import './Select.scss'
import { Check } from 'lucide-react'
function Select({ label, options = [], helper, value, onChange, name, ariaLabel, placeholder = 'Open', ...rest }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const selected = options.find((opt) => opt.value === value)

  useEffect(() => {
    const handleClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const handleSelect = (val) => {
    if (onChange) {
      onChange({ target: { name, value: val } })
    }
    setOpen(false)
  }

  return (
    <label className="field" ref={wrapperRef}>
      <span className="field__label">{label}</span>
      <div className="select">
        <button
          type="button"
          className="select__button"
          aria-expanded={open}
          aria-label={ariaLabel || label}
          onClick={() => setOpen((prev) => !prev)}
          {...rest}
        >
          <span>{selected?.label || placeholder}</span>
          <span className="select__caret"></span>
        </button>
        {open && (
          <div className="select__menu">
            <div className="select__header">{label}</div>
            <ul className="select__list">
              {options.map((opt) => (
                <li key={opt.value}>
                  <button type="button" className={`select__item ${opt.value === value ? 'selected' : ''}`} onClick={() => handleSelect(opt.value)}>
                    {opt.value === value && <span className="select__check"><Check size={15} /></span>}
                    <span className='value'>{opt.label}</span>

                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {helper && <span className="field__helper">{helper}</span>}
    </label>
  )
}

export default Select
