'use client'

import { useLocale } from 'next-intl'
import { getMessages } from '@/i18n'
import { useEffect, useState } from 'react'

export function useMessages() {
  const locale = useLocale()
  const [messages, setMessages] = useState<any>(null)

  useEffect(() => {
    const loadMessages = async () => {
      const msgs = await getMessages(locale)
      setMessages(msgs)
    }
    loadMessages()
  }, [locale])

  return messages
}
