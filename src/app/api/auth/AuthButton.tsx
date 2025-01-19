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
import { Icons } from '@/app/api/icons/icons'
import { IconTrophy } from '@/app/api/icons/icons'

export function AuthButton() {
  const { login, logout, isAuthenticated, ready, user, hasProfile, isLoading } = useAuth()
  const router = useRouter()

  const handleProfileClick = () => {
    if (!hasProfile) {
      router.push(ROUTES.AUTH.PROFILE.CREATE)
    } else {
      router.push(ROUTES.AUTH.PROFILE.HOME)
    }
  }

  const handleLogout = async () => {
    try {
      clearCookie('PRIVY_TOKEN')
      clearCookie('HAS_PROFILE')
      clearCookie('WALLET_ADDRESS')
      localStorage.clear()
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = ROUTES.MARKETING.HOME
    }
  }

  if (!ready) {
    return (
      <Button variant='ghost' size='sm' className='w-9 px-0'>
        <LoadingSpinner className='h-4 w-4' />
      </Button>
    )
  }

  if (!isAuthenticated) {
    return (
      <Button onClick={login} variant='ghost' size='sm'>
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='relative h-10 w-10 rounded-full bg-github-canvas-overlay hover:bg-github-btn-hover transition-all flex items-center justify-center'
        >
          {isLoading ? (
            <LoadingSpinner className='h-4 w-4' />
          ) : (
            <DefaultAvatar address={user?.wallet?.address} className='rounded-full' />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='bg-github-canvas-overlay shadow-lg rounded-md mt-2 p-2 w-48'
        style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
      >
        <DropdownMenuItem
          onClick={handleProfileClick}
          disabled={isLoading}
          className='hover:bg-github-canvas-subtle p-2 rounded-md cursor-pointer flex items-center transition-transform duration-200 hover:scale-105'
          style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}
        >
          <Icons.user className='mr-2 h-5 w-5 transition-transform duration-200 hover:scale-110 hover:text-blue-500' />
          <span className='flex-1 text-center mr-3 transition-transform duration-200 hover:scale-105'>
            {hasProfile ? 'Profile' : 'Create Profile'}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(ROUTES.AUTH.TIER)}
          disabled={isLoading}
          className='hover:bg-github-canvas-subtle p-2 rounded-md cursor-pointer flex items-center transition-transform duration-200 hover:scale-105'
          style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}
        >
          <IconTrophy className='mr-2 h-5 w-5 transition-transform duration-200 hover:scale-110 hover:text-blue-500' />
          <span className='flex-1 text-center mr-3 transition-transform duration-200 hover:scale-105'>
            Tier
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className='my-1' />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className='hover:bg-github-canvas-subtle p-2 rounded-md cursor-pointer flex items-center transition-transform duration-200 hover:scale-105'
          style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}
        >
          <Icons.lock className='mr-2 h-5 w-5 transition-transform duration-200 hover:scale-110 hover:text-blue-500' />
          <span className='flex-1 text-center mr-3 transition-transform duration-200 hover:scale-105'>
            Logout
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
