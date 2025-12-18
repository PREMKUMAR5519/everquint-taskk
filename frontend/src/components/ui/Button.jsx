import './Button.scss'

function Button({ children, variant = 'primary', size = 'md', type = 'button', ...props }) {
  const className = `button button--${variant} button--${size}`
  return (
    <button type={type} className={className} {...props}>
      {children}
    </button>
  )
}

export default Button
