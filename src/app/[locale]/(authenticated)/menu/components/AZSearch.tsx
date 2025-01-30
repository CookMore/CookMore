import React, { useState, useEffect } from 'react'
import placeholderData from '../placeholderData.json'
import SearchResultItem from './SearchResultItem'

const AZSearch: React.FC = () => {
  const [recipes, setRecipes] = useState(placeholderData)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])

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
    }, 500) // Simulate a delay for loading

    return () => clearTimeout(timeoutId)
  }, [searchQuery, recipes])

  return (
    <div className='p-4 bg-github-canvas-default text-github-fg-default shadow-md rounded-lg border-t border-b border-github-border-default'>
      <h2 className='text-xl font-bold mb-4 text-github-fg-default'>A-Z Recipe Search</h2>
      <input
        type='text'
        placeholder='Search recipes...'
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value)
          setLoading(true)
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
    </div>
  )
}

export default AZSearch
