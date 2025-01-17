'use client'

import React from 'react'
import { usePrivy } from '@privy-io/react-auth'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@/app/api/routes/routes'

export default function MarketingPage() {
  const { login } = usePrivy()
  const t = useTranslations('common')

  return (
    <div className='relative'>
      <div className='container mx-auto px-4 relative z-10'>
        <div className='py-16 text-center'>
          <h1 className='text-5xl font-bold mb-6 text-github-fg-default'>{t('marketing.title')}</h1>
          <p className='text-xl mb-8 text-github-fg-muted'>{t('marketing.subtitle')}</p>
          <div className='flex justify-center gap-4'>
            <Link
              href={ROUTES.MARKETING.DISCOVER}
              className='inline-flex items-center px-6 py-3 rounded-md bg-github-accent-emphasis text-white hover:bg-github-accent-emphasis/90'
            >
              {t('marketing.explore')}
            </Link>
            <button
              onClick={() => login()}
              className='inline-flex items-center px-6 py-3 rounded-md border border-github-border-default text-github-fg-default hover:bg-github-canvas-subtle'
            >
              {t('marketing.get_started')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
