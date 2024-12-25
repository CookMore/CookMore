'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/app/api/utils/utils'

interface AutoSaveIndicatorProps {
  isSaving: boolean
  lastSaved: Date | null
}

export function AutoSaveIndicator({ isSaving, lastSaved }: AutoSaveIndicatorProps) {
  const t = useTranslations('profile')
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isSaving || lastSaved) {
      setShow(true)
      const timer = setTimeout(() => setShow(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isSaving, lastSaved])

  return (
    <div
      className={cn(
        'fixed bottom-20 right-4 z-50',
        'px-3 py-2 rounded-md text-xs',
        'bg-github-canvas-subtle border border-github-border-default',
        'shadow-sm transition-all duration-300',
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      <div className='flex items-center gap-2'>
        {isSaving ? (
          <>
            <span className='h-1.5 w-1.5 rounded-full bg-github-accent-emphasis animate-pulse' />
            <span>{t('autosaving')}</span>
          </>
        ) : lastSaved ? (
          <>
            <span className='text-github-success-fg'>✓</span>
            <span>
              {t('draftSaved')} {lastSaved.toLocaleTimeString()}
            </span>
          </>
        ) : null}
      </div>
      <div className='text-github-fg-muted mt-1 text-[10px]'>{t('localStorageNote')}</div>
    </div>
  )
}
