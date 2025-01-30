import React, { useState } from 'react'
import placeholderMenu1 from '../placeholderMenu1.json'
import placeholderMenu2 from '../placeholderMenu2.json'
import YourMenuSelectors from './YourMenuSelectors'
import CommunityMenuSelectors from './CommunityMenuSelectors'

const MenuSearchBar: React.FC = () => {
  // Toggles for showing/hiding selectors
  const [showYourSelectors, setShowYourSelectors] = useState(false)
  const [showCommunitySelectors, setShowCommunitySelectors] = useState(false)

  // Store selected filters from each child
  const [yourFilters, setYourFilters] = useState<{ [key: string]: string[] }>({})
  const [communityFilters, setCommunityFilters] = useState<{ [key: string]: string[] }>({})

  // When filters change in the YourMenuSelectors component
  const handleYourFiltersChange = (filters: { [key: string]: string[] }) => {
    setYourFilters(filters)
  }

  // When filters change in the CommunityMenuSelectors component
  const handleCommunityFiltersChange = (filters: { [key: string]: string[] }) => {
    setCommunityFilters(filters)
  }

  // Helper to see if any filters are active in a set
  const isAnyFilterActive = (filters: { [key: string]: string[] }) => {
    return Object.values(filters).some((groupSelections) => groupSelections.length > 0)
  }

  // Evaluate if there's any active filter for each group
  const yourMenuActive = isAnyFilterActive(yourFilters)
  const communityMenuActive = isAnyFilterActive(communityFilters)

  return (
    <div className='menu-search-bar p-2 border border-gray-300 rounded-lg'>
      {/* --- YOUR MENUS --- */}
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-bold'>Your Menus</h2>
        <button
          onClick={() => setShowYourSelectors(!showYourSelectors)}
          className={`hamburger-menu ${yourMenuActive ? 'text-red-500' : ''}`}
        >
          ☰
        </button>
      </div>

      {showYourSelectors && <YourMenuSelectors onFiltersChange={handleYourFiltersChange} />}

      <p className='mb-3 text-sm'>Select from your own menus below:</p>
      <div className='overflow-x-auto whitespace-nowrap mb-5'>
        {placeholderMenu1.map((menu) => (
          <div
            key={menu.id}
            className='inline-block m-1 p-1 border border-gray-300 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:border-blue-500'
          >
            <img
              src={menu.thumbnail}
              alt={menu.name}
              className='w-18 h-18 object-cover rounded-lg'
            />
            <p className='text-center mt-1 text-xs'>{menu.name}</p>
          </div>
        ))}
      </div>

      <hr className='my-2 border-t border-gray-400' />

      {/* --- COMMUNITY MENUS --- */}
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-bold'>Community Menus</h2>
        <button
          onClick={() => setShowCommunitySelectors(!showCommunitySelectors)}
          className={`hamburger-menu ${communityMenuActive ? 'text-red-500' : ''}`}
        >
          ☰
        </button>
      </div>

      {showCommunitySelectors && (
        <CommunityMenuSelectors onFiltersChange={handleCommunityFiltersChange} />
      )}

      <p className='mb-3 text-sm'>Explore menus from the community:</p>
      <div className='overflow-x-auto whitespace-nowrap'>
        {placeholderMenu2.map((menu) => (
          <div
            key={menu.id}
            className='inline-block m-1 p-1 border border-gray-300 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:border-blue-500'
          >
            <img
              src={menu.thumbnail}
              alt={menu.name}
              className='w-18 h-18 object-cover rounded-lg'
            />
            <p className='text-center mt-1 text-xs'>{menu.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MenuSearchBar
