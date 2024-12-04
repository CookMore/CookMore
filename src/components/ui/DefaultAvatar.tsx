import React from 'react'

export function DefaultAvatar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path
        fillRule='evenodd'
        d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3.5a3 3 0 100 6 3 3 0 000-6zm-5 9.5c0-1.5 3-2.5 5-2.5s5 1 5 2.5c0 2-2.5 3.5-5 3.5s-5-1.5-5-3.5z'
      />
    </svg>
  )
}

DefaultAvatar.path =
  'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3.5a3 3 0 100 6 3 3 0 000-6zm-5 9.5c0-1.5 3-2.5 5-2.5s5 1 5 2.5c0 2-2.5 3.5-5 3.5s-5-1.5-5-3.5z'
