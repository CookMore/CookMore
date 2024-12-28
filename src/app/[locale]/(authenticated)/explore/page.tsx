'use client'

import { motion } from 'framer-motion'
import { ChatInterface } from './ai/ChatInterface'
import { useRecipeAI } from './ai/useRecipeAI'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { TierFeatures } from './ai/TierFeatures'
import { PageHeader } from '@/app/api/header/PageHeader'

export default function ExplorePage() {
  const { messages, isLoading, sendMessage, currentTier } = useRecipeAI()
  const { hasProfile, currentTier: authTier } = useAuth()

  // If we have profile info from auth, use that tier instead
  const effectiveTier = hasProfile ? authTier : currentTier

  return (
    <div>
      <PageHeader title='Recipe Explorer' />
      <div className='text-center mb-8'>
        <p className='text-xl text-github-fg-muted max-w-2xl mx-auto'>
          Discover recipes with our AI-powered assistant. Ask questions, get recommendations, and
          explore new culinary ideas.
        </p>

        <TierFeatures currentTier={effectiveTier} />
      </div>

      {/* AI Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          currentTier={effectiveTier}
        />
      </motion.div>
    </div>
  )
}
