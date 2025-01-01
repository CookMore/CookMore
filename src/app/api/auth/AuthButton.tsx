'use client'

import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/app/api/routes/routes'
import { Button } from '@/app/api/components/ui/button'
import { DefaultAvatar } from '@/app/api/avatar/DefaultAvatar'
import { COOKIE_NAMES } from '@/app/api/auth/constants'
import { clearCookie } from '@/app/api/utils/client-cookies'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/api/header/dropdown-menu'
import { LoadingSpinner } from '@/app/api/loading/LoadingSpinner'

export function AuthButton() {
  const { login, logout, isAuthenticated, ready, user, hasProfile, isLoading } = useAuth()
  const router = useRouter()

  const handleProfileClick = () => {
    if (!hasProfile) {
      router.push(ROUTES.AUTH.PROFILE.CREATE)
    } else if (user?.wallet?.address) {
      router.push(`${ROUTES.AUTH.PROFILE.HOME}/${user.wallet.address}`)
    }
  }

  const handleLogout = async () => {
    try {
      // First clear cookies with proper attributes
      clearCookie('PRIVY_TOKEN')
      clearCookie('HAS_PROFILE')
      clearCookie('WALLET_ADDRESS')

      // Then perform the logout
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Force reload to marketing page even if logout fails
      window.location.href = ROUTES.MARKETING.HOME
    }
  }

  // Only show loading state when Privy is not ready
  if (!ready) {
    return (
      <Button variant='ghost' size='sm' className='w-9 px-0'>
        <LoadingSpinner className='h-4 w-4' />
      </Button>
    )
  }

  // Show login button if not authenticated
  if (!isAuthenticated) {
    return (
      <Button onClick={login} variant='ghost' size='sm'>
        Connect Wallet
      </Button>
    )
  }

  // Show authenticated state with loading indicator if needed
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='relative h-8 w-8 rounded-full'>
          {isLoading ? (
            <LoadingSpinner className='h-4 w-4' />
          ) : (
            <DefaultAvatar address={user?.wallet?.address} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={handleProfileClick} disabled={isLoading}>
          {hasProfile ? 'View Profile' : 'Create Profile'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
