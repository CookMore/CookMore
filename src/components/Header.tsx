'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  IconPlus,
  IconChevronDown,
  IconBook,
  IconSearch,
  IconMenu,
  IconX,
  IconStore,
  IconFrame,
  IconUser,
  IconSettings,
  IconSignOut,
} from '@/components/ui/icons'
import { useProfile } from '@/hooks/useProfile'
import * as Popover from '@radix-ui/react-popover'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ipfsService } from '@/lib/services/ipfs-service'
import { BaseNameDisplay } from '../app/profile/BaseNameDisplay'
import * as Tooltip from '@radix-ui/react-tooltip'
import { DefaultAvatar } from '@/components/ui/DefaultAvatar'
import { useTheme } from '@/app/providers/ThemeProvider'
import { cn } from '@/lib/utils'
import { User } from '@privy-io/react-auth'
import type { ProfileMetadata } from '@/types/profile'

// Define the extended user type
interface PrivyUser extends User {
  email?: {
    address: string
    verified: boolean
    profileImage?: string
  }
}

// Add this interface for the menu items
interface MenuItemProps {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

// Add this helper component for themed navigation links
const NavLink = ({
  href,
  children,
  disabled,
  className,
}: {
  href: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
}) => {
  const router = useRouter()
  const { theme } = useTheme()

  const content = <>{children}</>

  const styles = cn(
    'flex items-center space-x-1 px-3 py-2 text-sm transition-all',
    // Neo theme styles - Always use button styles
    theme === 'neo' && [
      'neo-border hover:-translate-y-[2px]',
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:neo-shadow active:translate-y-[1px]',
      'bg-github-canvas-default',
      'rotate-[-0.1deg]',
      'hover:rotate-0',
    ],
    // Other themes - Link styles
    theme !== 'neo' && [
      'rounded-md',
      disabled
        ? 'text-github-fg-muted cursor-not-allowed opacity-40'
        : 'text-github-fg-muted hover:text-github-fg-default hover:bg-github-canvas-subtle',
    ],
    className
  )

  // Use button for Neo theme, link for others
  return theme === 'neo' ? (
    <button onClick={() => !disabled && router.push(href)} disabled={disabled} className={styles}>
      {content}
    </button>
  ) : (
    <Link
      href={disabled ? '#' : href}
      className={styles}
      onClick={disabled ? (e) => e.preventDefault() : undefined}
    >
      {content}
    </Link>
  )
}

// Update the MenuItem component to use theme styles
const MenuItem = ({ href, onClick, children, className }: MenuItemProps) => {
  const { theme } = useTheme()

  const styles = cn(
    'w-full px-3 py-2 text-sm transition-all',
    theme === 'neo' && [
      'neo-border hover:-translate-y-[2px]',
      'my-1 mx-1',
      onClick ? 'hover:neo-shadow active:translate-y-[1px]' : 'hover:neo-shadow',
    ],
    theme !== 'neo' && ['hover:bg-github-canvas-subtle', 'text-github-fg-default'],
    className
  )

  if (href) {
    return (
      <DropdownMenu.Item asChild>
        <Link href={href} className={styles}>
          {children}
        </Link>
      </DropdownMenu.Item>
    )
  }

  return (
    <DropdownMenu.Item asChild>
      <button onClick={onClick} className={styles}>
        {children}
      </button>
    </DropdownMenu.Item>
  )
}

const ADMIN_WALLET = '0x1920F5b512634DE346100b025382c04eEA8Bbc67'

export function Header() {
  const router = useRouter()
  const { authenticated, user, login, logout, hasProfile } = useAuth()
  const privyUser = user as PrivyUser | null
  const pathname = usePathname()
  const { profile, isLoading } = useProfile()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme } = useTheme()

  // Check if current user is admin
  const isAdmin = user?.wallet?.address?.toLowerCase() === ADMIN_WALLET.toLowerCase()

  // Separate navigation items for marketing and app
  const marketingNavItems = [
    {
      name: 'Features',
      href: '/features',
      Icon: IconFrame,
    },
    {
      name: 'Explore',
      href: '/explore',
      Icon: IconSearch,
    },
    {
      name: 'Pricing',
      href: '/pricing',
      Icon: IconStore,
    },
    {
      name: 'Club',
      href: '/club',
      Icon: IconStore,
    },
  ]

  const appNavItems = [
    {
      name: 'Kitchen',
      href: '/kitchen',
      Icon: IconBook,
    },
    {
      name: 'Explore',
      href: '/kitchen/explore',
      Icon: IconSearch,
    },
    {
      name: 'Club',
      href: authenticated ? '/kitchen/club' : '/club',
      Icon: IconStore,
    },
    {
      name: 'Tier',
      href: '/kitchen/tier',
      Icon: IconUser,
    },
    // Add Admin button only for admin users
    ...(isAdmin
      ? [
          {
            name: 'Admin',
            href: '/admin',
            Icon: IconSettings,
            className: 'text-red-500',
          },
        ]
      : []),
  ]

  // Choose which nav items to show based on auth state
  const navItems = authenticated ? appNavItems : marketingNavItems

  // Update the handleProfileClick function
  const handleProfileClick = async () => {
    if (!profile) {
      router.push('/profile/create')
    } else {
      router.push('/profile')
    }
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mb-8',
        'bg-github-canvas-default border-b border-github-border-default',
        theme === 'neo' && [
          'neo-border border-b-0',
          'before:absolute before:inset-0 before:bg-github-canvas-default before:-z-10',
          'hover:translate-y-[-2px] transition-transform',
          'rotate-[-0.2deg]',
          'hover:rotate-0 transition-all duration-300',
        ],
        theme === 'copper' && 'shine-effect copper-shine',
        theme === 'steel' && 'bg-steel-gradient'
      )}
    >
      <div className='container mx-auto px-4'>
        <div className='flex h-14 items-center justify-between'>
          {/* Left section */}
          <div className='flex items-center space-x-4'>
            <Link
              href={authenticated ? '/kitchen' : '/'}
              className='text-github-fg-default font-bold text-xl'
            >
              CookMore
            </Link>

            {/* Only show search in authenticated state */}
            {authenticated && (
              <div className='hidden md:block w-64 lg:w-96'>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='Search recipes...'
                    className='w-full px-3 py-1.5 bg-github-canvas-default border border-github-border-default rounded-md text-sm'
                  />
                </div>
              </div>
            )}
          </div>

          {/* Center section - Navigation */}
          <nav className='hidden md:flex items-center space-x-4'>
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                href={item.href}
                className={pathname?.startsWith(item.href) ? 'bg-github-canvas-subtle' : ''}
              >
                <item.Icon className='w-4 h-4' />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right section */}
          <div className='flex items-center space-x-3'>
            {authenticated ? (
              <>
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className='md:hidden text-github-fg-muted hover:text-github-fg-default'
                >
                  <IconMenu className='w-6 h-6' />
                </button>

                {/* Profile Menu */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className='flex items-center'>
                      <div className='relative'>
                        {profile?.metadata.avatar ? (
                          <Image
                            src={ipfsService.getIPFSUrl(profile.metadata.avatar)}
                            alt='Profile'
                            width={32}
                            height={32}
                            className='rounded-full'
                          />
                        ) : (
                          <DefaultAvatar className='w-8 h-8 text-github-fg-muted' />
                        )}
                      </div>
                      <IconChevronDown className='w-4 h-4 ml-1 text-github-fg-muted' />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className='z-[9999] min-w-[220px] bg-github-canvas-default rounded-md shadow-lg py-1 mt-2 border border-github-border-default'
                      sideOffset={5}
                      align='end'
                    >
                      <MenuItem
                        href={profile ? '/profile' : '/profile/create'}
                        className='flex items-center'
                      >
                        <IconUser className='w-4 h-4 mr-2' />
                        {profile ? 'Your Profile' : 'Create Profile'}
                      </MenuItem>

                      <MenuItem href='/profile/settings' className='flex items-center'>
                        <IconSettings className='w-4 h-4 mr-2' />
                        Settings
                      </MenuItem>

                      <MenuItem
                        onClick={() => logout()}
                        className='flex items-center text-github-danger-fg'
                      >
                        <IconSignOut className='w-4 h-4 mr-2' />
                        Sign Out
                      </MenuItem>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </>
            ) : (
              <button
                onClick={() => login()}
                className='px-3 py-1.5 text-sm bg-github-success-emphasis text-white rounded-md hover:bg-github-success-fg'
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden border-t border-github-border-default'>
          <div
            className={cn('flex flex-col items-center py-4 space-y-2', theme === 'neo' && 'p-4')}
          >
            {navItems.map((item) => (
              <NavLink key={item.name} href={item.href} className='w-full justify-center'>
                <item.Icon className='w-5 h-5' />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
