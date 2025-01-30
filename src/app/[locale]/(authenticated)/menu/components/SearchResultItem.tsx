import React, { useState } from 'react'
import Image from 'next/image'
import { Maximize2 } from 'lucide-react'
import MenuRecipePreview from './MenuRecipePreview'
import { Draggable } from 'react-beautiful-dnd'

interface Recipe {
  id: string
  title: string
  description: string
  tags: string[]
  isMinted: boolean
  image: string // Ensure this is not optional
}

interface SearchResultItemProps {
  recipe: Recipe
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ recipe }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  return (
    <Draggable draggableId={recipe.id} index={parseInt(recipe.id)}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`relative flex items-center p-4 bg-github-canvas-default text-github-fg-default rounded-lg shadow-lg border border-gray-200 transition-transform duration-200 hover:scale-105 hover:shadow-xl ${snapshot.isDragging ? 'opacity-50' : ''}`}
        >
          <button
            className='absolute top-2 right-2 text-github-fg-muted hover:text-github-fg-default'
            onClick={() => setIsPopoverOpen(true)}
          >
            <Maximize2 className='w-5 h-5' />
          </button>
          <Image
            src={recipe.image}
            alt='Recipe Thumbnail'
            width={64}
            height={64}
            className='rounded-full mr-4 border border-gray-300'
          />
          <div>
            <h3 className='text-lg font-bold text-github-fg-default'>{recipe.title}</h3>
            <p className='text-sm text-github-fg-muted'>{recipe.description}</p>
            <p className='text-xs text-github-fg-subtle'>Tags: {recipe.tags.join(', ')}</p>
            <button className='mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow-md transition-transform duration-200 hover:bg-blue-600 hover:scale-105'>
              Add to Menu
            </button>
          </div>
        </li>
      )}
    </Draggable>
  )
}

export default SearchResultItem
