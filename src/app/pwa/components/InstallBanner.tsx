'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'

// Simple X icon SVG component
function XIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor'>
      <path d='M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z' />
    </svg>
  )
}

// Chevron icon SVG component
function ChevronIcon({ isRetracted }: { isRetracted: boolean }) {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='currentColor'
      className={`transform transition-transform duration-200 ${isRetracted ? 'rotate-180' : ''}`}
    >
      <path d='M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z' />
    </svg>
  )
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export function InstallBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isRetracted, setIsRetracted] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    // Detailed environment logging
    console.log('PWA Debug Info:', {
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      hasServiceWorker: 'serviceWorker' in navigator,
      manifestLink: document.querySelector('link[rel="manifest"]')?.getAttribute('href'),
      isDevelopment: process.env.NODE_ENV === 'development',
    })

    const handleInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      console.log('Install prompt event captured:', e)
      setDeferredPrompt(e)
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is already installed')
      setIsVisible(false)
      return
    }

    window.addEventListener('beforeinstallprompt', handleInstallPrompt as any)

    // Log when the event is fired
    console.log('Added beforeinstallprompt listener')

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt as any)
    }
  }, [])

  const handleInstallClick = async () => {
    console.log('Install button clicked', {
      deferredPrompt: !!deferredPrompt,
      isInstalling,
    })

    if (isInstalling) {
      console.log('Already installing, ignoring click')
      return
    }

    setIsInstalling(true)

    // Check PWA criteria
    const criteria = {
      hasServiceWorker: 'serviceWorker' in navigator,
      hasManifest: !!document.querySelector('link[rel="manifest"]'),
      hasDeferredPrompt: !!deferredPrompt,
      protocol: window.location.protocol,
    }

    console.log('PWA Installation Criteria:', criteria)

    try {
      if (!deferredPrompt) {
        console.log('No deferred prompt available - checking why...')

        // Try to trigger the prompt manually
        const manifestLink = document.querySelector('link[rel="manifest"]')
        if (manifestLink) {
          console.log('Attempting manual manifest installation')
          window.location.href = manifestLink.getAttribute('href') || ''
        } else {
          console.log('No manifest link found')
          toast.error('Installation not available', {
            description: 'Please try using Chrome or Edge browser',
          })
        }

        setIsInstalling(false)
        return
      }

      console.log('Triggering install prompt...')
      await deferredPrompt.prompt()

      const choiceResult = await deferredPrompt.userChoice
      console.log('User choice:', choiceResult.outcome)

      if (choiceResult.outcome === 'accepted') {
        toast.success('Installation started!')
      } else {
        toast.error('Installation cancelled')
        setIsInstalling(false)
      }

      setDeferredPrompt(null)
    } catch (error) {
      console.error('Installation error:', error)
      toast.error('Installation failed', {
        description: 'Please try again using Chrome or Edge',
      })
      setIsInstalling(false)
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={`relative transition-all duration-300 ease-in-out 
        bg-github-accent-subtle hover:bg-github-accent-muted
        animate-[gentle-pulse_12s_cubic-bezier(0.4,0,0.6,1)_infinite]
        ${isRetracted ? 'h-8' : 'h-12'}
        before:absolute before:bottom-0 before:left-[-100%] before:right-[-100%] 
        before:h-[1px]
        before:bg-[length:200%_100%]
        before:bg-gradient-to-r 
        before:from-transparent 
        before:via-github-accent-fg 
        before:to-transparent
        before:animate-[border-scan_3s_linear_infinite]
        `}
    >
      {/* Action Buttons */}
      <div className='absolute top-1/2 -translate-y-1/2 right-2 flex items-center gap-1 z-10'>
        <button
          onClick={() => setIsRetracted(!isRetracted)}
          className='p-1 rounded-md
            text-github-accent-fg
            hover:bg-github-accent-emphasis hover:text-github-fg-onEmphasis
            transition-colors duration-200'
          aria-label={isRetracted ? 'Show more' : 'Show less'}
        >
          <ChevronIcon isRetracted={isRetracted} />
        </button>

        <button
          onClick={() => setIsVisible(false)}
          className='p-1 rounded-md
            text-github-accent-fg
            hover:bg-github-accent-emphasis hover:text-github-fg-onEmphasis
            transition-colors duration-200'
          aria-label='Close install banner'
        >
          <XIcon />
        </button>
      </div>

      {/* Banner Content */}
      <div className='h-full w-full flex items-center justify-center px-4'>
        <div className='flex items-center justify-center space-x-4 flex-1 max-w-screen-xl'>
          <h2 className='text-base font-semibold text-github-accent-fg whitespace-nowrap'>
            Install CookMore
          </h2>
          {!isRetracted && (
            <p className='text-sm text-github-accent-fg/80 animate-fadeIn whitespace-nowrap'>
              Add to your home screen for the best experience
            </p>
          )}

          {!isRetracted && (
            <button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className={`px-4 py-1.5 text-sm 
                bg-github-accent-emphasis 
                hover:bg-github-accent-fg 
                text-github-fg-onEmphasis 
                rounded-md 
                transition-colors duration-200 
                whitespace-nowrap
                ${isInstalling ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
              {isInstalling ? 'Installing...' : 'Install Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
