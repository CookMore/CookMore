'use client'

import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/app/api/routes/routes'
import { Button } from '@/app/api/components/ui/button'
import { DefaultAvatar } from '@/app/api/avatar/DefaultAvatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/api/header/dropdown-menu'
import { LoadingSpinner } from '@/app/api/loading/LoadingSpinner'

export function AuthButton() {
  const { login, logout, isAuthenticated, ready, user, hasProfile } = useAuth()
  const router = useRouter()

  const handleProfileClick = () => {
    if (!hasProfile) {
      router.push(ROUTES.AUTH.PROFILE.CREATE)
    } else if (user?.wallet?.address) {
      router.push(`${ROUTES.AUTH.PROFILE.HOME}/${user.wallet.address}`)
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
            <DropdownMenuItem onClick={handleProfileClick}>Profile</DropdownMenuItem>
            {hasProfile && (
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
