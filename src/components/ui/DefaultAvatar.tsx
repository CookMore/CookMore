'use client'

import { IconUser } from '@/components/icons'

export function DefaultAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
      <IconUser className="w-4 h-4" />
    </div>
  )
}
