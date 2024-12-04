import { usePrivy } from '@privy-io/react-auth'
import { useProfile } from '@/hooks/useProfile'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

const PUBLIC_ROUTES = ['/', '/pricing']
const NO_PROFILE_ROUTES = ['/profile']

export function PrivyAuthWrapper({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = usePrivy()
  const { profile, isLoading } = useProfile()
  const pathname = usePathname()
  const router = useRouter()

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
  const isNoProfileRoute = NO_PROFILE_ROUTES.includes(pathname)

  useEffect(() => {
    if (!ready) return

    // Allow public routes regardless of auth state
    if (isPublicRoute) {
      return
    }

    // If not authenticated, redirect to home
    if (!authenticated) {
      router.push('/')
      return
    }

    // If authenticated but no profile, redirect to profile setup
    // unless already on a no-profile route
    if (authenticated && !isLoading && !profile && !isNoProfileRoute) {
      router.push('/profile')
      return
    }
  }, [ready, authenticated, profile, isLoading, isPublicRoute, isNoProfileRoute, router])

  // Always render children on public routes
  if (isPublicRoute) {
    return children
  }

  // Show loading state while checking auth/profile
  if (!ready || isLoading) {
    return null
  }

  return children
}
