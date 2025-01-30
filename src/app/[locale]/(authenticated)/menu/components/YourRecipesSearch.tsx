import React, { useState, useEffect } from 'react'
import placeholderData2 from '../placeholderData2.json'
import SearchResultItem from './SearchResultItem'
import useMenuStorage from '../hooks/useMenuStorage'
import { IconSearch, IconFilter } from '@tabler/icons-react'

interface Recipe {
  id: string
  title: string
  // Add other properties as needed
}

const YourRecipesSearch: React.FC = () => {
  const [recipes, setRecipes] = useState(placeholderData2)
  const [searchQuery, setSearchQuery] = useMenuStorage('yourRecipesSearch', '')
  const [loading, setLoading] = useState(false)
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [isExpanded, setIsExpanded] = useState(true) // Assuming you have a state to track expansion

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredRecipes([])
      setLoading(false)
      return
    }
    setLoading(true)
    const timeoutId = setTimeout(() => {
      const results = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredRecipes(results)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, recipes])

  return (
    <div className='p-4 bg-github-canvas-default text-github-fg-default shadow-md rounded-lg border-t border-b border-github-border-default'>
      <h2 className='text-xl font-bold mb-4 text-github-fg-default'>Your Recipes Search</h2>
      <input
        type='text'
        placeholder='Search your recipes...'
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value)
        }}
        className='w-full mb-4 p-2 bg-github-canvas-subtle text-github-fg-default border border-github-border-default rounded focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis'
      />
      {loading && <p className='text-center text-github-fg-muted'>Loading...</p>}
      {!loading && searchQuery && filteredRecipes.length === 0 && (
        <p className='text-center text-github-fg-muted'>No results found.</p>
      )}
      <ul className='space-y-4 max-h-96 overflow-y-auto'>
        {filteredRecipes.map((recipe) => (
          <SearchResultItem key={recipe.id} recipe={recipe} />
        ))}
      </ul>
      {!isExpanded && ( // Only show icons when not expanded
        <div className='flex justify-center mt-4'>
          <IconSearch className='w-6 h-6 text-github-fg-muted' />
          <IconFilter className='w-6 h-6 text-github-fg-muted ml-4' />
        </div>
      )}
    </div>
  )
}

export default YourRecipesSearch
