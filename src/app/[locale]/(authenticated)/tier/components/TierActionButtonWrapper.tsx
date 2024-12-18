'use client'

import { I18nProvider } from '@/app/api/providers/edge/i18n-provider'
import { TierActionButton } from './TierActionButton'
import { useMessages } from '@/app/api/hooks/useMessages'
import { useLocale } from 'next-intl'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'

interface TierActionButtonWrapperProps {
  currentTier: ProfileTier | null
  targetTier: ProfileTier
  onMintSuccess?: () => void
  showGift?: boolean
}

export function TierActionButtonWrapper(props: TierActionButtonWrapperProps) {
  const messages = useMessages()
  const locale = useLocale()

  if (!messages) {
    return null // Or a loading skeleton
  }

  return (
    <I18nProvider messages={messages} locale={locale}>
      <TierActionButton {...props} />
    </I18nProvider>
  )
}
