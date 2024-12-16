'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/app/api/components/ui/button'
import { LoadingSpinner } from '@/app/api/loading/LoadingSpinner'
import { ROUTES } from '@/app/api/routes/routes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/api/header/dropdown-menu'

export function MarketingAuthButton() {
  const { login, logout, authenticated, ready, user } = usePrivy()
  const router = useRouter()

  // Redirect authenticated users to profile creation or kitchen
  useEffect(() => {
    if (authenticated && ready) {
      router.push(ROUTES.AUTH.PROFILE.CREATE)
    }
  }, [authenticated, ready, router])

  if (!ready) {
    return (
      <Button disabled>
        <LoadingSpinner className='w-4 h-4' />
      </Button>
    )
  }

  if (authenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost'>{user?.email || 'Account'}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return <Button onClick={login}>Sign In</Button>
}
