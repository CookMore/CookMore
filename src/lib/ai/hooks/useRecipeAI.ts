'use client'

import { useState, useCallback } from 'react'
import { useNFTTiers } from '@/lib/web3/hooks/useNFTTiers'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function useRecipeAI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { currentTier } = useNFTTiers()

  const sendMessage = useCallback(async (content: string) => {
    try {
      setIsLoading(true)
      setMessages((prev) => [...prev, { role: 'user', content }])

      // TODO: Implement actual AI integration
      const response = "I'm still being implemented. Check back soon!"

      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    currentTier,
  }
}
