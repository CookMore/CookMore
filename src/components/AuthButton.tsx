'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export function AuthButton() {
  const { login, ready } = useAuth()

  if (!ready) return null

  return (
    <button
      onClick={() => login()}
      className='px-4 py-2 bg-github-success-emphasis hover:bg-github-success-fg text-white rounded-md transition-colors'
    >
      Sign In
    </button>
  )
}
