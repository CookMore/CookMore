'use client'

import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { Button } from '@/app/api/components/ui/button'

export function MarketingAuthButton() {
  const { isAuthenticated, login } = useAuth()

  console.log('Is Authenticated:', isAuthenticated) // Debugging log

  if (!isAuthenticated) {
    return (
      <Button
        onClick={login}
        className='inline-flex items-center justify-center rounded-md bg-github-btn-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-github-btn-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-github-btn-primary'
      >
        Get Started
      </Button>
    )
  }

  return null
}
