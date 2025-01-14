'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { ROUTES } from '@/app/api/routes/routes'
import { NavigationLinks } from '@/app/api/navigation/NavigationLinks'
import { MobileMenu } from './MobileMenu'
import { AuthButton } from '@/app/api/auth/AuthButton'
import { AdminButton } from '@/app/[locale]/(authenticated)/admin/components/AdminButton'
import { IconMenu } from '@/app/api/icons'
import { IconMembers } from '@/app/api/icons/IconMembers'
import { HeaderLoadingSkeleton } from './HeaderLoadingSkeleton'
import TimerControl from '@/app/api/components/widgets/TimerControl'
import { IconClock } from '@tabler/icons-react'
import useSound from 'use-sound'
import alarm1 from '@/app/api/sounds/alarm1.aac'
import alarm2 from '@/app/api/sounds/alarm2.aac'
import alarm3 from '@/app/api/sounds/alarm3.aac'
import { useTimer } from '@/app/api/components/widgets/useTimer'

interface HeaderProps {
  showAuthButton: boolean
}

export function Header({ showAuthButton }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isTimerDropdownOpen, setIsTimerDropdownOpen] = useState(false)
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

  const handleAlarmChange = (e) => {
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
        </div>

        <div className='hidden lg:block flex-1 px-4'>
          <NavigationLinks />
        </div>

        <div className='flex items-center space-x-4 pr-4'>
          <Link
            href={ROUTES.AUTH.MEMBERS}
            className='text-github-fg-default hover:text-github-fg-muted transition-colors'
          >
            <IconMembers className='h-6 w-6' />
          </Link>

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
              className={`text-github-fg-default hover:text-github-fg-muted transition-colors ${timerIsRunning ? 'text-red-500' : ''}`}
            >
              <IconClock className='h-6 w-6' />
            </button>
            {isTimerDropdownOpen && (
              <div className='absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg'>
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

        <div className='mt-4'>
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
