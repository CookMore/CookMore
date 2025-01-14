'use client'

import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/api/components/ui/button'
import { ROUTES } from '@/app/api/routes/routes'
import { useEffect } from 'react'

export function MarketingAuthButton() {
  const { isAuthenticated, login, isLoading, hasProfile } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    if (!isAuthenticated) {
      login()
    }
  }

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('Checking redirect conditions:', { isAuthenticated, isLoading, hasProfile })
      if (hasProfile) {
        console.log('Redirecting to Kitchen')
        router.push(ROUTES.AUTH.KITCHEN)
      } else {
        console.log('Redirecting to Create Profile')
        router.push(ROUTES.AUTH.PROFILE.CREATE)
      }
    }
  }, [isAuthenticated, isLoading, hasProfile, router])

  return (
    <Button
      onClick={handleLogin}
      className='hover:bg-github-canvas-subtle p-2 rounded-md cursor-pointer flex items-center transition-transform duration-200 hover:scale-105'
      style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}
    >
      Get Started
    </Button>
  )
}
