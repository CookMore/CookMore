'use client'

import { useState, useEffect } from 'react'

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

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    let installPrompt: BeforeInstallPromptEvent | null = null

    const handleInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      installPrompt = e
      setShowPrompt(true)
      console.log('Install prompt captured')
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('Already installed')
      return
    }

    window.addEventListener('beforeinstallprompt', handleInstallPrompt as any)

    // Handle successful install
    window.addEventListener('appinstalled', () => {
      console.log('App installed')
      setShowPrompt(false)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt as any)
    }
  }, [])

  const handleInstallClick = () => {
    // Instead of trying to use the stored prompt,
    // let's trigger the browser's native install UI
    const manifestLink = document.querySelector('link[rel="manifest"]')

    if (manifestLink) {
      console.log('Triggering install prompt')
      // Create a temporary button to trigger the install prompt
      const tempButton = document.createElement('button')
      tempButton.style.display = 'none'
      document.body.appendChild(tempButton)
      tempButton.click()
      document.body.removeChild(tempButton)
    } else {
      console.error('No manifest found')
    }
  }

  if (!showPrompt) return null

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <div className='bg-github-canvas-subtle border border-github-border-default rounded-lg p-4 shadow-lg max-w-sm'>
        <div className='flex items-start justify-between'>
          <div className='flex-1 mr-4'>
            <h3 className='text-github-fg-default font-medium mb-1'>Install CookMore</h3>
            <p className='text-github-fg-muted text-sm'>
              Get quick access to your recipes from your desktop
            </p>
          </div>
          <button
            onClick={() => setShowPrompt(false)}
            className='text-github-fg-muted hover:text-github-fg-default'
            aria-label='Dismiss'
          >
            ×
          </button>
        </div>
        <div className='mt-3 flex justify-end space-x-3'>
          <button
            onClick={() => setShowPrompt(false)}
            className='text-sm text-github-fg-muted hover:text-github-fg-default'
          >
            Not now
          </button>
          <button
            onClick={handleInstallClick}
            className='px-3 py-1.5 text-sm bg-github-success-emphasis hover:bg-github-success-fg text-white rounded-md'
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
}
