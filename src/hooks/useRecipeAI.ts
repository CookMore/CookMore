import { useState, useCallback, useRef } from 'react'
import { useNFTTiers } from './useNFTTiers'
import { useProfile } from './useProfile'
import { aiService } from '@/lib/services/ai-service'
import { useToast } from '@/components/ui/use-toast'
import type { AIMessage } from '@/types/ai'

export function useRecipeAI() {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { currentTier } = useNFTTiers()
  const { profile } = useProfile()
  const { toast } = useToast()
  const currentMessageRef = useRef<string>('')

  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentTier) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet to use the AI assistant',
          variant: 'destructive',
        })
        return
      }

      setIsLoading(true)
      try {
        // Add user message
        const userMessage: AIMessage = {
          role: 'user',
          content,
          timestamp: Date.now(),
          metadata: { tier: currentTier },
        }

        // Create assistant message placeholder
        const assistantMessage: AIMessage = {
          role: 'assistant',
          content: '',
          timestamp: Date.now() + 1,
          metadata: { tier: currentTier },
        }

        setMessages((prev) => [...prev, userMessage, assistantMessage])
        currentMessageRef.current = ''

        // Get streaming response
        const stream = await aiService.processMessage(content, currentTier)
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
        toast({
          title: 'Error',
          description:
            process.env.NODE_ENV === 'development'
              ? `AI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
              : 'Failed to get AI response. Please try again.',
          variant: 'destructive',
        })

        // Add error message to chat
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'I apologize, but I encountered an error. Please try again.',
            timestamp: Date.now(),
            metadata: { tier: currentTier },
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [currentTier, toast]
  )

  return {
    messages,
    isLoading,
    sendMessage,
    currentTier,
  }
}
