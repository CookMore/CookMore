'use client'

import { useState } from 'react'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { Button } from '@/app/api/components/ui/button'
import { LoadingSpinner } from '@/app/api/loading/LoadingSpinner'
import { IconSend } from '@tabler/icons-react'

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

  [ProfileTier.OG]: `Welcome to CookMore's exclusive OG tier! I'm your dedicated AI assistant, and you have access to our most premium features:
• Early access to new recipes and features
• Exclusive cooking masterclasses
• Priority support and personalized guidance
• Custom recipe development
• Advanced meal planning and optimization
• Exclusive community events and networking
• VIP kitchen consultations
• All Pro and Group features included

As an OG member, you're part of our elite culinary community. How can I enhance your cooking journey today?`,
} as const

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatInterfaceProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage: (message: string) => void
  currentTier: ProfileTier
}

export function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
  currentTier,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    onSendMessage(input.trim())
    setInput('')
  }

  return (
    <div className='flex flex-col h-[600px] bg-github-canvas-subtle rounded-lg border border-github-border-default'>
      {/* Chat Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {/* Welcome Message */}
        <div className='bg-github-canvas-default rounded-lg p-4 shadow-sm'>
          <p className='text-github-fg-default whitespace-pre-line'>
            {TIER_WELCOME_MESSAGES[currentTier]}
          </p>
        </div>

        {/* Message History */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-github-accent-subtle text-github-accent-fg ml-8'
                : 'bg-github-canvas-default text-github-fg-default mr-8'
            }`}
          >
            <p className='whitespace-pre-line'>{message.content}</p>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className='flex items-center justify-center p-4'>
            <LoadingSpinner />
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className='p-4 border-t border-github-border-default'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ask about recipes, cooking tips, or ingredients...'
            className='flex-1 px-4 py-2 rounded-lg bg-github-canvas-default border border-github-border-default text-github-fg-default placeholder:text-github-fg-muted focus:outline-none focus:ring-2 focus:ring-github-accent-fg'
            disabled={isLoading}
          />
          <Button
            type='submit'
            disabled={isLoading || !input.trim()}
            className='px-4 py-2 bg-github-accent-emphasis text-white rounded-lg hover:bg-github-accent-emphasis/90 disabled:opacity-50'
          >
            <IconSend className='w-5 h-5' />
          </Button>
        </div>
      </form>
    </div>
  )
}
