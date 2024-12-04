'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { TypingIndicator } from './TypingIndicator'
import { cn } from '@/lib/utils'
import type { AIMessage } from '@/types/ai'
import { ProfileTier } from '@/types/profile'

const TIER_WELCOME_MESSAGES = {
  [ProfileTier.FREE]: `Hi! I'm your CookMore AI assistant. With your Free tier, I can help you with:
• Basic recipe suggestions
• Simple cooking tips
• Common ingredient substitutions
• Basic kitchen advice

Want more advanced features? Upgrade to Pro or Group tier! What would you like to know about?`,

  [ProfileTier.PRO]: `Hi! I'm your CookMore AI assistant. With your Pro tier, I can help you with:
• Advanced recipe modifications
• Professional cooking techniques
• Detailed ingredient substitutions
• Equipment recommendations
• Scaling recipes for different servings
• Chef's tips and tricks

What would you like to explore today?`,

  [ProfileTier.GROUP]: `Hi! I'm your CookMore AI assistant. With your Group tier, you have access to all features:
• Team recipe planning
• Bulk cooking instructions
• Cost analysis and budgeting
• Professional kitchen management
• Equipment optimization
• Advanced collaboration features
• All Pro tier features included

How can I assist your team today?`,
}

interface ChatInterfaceProps {
  messages: AIMessage[]
  isLoading: boolean
  onSendMessage: (message: string) => Promise<void>
  currentTier: ProfileTier
}

export function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
  currentTier,
}: ChatInterfaceProps) {
  const [showWelcome, setShowWelcome] = useState(true)
  const [isTypingWelcome, setIsTypingWelcome] = useState(true)
  const [welcomeText, setWelcomeText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize the welcome message
  useEffect(() => {
    let isMounted = true
    let timer: NodeJS.Timeout

    if (showWelcome && isTypingWelcome) {
      const welcomeMessage = TIER_WELCOME_MESSAGES[currentTier]
      let index = 0

      const typeText = () => {
        if (!isMounted) return

        if (index < welcomeMessage.length) {
          setWelcomeText(welcomeMessage.slice(0, index + 1))
          index++
          timer = setTimeout(typeText, 30)
        } else {
          setIsTypingWelcome(false)
        }
      }

      typeText()
    }

    return () => {
      isMounted = false
      if (timer) clearTimeout(timer)
    }
  }, [currentTier])

  // Reset typing state when tier changes
  useEffect(() => {
    setIsTypingWelcome(true)
    setWelcomeText('')
  }, [currentTier])

  // Hide welcome message when real messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false)
    }
  }, [messages])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, welcomeText])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputRef.current?.value.trim() || isLoading) return

    const message = inputRef.current.value
    inputRef.current.value = ''
    await onSendMessage(message)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className='flex flex-col rounded-lg border border-github-border-default bg-github-canvas-default overflow-hidden shadow-lg'>
      {/* Messages Area */}
      <div className='flex-1 min-h-[500px] max-h-[600px] overflow-y-auto p-6 space-y-6'>
        <AnimatePresence mode='popLayout'>
          {/* Welcome Message */}
          {showWelcome && (
            <motion.div
              key='welcome-message'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className='flex items-start gap-3 bg-github-accent-subtle rounded-lg p-4 ml-8'
            >
              <div className='flex-1 text-github-fg-default whitespace-pre-wrap'>
                {welcomeText}
                {isTypingWelcome && <TypingIndicator />}
              </div>
            </motion.div>
          )}

          {/* Chat Messages */}
          {messages.map((message) => (
            <motion.div
              key={`message-${message.timestamp}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg',
                message.role === 'assistant'
                  ? 'bg-github-accent-subtle ml-8'
                  : 'bg-github-canvas-subtle mr-8'
              )}
            >
              {/* Avatar or Icon */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  message.role === 'assistant'
                    ? 'bg-github-accent-muted text-github-accent-fg'
                    : 'bg-github-canvas-default text-github-fg-muted'
                )}
              >
                {message.role === 'assistant' ? '👨‍🍳' : '👤'}
              </div>

              {/* Message Content */}
              <div className='flex-1'>
                <div className='text-xs text-github-fg-muted mb-1'>
                  {message.role === 'assistant' ? 'CookMore AI' : 'You'}
                </div>
                <div className='text-github-fg-default whitespace-pre-wrap'>{message.content}</div>
              </div>
            </motion.div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <motion.div
              key='loading-indicator'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='flex items-center gap-2 p-4 ml-8'
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className='border-t border-github-border-default bg-github-canvas-subtle p-4'>
        <form onSubmit={handleSubmit} className='relative'>
          <textarea
            ref={inputRef}
            className={cn(
              'w-full min-h-[44px] max-h-[200px] p-3 pr-24 rounded-lg',
              'bg-github-canvas-default border border-github-border-default',
              'text-github-fg-default placeholder:text-github-fg-muted',
              'focus:outline-none focus:ring-2 focus:ring-github-accent-fg',
              'resize-none'
            )}
            placeholder='Ask about recipes, techniques, or get recommendations...'
            rows={1}
            disabled={isLoading}
            onKeyDown={handleKeyPress}
          />
          <Button
            type='submit'
            disabled={isLoading}
            className='absolute right-2 bottom-2 bg-github-accent-fg hover:bg-github-accent-emphasis'
          >
            {isLoading ? <LoadingSpinner className='w-4 h-4' /> : 'Send'}
          </Button>
        </form>
      </div>
    </div>
  )
}
