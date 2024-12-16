'use client'

import { motion } from 'framer-motion'
import { ChatInterface } from '@/components/kitchen/ai/ChatInterface'
import { useRecipeAI } from '@/lib/ai/hooks/useRecipeAI'
import { useNFTTiers } from '@/lib/web3'
import { TierFeatures } from '@/components/kitchen/ai/TierFeatures'
import { PageHeader } from '@/components/ui/PageHeader'

export default function ExplorePage() {
  const { messages, isLoading, sendMessage, currentTier } = useRecipeAI()
  const { hasPro, hasGroup } = useNFTTiers()

  return (
    <div>
      <PageHeader title='Recipe Explorer' />
      <div className='text-center mb-8'>
        <p className='text-xl text-github-fg-muted max-w-2xl mx-auto'>
          Discover recipes with our AI-powered assistant. Ask questions, get recommendations, and
          explore new culinary ideas.
        </p>

        <TierFeatures currentTier={currentTier} />
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
          currentTier={currentTier}
        />
      </motion.div>
    </div>
  )
}
