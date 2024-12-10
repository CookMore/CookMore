'use client'

import { useState, useEffect } from 'react'
import { BasePanel } from './BasePanel'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Toggle } from '@/components/ui/Toggle'
import { useTheme } from '@/app/providers/ThemeProvider'
import { useMotion } from '@/app/providers/MotionProvider'
import {
  IconMotion,
  IconZoomIn,
  IconContrast,
  IconBell,
  IconCaptions,
  IconPalette,
} from '@/components/ui/icons'
import { ThemePreview } from './ThemePreview'

export function DisplayPanel() {
  const { theme } = useTheme()
  const { reduceMotion, toggleReduceMotion } = useMotion()
  const [mounted, setMounted] = useState(false)

  // Local state for accessibility options
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [reduceSounds, setReduceSounds] = useState(false)
  const [alwaysCaptions, setAlwaysCaptions] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <BasePanel title='Display'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-github-canvas-subtle rounded' />
          <div className='h-48 bg-github-canvas-subtle rounded' />
          <div className='space-y-2'>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className='h-8 bg-github-canvas-subtle rounded' />
            ))}
          </div>
        </div>
      </BasePanel>
    )
  }

  return (
    <BasePanel title='Display'>
      <div className='space-y-4'>
        {/* Theme Selector */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <IconPalette className='w-4 h-4 text-github-fg-muted' />
            <span className='text-sm text-github-fg-default'>Theme</span>
          </div>
          <ThemeToggle />
        </div>

        {/* Theme Preview */}
        <ThemePreview
          highContrast={highContrast}
          largeText={largeText}
          reduceSounds={reduceSounds}
          alwaysCaptions={alwaysCaptions}
          reduceMotion={reduceMotion}
        />

        {/* Other toggles remain the same */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <IconMotion className='w-4 h-4 text-github-fg-muted' />
            <span className='text-sm text-github-fg-default'>Reduce motion</span>
          </div>
          <Toggle checked={reduceMotion} onChange={toggleReduceMotion} />
        </div>

        {/* High Contrast */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <IconContrast className='w-4 h-4 text-github-fg-muted' />
            <span className='text-sm text-github-fg-default'>Increase contrast</span>
          </div>
          <Toggle checked={highContrast} onChange={() => setHighContrast(!highContrast)} />
        </div>

        {/* Large Text */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <IconZoomIn className='w-4 h-4 text-github-fg-muted' />
            <span className='text-sm text-github-fg-default'>Larger text</span>
          </div>
          <Toggle checked={largeText} onChange={() => setLargeText(!largeText)} />
        </div>

        {/* Sound Preferences */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <IconBell className='w-4 h-4 text-github-fg-muted' />
            <span className='text-sm text-github-fg-default'>Reduce sounds</span>
          </div>
          <Toggle checked={reduceSounds} onChange={() => setReduceSounds(!reduceSounds)} />
        </div>

        {/* Always Show Captions */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <IconCaptions className='w-4 h-4 text-github-fg-muted' />
            <span className='text-sm text-github-fg-default'>Always show captions</span>
          </div>
          <Toggle checked={alwaysCaptions} onChange={() => setAlwaysCaptions(!alwaysCaptions)} />
        </div>
      </div>
    </BasePanel>
  )
}
