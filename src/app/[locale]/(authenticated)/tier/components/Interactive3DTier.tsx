'use client'

import { useEffect, useState } from 'react'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { cn } from '@/app/api/utils/utils'
import { CookMore3DLogo } from '@/app/api/logo/CookMore3DLogo'

interface Interactive3DTierProps {
  tier: ProfileTier
  className?: string
}

export function Interactive3DTier({ tier, className }: Interactive3DTierProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className='h-24 flex items-center justify-center'>
        <div className='animate-pulse text-github-fg-muted'>Loading...</div>
      </div>
    )
  }

  return (
    <div className={cn('relative w-full h-24', className)}>
      <CookMore3DLogo tier={tier} />
    </div>
  )
}
