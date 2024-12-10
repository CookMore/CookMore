'use client'

import { useAuth } from '@/lib/auth/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/routes'
import { Button } from '@/components/ui/button'
import { DefaultAvatar } from '@/components/ui/DefaultAvatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function AuthButton() {
  const { login, logout, isAuthenticated, ready, user, profile, getProfileTier } = useAuth()
  const router = useRouter()

  const handleProfileClick = async () => {
    if (!profile) {
      const tier = await getProfileTier(user?.wallet?.address || '')
      router.push(`${ROUTES.AUTH.PROFILE.CREATE}?tier=${tier}`)
    } else {
      router.push(ROUTES.AUTH.PROFILE.HOME)
    }
  }

  if (!ready) {
    return (
      <Button disabled>
        <LoadingSpinner className='w-4 h-4' />
      </Button>
    )
  }

  return (
    <>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <DefaultAvatar address={user?.wallet?.address} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleProfileClick}>
              {profile ? 'View Profile' : 'Create Profile'}
            </DropdownMenuItem>
            {profile && (
              <DropdownMenuItem onClick={() => router.push(ROUTES.AUTH.KITCHEN.HOME)}>
                Kitchen
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={login}>Sign In</Button>
      )}
    </>
  )
}
