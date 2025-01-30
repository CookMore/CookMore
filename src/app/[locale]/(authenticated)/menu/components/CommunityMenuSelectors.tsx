import React, { useState } from 'react'
import useMenuStorage from '../hooks/useMenuStorage'

// Adjust or expand as needed
interface CommunityFilterGroup {
  label: string
  options: string[]
}

interface SelectedFilters {
  [key: string]: string[]
}

const CommunityMenuSelectors = () => {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    Popularity: [],
    'Meal Type': [],
    'Dietary Preferences': [],
    'Seasonal/Holidays': [],
  })

  const communityFilterGroups: CommunityFilterGroup[] = [
    {
      label: 'Popularity',
      options: ['Popular', 'New', 'Trending', 'Recommended', 'Top Rated'],
    },
    {
      label: 'Meal Type',
      options: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'],
    },
    {
      label: 'Dietary Preferences',
      options: ['Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Gluten-Free', 'Dairy-Free'],
    },
    {
      label: 'Seasonal/Holidays',
      options: [
        'Summer Favorites',
        'Winter Warmers',
        'Spring Fling',
        'Autumn Harvest',
        'Christmas',
        'Thanksgiving',
        'Easter',
      ],
    },
  ]

  type CommunitySelectedFilters = {
    [groupLabel: string]: string[]
  }

  // Add storage hook implementation
  const usePersistedFilters = () => {
    const { selectedFilters, setSelectedFilters } = useMenuStorage('communityFilters', {})

    return {
      selectedFilters,
      setSelectedFilters,
    }
  }

  // Props: we add an optional onFiltersChange callback to inform a parent component
  interface CommunityMenuSelectorsProps {
    onFiltersChange?: (selectedFilters: CommunitySelectedFilters) => void
  }

  // Add new styles for buttons
  const buttonStyles = `
    px-4 py-2 
    rounded-lg
    border border-gray-200
    bg-white
    transition-all
    hover:shadow-md
    hover:border-primary-500
    focus:outline-none 
    focus:ring-2 
    focus:ring-primary-500
    active:bg-gray-50
  `

  const toggleOption = (groupLabel: string, option: string) => {
    setSelectedFilters((prev) => {
      const currentGroupSelections = prev[groupLabel] || []
      const isAlreadySelected = currentGroupSelections.includes(option)

      let updatedGroupSelections
      if (isAlreadySelected) {
        updatedGroupSelections = currentGroupSelections.filter((item) => item !== option)
      } else {
        updatedGroupSelections = [...currentGroupSelections, option]
      }

      return {
        ...prev,
        [groupLabel]: updatedGroupSelections,
      }
    })
  }

  // Add state for custom tags
  const [customTags, setCustomTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // Function to add custom tags
  const addCustomTags = () => {
    const newTags = tagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag)
    setCustomTags([...customTags, ...newTags])
    setTagInput('')
  }

  // Update handleClearAll to clear custom tags
  const handleClearAll = () => {
    setSelectedFilters({})
    setCustomTags([])
  }

  return (
    <div className='mega-menu p-4 border border-gray-300 rounded-lg shadow-md'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-bold'>Community Menu Filters</h3>
        <button onClick={handleClearAll} className='text-sm text-red-500 hover:underline'>
          Clear All
        </button>
      </div>

      {communityFilterGroups.map((group) => (
        <div key={group.label} className='mb-4'>
          <h4 className='font-semibold text-base mb-2'>{group.label}</h4>
          <div className='flex flex-wrap gap-2'>
            {group.options.map((option) => {
              const isSelected = selectedFilters[group.label]?.includes(option) || false

              return (
                <button
                  key={option}
                  onClick={() => toggleOption(group.label, option)}
                  className={`inline-block m-1 p-1 border border-gray-300 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:border-blue-500 ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-canvas-default'
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Add input and button for custom tags */}
      <div className='flex items-center mt-4'>
        <input
          type='text'
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder='Add custom tags...'
          className='flex-1 p-2 border border-gray-300 rounded-lg'
        />
        <button
          onClick={addCustomTags}
          className='ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
        >
          Add
        </button>
      </div>

      {/* Display custom tags */}
      {customTags.map((tag) => (
        <button
          key={tag}
          onClick={() => toggleOption('Custom Tags', tag)}
          className={`inline-block m-1 p-1 border border-gray-300 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:border-blue-500 ${
            selectedFilters['Custom Tags']?.includes(tag)
              ? 'bg-blue-500 text-white'
              : 'bg-canvas-default'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}

export default CommunityMenuSelectors
