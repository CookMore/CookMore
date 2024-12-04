'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useTheme } from '@/app/providers/ThemeProvider'
import { getStepsForTier, type ProfileStep } from '@/app/profile/steps'
import { ProfileTier } from '@/types/profile'

export function ProfileSteps() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const steps = getStepsForTier(ProfileTier.FREE) // Or get from context/props

  return (
    <div className='space-y-2'>
      {steps.map((step: ProfileStep) => {
        const isActive = pathname?.includes(step.id)
        const href = `/profile/create/${step.id}`

        return (
          <Link
            key={step.id}
            href={href}
            className={cn(
              'block w-full p-2 rounded-md transition-all',
              // Base styles
              'text-sm',
              // Neo theme styles
              theme === 'neo' && [
                'neo-border',
                'hover:-translate-y-[2px]',
                'hover:neo-shadow',
                isActive && 'bg-github-canvas-subtle',
              ],
              // Default theme styles
              theme !== 'neo' && [
                'hover:bg-github-canvas-subtle',
                isActive && 'bg-github-canvas-subtle text-github-fg-default',
              ]
            )}
          >
            {step.label}
          </Link>
        )
      })}
    </div>
  )
}
