import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { ROUTES } from '@/app/api/routes/routes'

interface UseInitialAuthResult {
  isAuthenticated: boolean
  login: () => void
  ready: boolean
  router: ReturnType<typeof useRouter>
  hasProfile: boolean | null
}

export function useInitialAuth(): UseInitialAuthResult {
  const router = useRouter()
  const { ready, isAuthenticated, login, hasProfile } = useAuth()

  useEffect(() => {
    if (ready) {
      if (isAuthenticated) {
        if (hasProfile) {
          console.log('Redirecting to dashboard.')
          router.push(ROUTES.AUTH.DASHBOARD)
        } else {
          console.log('Redirecting to profile creation.')
          router.push(ROUTES.AUTH.PROFILE.CREATE)
        }
      }
    }
  }, [ready, isAuthenticated, hasProfile, router])

  return {
    isAuthenticated,
    login,
    ready,
    router,
    hasProfile,
  }
}
