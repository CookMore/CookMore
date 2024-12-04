'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { RecipeCollection } from '@/components/kitchen/RecipeCollection'
import { KitchenStats } from '@/components/kitchen/KitchenStats'
import { RecipeFilters } from '@/components/kitchen/RecipeFilters'

const RECIPE_COLLECTIONS = [
  { title: 'Recent Recipes', type: 'recent' },
  { title: 'In Progress', type: 'draft' },
  { title: 'Most Cooked', type: 'popular' },
] as const

export default function KitchenContent() {
  return (
    <div className='space-y-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={cn(
            'rounded-lg border transition-all duration-200',
            'hover:shadow-lg hover:translate-y-[-2px]',
            'border-github-border-default hover:border-github-border-muted'
          )}
        >
          <RecipeFilters />
        </div>
      </motion.div>

      {/* Recipe Collections */}
      <div className='grid gap-8'>
        {RECIPE_COLLECTIONS.map(({ title, type }) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'rounded-lg border transition-all duration-200',
              'hover:shadow-lg hover:translate-y-[-2px]',
              'border-github-border-default hover:border-github-border-muted'
            )}
          >
            <RecipeCollection title={title} type={type} />
          </motion.div>
        ))}
      </div>

      {/* Kitchen Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <KitchenStats />
      </motion.div>
    </div>
  )
}
