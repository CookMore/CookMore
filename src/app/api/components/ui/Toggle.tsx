interface ToggleProps {
  checked: boolean
  onChange: () => void
  className?: string
}

export function Toggle({ checked, onChange, className = '' }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full border border-github-border-default ${className}`}
    >
      <span
        className={`
          ${
            checked
              ? 'translate-x-6 bg-github-success-emphasis'
              : 'translate-x-1 bg-github-fg-muted'
          }
          inline-block h-4 w-4 transform rounded-full transition-transform
        `}
      />
    </button>
  )
}
