'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { detectUserLocale } from '@/lib/services/geolocation'
import { languages } from '@/lib/i18n'

export function LanguageSuggestion() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  const [suggestedLocale, setSuggestedLocale] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const checkLocale = async () => {
      // Don't show suggestion if user has dismissed it before
      if (localStorage.getItem('language_suggestion_dismissed')) {
        return
      }

      const detected = await detectUserLocale()
      if (detected && detected !== currentLocale) {
        setSuggestedLocale(detected)
      }
    }

    checkLocale()
  }, [currentLocale])

  if (!suggestedLocale || dismissed) {
    return null
  }

  const handleAccept = () => {
    // Switch to suggested language
    const newPath = pathname.replace(`/${currentLocale}`, `/${suggestedLocale}`)
    router.push(newPath)
    // Store preference
    localStorage.setItem('preferred_locale', suggestedLocale)
    setDismissed(true)
  }

  const handleDismiss = () => {
    // Remember that user dismissed the suggestion
    localStorage.setItem('language_suggestion_dismissed', 'true')
    setDismissed(true)
  }

  return (
    <div className='fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-github-canvas-subtle p-4 shadow-lg'>
      <div className='mb-3 text-sm text-github-fg-default'>
        <p>Would you like to switch to {languages[suggestedLocale as keyof typeof languages]}?</p>
      </div>
      <div className='flex justify-end space-x-2'>
        <button
          onClick={handleDismiss}
          className='px-3 py-1 text-sm text-github-fg-muted hover:text-github-fg-default'
        >
          No, thanks
        </button>
        <button
          onClick={handleAccept}
          className='rounded bg-github-accent-emphasis px-3 py-1 text-sm text-white hover:bg-github-accent-emphasis/90'
        >
          Switch language
        </button>
      </div>
    </div>
  )
}
