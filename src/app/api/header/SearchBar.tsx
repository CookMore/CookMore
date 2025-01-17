import { useState } from 'react'
import { DefaultAvatar } from '@/app/api/avatar/DefaultAvatar'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [recommendations, setRecommendations] = useState('')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  // Placeholder data for recipes and profiles
  const placeholderRecipes = [
    { id: 1, title: 'Spaghetti Bolognese' },
    { id: 2, title: 'Chicken Curry' },
  ]

  const placeholderProfiles = [
    { id: 1, name: 'John Doe', address: '0x1234' },
    { id: 2, name: 'Jane Smith', address: '0x5678' },
  ]

  const handleSearch = async () => {
    try {
      const response = await fetch('/api/generate/generateSearchBar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const [mainResponse, recommendationsPart] = data.result.split('Recommendations:')
      const highlightedResponse = mainResponse.replace(
        new RegExp(query, 'gi'),
        (match: string) => `<strong>${match}</strong>`
      )
      setAiResponse(highlightedResponse)
      setRecommendations(
        recommendationsPart ? recommendationsPart.trim() : 'No recommendations available.'
      )
      setIsPopoverOpen(true)
    } catch (error) {
      console.error('Error with search API:', error)
    }
  }

  return (
    <div className='flex flex-col items-center border rounded-md p-1'>
      <div className='flex items-center w-full'>
        <div className='flex items-center'>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search...'
            className='flex-grow p-1 border-none outline-none min-w-[200px]'
          />
          <button
            onClick={() => {
              setQuery('')
              setIsPopoverOpen(false)
            }}
            className={`ml-2 p-2 text-github-fg-muted hover:text-github-fg-default ${query ? 'visible' : 'invisible'}`}
          >
            &times;
          </button>
        </div>
        <button
          onClick={handleSearch}
          className='ml-2 p-1
           bg-blue-500 text-white rounded-md hover:bg-blue-600'
        >
          Search
        </button>
      </div>
      {isPopoverOpen && (
        <div className='fixed top-16 left-0 right-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='relative bg-github-canvas-default p-4 rounded-md shadow-lg w-10/12 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl border border-github-border-default'>
            <button
              onClick={() => setIsPopoverOpen(false)}
              className='absolute top-2 right-2 text-github-fg-muted hover:text-github-fg-default font-bold text-lg'
            >
              &times;
            </button>
            <h2 className='text-2xl font-bold text-github-fg-default mb-2'>{query}</h2>
            <h3 className='font-bold text-github-fg-default'>AI Response:</h3>
            <p
              className='text-github-fg-muted mb-4'
              dangerouslySetInnerHTML={{ __html: aiResponse }}
            ></p>
            {recommendations && (
              <div>
                <h4 className='font-bold text-github-fg-default'>Recommendations:</h4>
                <p className='text-github-fg-muted mb-4'>{recommendations}</p>
              </div>
            )}
            <h4 className='font-bold text-github-fg-default'>Recipes:</h4>
            <ul className='mb-4'>
              {placeholderRecipes.map((recipe) => (
                <li key={recipe.id} className='text-github-fg-muted'>
                  {recipe.title}
                </li>
              ))}
            </ul>
            <h4 className='font-bold text-github-fg-default'>Profiles:</h4>
            <ul>
              {placeholderProfiles.map((profile) => (
                <li key={profile.id} className='flex items-center text-github-fg-muted mb-2'>
                  <DefaultAvatar address={profile.address} size={30} className='mr-2' />
                  {profile.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
