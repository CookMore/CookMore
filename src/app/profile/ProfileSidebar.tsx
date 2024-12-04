'use client'

import { usePathname } from 'next/navigation'
import { useTheme } from '@/app/providers/ThemeProvider'
import { cn } from '@/lib/utils'
import { useProfile } from '@/app/providers/ProfileProvider'
import { getStepsForTier } from './steps'
import { ProfileTier } from '@/types/profile'
import { IconLock, IconChevronLeft } from '@/components/ui/icons'
import { usePrivy } from '@privy-io/react-auth'
import { ProfileSteps } from './ProfileSteps'
import { useProfileSystem } from '@/hooks/useProfileSystem'
import { useState } from 'react'

export function ProfileSidebar() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const { user } = usePrivy()
  const { profile } = useProfile()
  const { hasPro, hasGroup } = useProfileSystem()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Get all steps for each tier
  const freeSteps = getStepsForTier(ProfileTier.FREE)
  const proSteps = getStepsForTier(ProfileTier.PRO)
  const groupSteps = getStepsForTier(ProfileTier.GROUP)

  // Get unique pro and group steps
  const proOnlySteps = proSteps.slice(freeSteps.length)
  const groupOnlySteps = groupSteps.slice(proSteps.length)

  return (
    <aside
      className={cn(
        'fixed left-0 top-14 bottom-0',
        'transition-all duration-300',
        'bg-github-canvas-default border-r border-github-border-default',
        isCollapsed ? 'w-16' : 'w-64',
        // Neo theme styles
        theme === 'neo' && [
          'neo-border border-l-0',
          'relative',
          'before:absolute before:inset-0 before:bg-github-canvas-default before:-z-10',
          'rotate-[-0.1deg]',
          'transition-all duration-300',
          'hover:rotate-0 hover:translate-y-[-2px]',
          'hover:neo-shadow',
        ],
        // Copper theme styles
        theme === 'copper' && ['shine-effect copper-shine', 'relative overflow-hidden'],
        // Steel theme styles
        theme === 'steel' && 'bg-steel-gradient'
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'absolute -right-3 top-2',
          'p-1 rounded-full bg-github-canvas-default',
          'border border-github-border-default',
          'text-github-fg-muted hover:text-github-fg-default',
          'transition-transform duration-300',
          isCollapsed && 'rotate-180',
          theme === 'neo' && 'neo-shadow hover:neo-shadow'
        )}
      >
        <IconChevronLeft className='w-4 h-4' />
      </button>

      <div className={cn('py-2 px-4', isCollapsed && 'hidden')}>
        <h2
          className={cn(
            'text-lg font-semibold mb-4 text-github-fg-default',
            theme === 'neo' && 'font-mono tracking-tight'
          )}
        >
          Profile Creation
        </h2>

        <div className={cn('space-y-6', theme === 'neo' && 'rotate-[-0.1deg]')}>
          {/* Free Steps */}
          <div>
            <ProfileSteps />
          </div>

          {/* Pro Steps */}
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <span
                className={cn(
                  'text-sm font-medium',
                  hasPro ? 'text-blue-500' : 'text-github-fg-default',
                  theme === 'neo' && 'font-mono tracking-tight'
                )}
              >
                Pro Features
              </span>
              {!hasPro && <IconLock className='w-4 h-4 text-github-fg-muted' />}
            </div>
            <div className={cn('space-y-2', !hasPro && 'opacity-50')}>
              {proOnlySteps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    'p-2 text-sm rounded-md transition-all',
                    theme === 'neo' && [
                      'neo-border',
                      'hover:-translate-y-[2px]',
                      'hover:neo-shadow',
                      hasPro && 'hover:rotate-[0.5deg]',
                    ],
                    hasPro && [
                      'text-blue-500',
                      'bg-blue-50 dark:bg-blue-900/10',
                      'hover:bg-blue-100 dark:hover:bg-blue-900/20',
                      'active:bg-blue-200 dark:active:bg-blue-900/30',
                      'border border-blue-200 dark:border-blue-800',
                      'cursor-pointer',
                    ],
                    !hasPro && 'text-github-fg-muted bg-github-canvas-subtle cursor-not-allowed'
                  )}
                >
                  {step.label}
                </div>
              ))}
            </div>
          </div>

          {/* Group Steps */}
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <span
                className={cn(
                  'text-sm font-medium',
                  hasGroup ? 'text-green-500' : 'text-github-fg-default',
                  theme === 'neo' && 'font-mono tracking-tight'
                )}
              >
                Group Features
              </span>
              {!hasGroup && <IconLock className='w-4 h-4 text-github-fg-muted' />}
            </div>
            <div className={cn('space-y-2', !hasGroup && 'opacity-50')}>
              {groupOnlySteps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    'p-2 text-sm rounded-md transition-all',
                    theme === 'neo' && [
                      'neo-border',
                      'hover:-translate-y-[2px]',
                      'hover:neo-shadow',
                      hasGroup && 'hover:rotate-[0.5deg]',
                    ],
                    hasGroup && [
                      'text-green-500',
                      'bg-green-50 dark:bg-green-900/10',
                      'hover:bg-green-100 dark:hover:bg-green-900/20',
                      'active:bg-green-200 dark:active:bg-green-900/30',
                      'border border-green-200 dark:border-green-800',
                      'cursor-pointer',
                    ],
                    !hasGroup && 'text-github-fg-muted bg-github-canvas-subtle cursor-not-allowed'
                  )}
                >
                  {step.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsed state with numbers */}
      {isCollapsed && (
        <div className='py-2 px-1'>
          <div className='space-y-2'>
            {/* Free steps numbers */}
            {freeSteps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-8 flex items-center justify-center',
                  'text-sm font-medium text-github-fg-muted',
                  theme === 'neo' && 'neo-border'
                )}
              >
                {index + 1}
              </div>
            ))}
            {/* Pro steps numbers */}
            {proOnlySteps.map((_, index) => (
              <div
                key={`pro-${index}`}
                className={cn(
                  'h-8 flex items-center justify-center',
                  'text-sm font-medium',
                  hasPro ? 'text-blue-500' : 'text-github-fg-muted opacity-50',
                  theme === 'neo' && 'neo-border'
                )}
              >
                {freeSteps.length + index + 1}
              </div>
            ))}
            {/* Group steps numbers */}
            {groupOnlySteps.map((_, index) => (
              <div
                key={`group-${index}`}
                className={cn(
                  'h-8 flex items-center justify-center',
                  'text-sm font-medium',
                  hasGroup ? 'text-green-500' : 'text-github-fg-muted opacity-50',
                  theme === 'neo' && 'neo-border'
                )}
              >
                {freeSteps.length + proOnlySteps.length + index + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
