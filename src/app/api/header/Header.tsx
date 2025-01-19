'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { ROUTES } from '@/app/api/routes/routes'
import { NavigationLinks } from '@/app/api/navigation/NavigationLinks'
import { MobileMenu } from './MobileMenu'
import { AuthButton } from '@/app/api/auth/AuthButton'
import { AdminButton } from '@/app/[locale]/(authenticated)/admin/components/AdminButton'
import { IconMenu, IconSearch } from '@/app/api/icons'
import { HeaderLoadingSkeleton } from './HeaderLoadingSkeleton'
import TimerControl from '@/app/api/components/widgets/TimerControl'
import { IconClock } from '@tabler/icons-react'
import { IconBook } from '@tabler/icons-react'
import useSound from 'use-sound'
import alarm1 from '@/app/api/sounds/alarm1.aac'
import alarm2 from '@/app/api/sounds/alarm2.aac'
import alarm3 from '@/app/api/sounds/alarm3.aac'
import { useTimer } from '@/app/api/components/widgets/useTimer'
import { SearchBar } from './SearchBar'
import { IconMembers } from '@/app/api/icons'
import { IconX } from '@tabler/icons-react'

interface HeaderProps {
  showAuthButton: boolean
}

export function Header({ showAuthButton }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isTimerDropdownOpen, setIsTimerDropdownOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isAuthenticated, hasProfile, isLoading } = useAuth()
  const [time, setTime] = useState<number>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [itemName, setItemName] = useState<string>('')
  const [selectedAlarm, setSelectedAlarm] = useState<string>('alarm1')

  const [play80s] = useSound(alarm1)
  const [playAlert] = useSound(alarm2)
  const [playClassic] = useSound(alarm3)

  const {
    time: timerTime,
    isRunning: timerIsRunning,
    startTimer,
    stopTimer,
    resetTimer,
  } = useTimer({
    initialTime: 0,
    onTimeUp: () => {
      alert('Time is up!')
    },
  })

  const handleToggleTimer = () => {
    if (timerIsRunning) {
      stopTimer()
    } else {
      startTimer()
    }
  }

  const handleAlarmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value
    setSelectedAlarm(selected)
    if (selected === 'alarm1') play80s()
    else if (selected === 'alarm2') playAlert()
    else if (selected === 'alarm3') playClassic()
  }

  return (
    <header className='sticky top-0 z-[99] w-full border-b border-github-border-default bg-github-canvas-default'>
      <div className='flex h-16 items-center justify-between'>
        <div className='flex items-center pl-4'>
          <Link
            href={
              isAuthenticated
                ? hasProfile
                  ? ROUTES.AUTH.DASHBOARD
                  : ROUTES.AUTH.PROFILE.CREATE
                : ROUTES.MARKETING.HOME
            }
            className='text-xl font-bold text-github-fg-default hover:text-github-fg-muted transition-colors'
          >
            CookMore
          </Link>

          {/* Hide SearchBar on mobile, show icon instead */}
          <div className='hidden sm:block ml-10'>
            <SearchBar />
          </div>
          <button
            onClick={() => setIsSearchOpen(true)}
            className='sm:hidden ml-4 p-2 rounded-full bg-github-canvas-subtle hover:bg-github-canvas-inset text-github-fg-default hover:text-github-fg-muted transition-colors border border-github-border-default'
          >
            <IconSearch className='h-6 w-6' />
          </button>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className='fixed inset-0 z-50 bg-github-canvas-default p-4 sm:hidden'>
            <div className='flex flex-col h-full'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-bold'>Search</h2>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className='p-2 text-github-fg-muted hover:text-github-fg-default'
                >
                  <IconX className='h-6 w-6' />
                </button>
              </div>
              <SearchBar onSearch={() => setIsSearchOpen(false)} />
            </div>
          </div>
        )}

        <div className='flex-1 flex justify-center'>
          <div className='hidden lg:block'>
            <NavigationLinks />
          </div>
        </div>

        <div className='flex items-center space-x-4 pr-4'>
          <button
            type='button'
            className='lg:hidden inline-flex items-center justify-center rounded-md p-2 text-github-fg-default hover:text-github-fg-muted hover:bg-github-canvas-subtle transition-colors'
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className='sr-only'>Open main menu</span>
            <IconMenu className='h-6 w-6' />
          </button>

          <div className='relative'>
            <button
              onClick={() => setIsTimerDropdownOpen(!isTimerDropdownOpen)}
              className={`p-2 rounded-full bg-github-canvas-subtle hover:bg-github-canvas-inset text-github-fg-default hover:text-github-fg-muted transition-colors border border-github-border-default ${timerIsRunning ? 'text-red-500' : ''}`}
            >
              <IconClock className='h-6 w-6' />
            </button>
            {isTimerDropdownOpen && (
              <div className='absolute right-0 mt-4 w-75 bg-white border border-gray-200 rounded-md shadow-lg'>
                <div className='p-2' style={{ width: '200px' }}>
                  <TimerControl
                    initialTime={timerTime}
                    isRunning={timerIsRunning}
                    onToggle={handleToggleTimer}
                    onTimeUp={() => {}}
                    itemName={itemName}
                  />
                </div>
              </div>
            )}
          </div>

          <Link
            href={ROUTES.AUTH.WIKI}
            className='p-2 rounded-full bg-github-canvas-subtle hover:bg-github-canvas-inset text-github-fg-default hover:text-github-fg-muted transition-colors border border-github-border-default'
          >
            <IconBook className='h-6 w-6' />
          </Link>

          <div className='hidden sm:block'>
            <AdminButton />
          </div>
          <div>{showAuthButton && <AuthButton />}</div>
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        <div className='block sm:hidden'>
          <AdminButton />
        </div>

        <div className='lg:hidden'>{showAuthButton && <AuthButton />}</div>

        <div className='mt-6'>
          <TimerControl
            initialTime={timerTime}
            isRunning={timerIsRunning}
            onToggle={handleToggleTimer}
            onTimeUp={() => {}}
            itemName={itemName}
          />
        </div>
      </MobileMenu>
    </header>
  )
}
