import { useState, useCallback, useRef } from 'react'
import { useNFTTiers } from '@/lib/web3/hooks/useNFTTiers'
import { useProfileData } from '@/lib/auth/hooks/useProfile'
import { aiService } from '@/lib/services/ai-service'
import { toast } from 'sonner'
import type { AIMessage } from '@/types/ai'
import { usePrivy } from '@privy-io/react-auth'

export function useRecipeAI() {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { hasGroup, hasPro } = useNFTTiers()
  const { user } = usePrivy()
  const { profile } = useProfileData(user?.wallet?.address)

  const currentMessageRef = useRef<string>('')

  const sendMessage = useCallback(
    async (content: string) => {
      if (!hasGroup && !hasPro) {
        toast.error('Please connect your wallet to use the AI assistant')
        return
      }

      setIsLoading(true)
      try {
        // Add user message
        const userMessage: AIMessage = {
          role: 'user',
          content,
          timestamp: Date.now(),
          metadata: {
            tier: hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE,
          },
        }

        // Create assistant message placeholder
        const assistantMessage: AIMessage = {
          role: 'assistant',
          content: '',
          timestamp: Date.now() + 1,
          metadata: {
            tier: hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE,
          },
        }

        setMessages((prev) => [...prev, userMessage, assistantMessage])
        currentMessageRef.current = ''

        // Get streaming response
        const stream = await aiService.processMessage(
          content,
          hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE
        )
        const reader = stream.getReader()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          // Accumulate the assistant's response
          if (value.choices[0]?.delta?.content) {
            currentMessageRef.current += value.choices[0].delta.content

            // Update the last message with accumulated content
            setMessages((prev) => {
              const newMessages = [...prev]
              newMessages[newMessages.length - 1] = {
                ...newMessages[newMessages.length - 1],
                content: currentMessageRef.current,
              }
              return newMessages
            })
          }
        }
      } catch (error) {
        console.error('Error sending message:', error)
        toast.error(
          process.env.NODE_ENV === 'development'
            ? `AI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            : 'Failed to send message to AI assistant'
        )

        // Add error message to chat
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'I apologize, but I encountered an error. Please try again.',
            timestamp: Date.now(),
            metadata: {
              tier: hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE,
            },
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [hasGroup, hasPro, toast]
  )

  return {
    messages,
    isLoading,
    sendMessage,
    currentTier: hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE,
  }
}
