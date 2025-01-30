import React, { useState, useEffect } from 'react'
import AZSearch from './AZSearch'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { cn } from '@/app/api/utils/utils'
import { IconChevronLeft } from '@/app/api/icons'
import { ChefHat, Crown, Users, Star, Search, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import YourRecipesSearch from './YourRecipesSearch'

// Tier Icons and Colors
const tierIcons: Record<Lowercase<keyof typeof ProfileTier>, typeof ChefHat> = {
  free: ChefHat,
  pro: Crown,
  group: Users,
  og: Star,
} as const

const tierColors = {
  free: 'text-blue-500 bg-blue-500/10',
  pro: 'text-purple-500 bg-purple-500/10',
  group: 'text-amber-500 bg-amber-500/10',
  og: 'text-emerald-500 bg-emerald-500/10',
} as const

const tierKey = (tier: ProfileTier | keyof typeof ProfileTier) => {
  const tierMap = {
    [ProfileTier.FREE]: 'free',
    [ProfileTier.PRO]: 'pro',
    [ProfileTier.GROUP]: 'group',
    [ProfileTier.OG]: 'og',
  } as const

  return (tierMap[tier as ProfileTier] ?? 'free') as Lowercase<keyof typeof ProfileTier>
}

interface User {
  profileTier?: string
}

const MenuSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const { user } = useAuth()

  // Determine the current tier
  const currentTier = user?.profileTier || 'free'

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const sidebarBaseClasses = cn(
    'fixed left-0 top-16 bottom-0',
    'flex flex-col border-r border-github-border-default',
    'bg-github-canvas-default',
    'transition-all duration-300 ease-in-out',
    'z-[40]',
    isExpanded ? 'w-[280px]' : 'w-[48px]'
  )

  // Function to handle icon click
  const handleIconClick = (section: string) => {
    setIsExpanded(true)
    // Logic to highlight the respective area
    console.log(`Open and highlight ${section}`)
  }

  // Icons to show when the sidebar is retracted
  const retractedIcons = (
    <div className='flex flex-col items-center space-y-4 py-4'>
      <Search
        className='w-6 h-6 text-github-fg-muted hover:text-github-fg-default cursor-pointer'
        onClick={() => handleIconClick('search')}
      />
      <Settings
        className='w-6 h-6 text-github-fg-muted hover:text-github-fg-default cursor-pointer'
        onClick={() => handleIconClick('settings')}
      />
    </div>
  )

  if (!isMounted) {
    return (
      <div className={sidebarBaseClasses}>
        <div className='animate-pulse p-4'>
          <div className='h-8 bg-github-canvas-subtle rounded w-3/4 mb-4'></div>
          <div className='h-6 bg-github-canvas-subtle rounded w-1/2'></div>
        </div>
      </div>
    )
  }

  const TierIcon = tierIcons[tierKey(currentTier)]

  return (
    <div className={sidebarBaseClasses}>
      {/* Header with Toggle Button */}
      <div className='flex items-center justify-between border-b border-github-border-default py-5 px-4'>
        <h2
          className={cn(
            'text-base font-bold text-github-fg-default transition-opacity text-center flex-1 mt-1',
            !isExpanded && 'opacity-0'
          )}
        >
          Menu
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'flex items-center justify-center',
            'w-8 h-8 rounded-full',
            'bg-github-canvas-default',
            'border-2 border-github-border-default',
            'hover:bg-github-canvas-subtle transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis focus:ring-offset-2',
            'shadow-[0_2px_4px_rgba(0,0,0,0.1)]',
            'absolute right-0 translate-x-1/2',
            'z-[101]',
            'cursor-pointer'
          )}
          aria-label={isExpanded ? 'Retract sidebar' : 'Expand sidebar'}
        >
          <IconChevronLeft
            className={cn(
              'h-5 w-5 text-github-fg-default',
              'transition-transform duration-200',
              !isExpanded && 'rotate-180'
            )}
          />
        </button>
      </div>

      {/* Tier Information */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${tierColors[tierKey(currentTier)]}`}
      >
        <TierIcon className='w-5 h-5' />
        {isExpanded && <span className='font-medium'>{tierKey(currentTier)}</span>}
      </motion.div>

      {/* Show icons only when the sidebar is retracted */}
      {!isExpanded && retractedIcons}
      {/* Search Components */}
      <div className='mb-8'>
        {isExpanded && (
          <>
            <YourRecipesSearch />
            <AZSearch />
          </>
        )}
      </div>
    </div>
  )
}

export default MenuSidebar
