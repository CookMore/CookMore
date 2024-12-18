'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { ROUTES } from '@/app/api/routes/routes'
import { DefaultAvatar } from '@/app/api/avatar/DefaultAvatar'
import { cn } from '@/app/api/utils/utils'
import { LoadingSkeleton } from '@/app/api/loading/LoadingSkeleton'
import type {
  FreeProfileMetadata,
  ProProfileMetadata,
  GroupProfileMetadata,
} from '@/app/[locale]/(authenticated)/profile/profile'

type ProfileMetadata = FreeProfileMetadata | ProProfileMetadata | GroupProfileMetadata

export function MarketingAuthButton() {
  const { isAuthenticated, isLoading, user, hasProfile, profile, login, logout } = useAuth()

  if (isLoading) {
    return <LoadingSkeleton className='h-9 w-24' />
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={login}
        className='inline-flex items-center justify-center rounded-md bg-github-btn-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-github-btn-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-github-btn-primary'
      >
        Get Started
      </button>
    )
  }

  const profileData = profile as ProfileMetadata

  return (
    <Menu as='div' className='relative'>
      <Menu.Button className='flex items-center gap-2'>
        {profileData?.avatar ? (
          <img
            src={profileData.avatar}
            alt={profileData.name || 'Profile'}
            className='h-8 w-8 rounded-full'
          />
        ) : (
          <DefaultAvatar address={user?.wallet?.address} size={32} />
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-github-canvas-overlay py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <Menu.Item>
            {({ active }) => (
              <Link
                href={hasProfile ? ROUTES.AUTH.PROFILE.HOME : ROUTES.AUTH.PROFILE.CREATE}
                className={cn(
                  active ? 'bg-github-canvas-subtle' : '',
                  'block px-4 py-2 text-sm text-github-fg-default'
                )}
              >
                {hasProfile ? 'Profile' : 'Create Profile'}
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={logout}
                className={cn(
                  active ? 'bg-github-canvas-subtle' : '',
                  'block w-full px-4 py-2 text-left text-sm text-github-fg-default'
                )}
              >
                Sign Out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
