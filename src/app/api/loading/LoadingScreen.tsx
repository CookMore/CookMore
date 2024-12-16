'use client'

import { Loader2 } from 'lucide-react'

interface LoadingScreenProps {
  title?: string
  showLogo?: boolean
  message?: string
}

export function LoadingScreen({
  title = 'CookMore',
  showLogo = true,
  message = 'Loading...',
}: LoadingScreenProps) {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-background'>
      <div className='text-center flex flex-col items-center gap-4'>
        {showLogo && <h1 className='text-4xl font-bold text-github-fg-default mb-4'>{title}</h1>}
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <div className='flex flex-col gap-2'>
          <p className='text-lg font-medium text-github-fg-default'>{message}</p>
          <p className='text-sm text-github-fg-subtle'>Setting up your secure environment</p>
        </div>
      </div>
    </div>
  )
}
