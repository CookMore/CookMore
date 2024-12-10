'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/app/providers/ThemeProvider'

interface ThemePreviewProps {
  highContrast: boolean
  largeText: boolean
  reduceSounds: boolean
  alwaysCaptions: boolean
  reduceMotion: boolean
}

export function ThemePreview({
  highContrast,
  largeText,
  reduceSounds,
  alwaysCaptions,
  reduceMotion,
}: ThemePreviewProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <div className='animate-pulse space-y-4'>
        <div className='h-48 bg-github-canvas-subtle rounded' />
      </div>
    )
  }

  return (
    <div className={cn('mt-4 space-y-4', theme === 'neo' && 'rotate-[-0.1deg]')}>
      <h3 className={cn('text-sm font-medium mb-2', theme === 'neo' && 'font-mono tracking-tight')}>
        Theme Preview
      </h3>

      {/* Main Theme Preview */}
      <div className='p-4 rounded-md border border-github-border-default'>
        <div
          className={cn(
            'w-full rounded-md bg-github-canvas-default overflow-hidden',
            `bg-pattern-${theme}`,
            highContrast && 'contrast-150',
            largeText && 'text-lg',
            !reduceMotion && 'hover:scale-[1.02] transition-transform'
          )}
        >
          {/* Theme-specific content */}
          <div className='p-4 space-y-3'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 rounded bg-github-canvas-subtle' />
              <div className='space-y-1 flex-1'>
                <div className='h-4 w-24 bg-github-canvas-subtle rounded' />
                <div className='h-3 w-32 bg-github-canvas-subtle rounded' />
              </div>
            </div>

            {/* Accessibility Indicators */}
            <div className='flex gap-2 text-xs text-github-fg-muted'>
              {highContrast && <span>High Contrast</span>}
              {largeText && <span>Large Text</span>}
              {reduceSounds && <span>🔇</span>}
              {alwaysCaptions && <span>CC</span>}
            </div>

            {/* Theme-specific effects */}
            {theme === 'neo' && (
              <div className='space-y-4'>
                <div className='neo-container p-4'>
                  <div className='neo-button'>Neo Style</div>
                  <input
                    type='text'
                    className='neo-input mt-4 w-full'
                    placeholder='Brutalist Input'
                  />
                </div>
              </div>
            )}
            {theme === 'wooden' && (
              <div className='border border-github-border-muted p-2'>Wood Grain</div>
            )}
            {theme === 'steel' && <div className='bg-steel-gradient p-2'>Brushed Steel</div>}
            {theme === 'silicone' && <div className='bg-silicone-texture p-2'>Silicone Mat</div>}
            {theme === 'copper' && (
              <div
                className={cn(
                  'p-2 bg-github-canvas-default shine-effect copper-shine',
                  'border-2 border-github-border-default rounded-md',
                  'relative overflow-hidden shadow-[var(--copper-shadow)]',
                  'transition-all duration-300 hover:scale-105',
                  'before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-black/10'
                )}
              >
                <div className='relative z-10 font-medium text-white/90'>Copper Finish</div>
                <div className='absolute inset-0 bg-copper-patina opacity-90 mix-blend-soft-light' />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Accessibility Impact Note */}
      <div className='text-xs text-github-fg-muted'>
        {highContrast && <p>High contrast mode enhances visibility in {theme} theme</p>}
        {largeText && <p>Text size increased for better readability</p>}
        {!reduceMotion && <p>Hover over preview to see motion effects</p>}
      </div>
    </div>
  )
}
