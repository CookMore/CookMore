'use client'

import React, { useState } from 'react'

interface RecipeCollectionProps {
  title: string
  type: 'recent' | 'draft' | 'popular'
  className?: string
}

export function RecipeCollection({ title, type, className }: RecipeCollectionProps) {
  const [votes, setVotes] = useState(0)

  const handleUpvote = () => setVotes(votes + 1)
  const handleDownvote = () => setVotes(votes - 1)

  return (
    <section className={className}>
      <h2 className='text-xl font-semibold text-github-fg-default mb-4'>{title}</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Recipe cards will go here */}
        <div className='flex items-center gap-2'>
          <button onClick={handleUpvote} className='text-green-500'>
            Upvote
          </button>
          <span>{votes}</span>
          <button onClick={handleDownvote} className='text-red-500'>
            Downvote
          </button>
        </div>
      </div>
    </section>
  )
}
