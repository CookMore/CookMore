'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export function NewRecipeCard() {
  const [liked, setLiked] = useState(false)

  const toggleLike = () => setLiked(!liked)

  return (
    <div className='p-4 bg-github-canvas-default rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-white'>
      <Link
        href='/kitchen/new'
        className='block px-4 py-2 bg-github-success-emphasis text-white rounded-md hover:bg-github-success-emphasis/90 text-center'
      >
        New Recipe
      </Link>
      <button onClick={toggleLike} className='mt-2 w-full text-center'>
        {liked ? '❤️ Liked' : '🤍 Like'}
      </button>
    </div>
  )
}
