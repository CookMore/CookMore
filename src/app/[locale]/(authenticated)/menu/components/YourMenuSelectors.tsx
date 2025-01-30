import React, { useEffect, useState } from 'react'

// Example data structure for filters
interface FilterGroup {
  label: string
  options: string[]
}

// Selected filters interface
interface SelectedFilters {
  [key: string]: string[]
}

// Updated button styling using theme-aware classes for both selected and unselected states
const yourFilterGroups: FilterGroup[] = [
  {
    label: 'Meal Type',
    options: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Brunch', 'Late Night'],
  },
  {
    label: 'Dietary Preferences',
    options: [
      'Vegan',
      'Vegetarian',
      'Keto',
      'Paleo',
      'Gluten-Free',
      'Low-Carb',
      'High-Protein',
      'Dairy-Free',
    ],
  },
  {
    label: 'Occasions / Holidays',
    options: [
      'Weekend',
      'Birthday',
      'Holiday',
      'Date Night',
      'Family Gathering',
      'Super Bowl',
      'Halloween',
      'Thanksgiving',
      'Christmas',
    ],
  },
]

// Props so we can notify a parent component of changes (e.g. to highlight hamburger)
interface YourMenuSelectorsProps {
  onFilterChange?: (filters: SelectedFilters) => void
}

const LOCAL_STORAGE_KEY = 'yourMenuFilters'

const YourMenuSelectors: React.FC<YourMenuSelectorsProps> = ({ onFilterChange }) => {
  // Initialize selectedFilters with the defined type
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({})
  const [customTags, setCustomTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // 1. Load initial filters from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSelectedFilters(parsed)
      }
    } catch (error) {
      console.warn('Failed to load yourMenuFilters from local storage:', error)
    }
  }, [])

  // 2. Whenever filters change, persist to local storage and inform parent
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedFilters))
    onFilterChange?.(selectedFilters)
  }, [selectedFilters, onFilterChange])

  // Helper function to toggle a given option in a given group
  const toggleOption = (groupLabel: string, option: string) => {
    setSelectedFilters((prev) => {
      const currentGroup = prev[groupLabel] || []
      const isSelected = currentGroup.includes(option)

      let updatedGroup
      if (isSelected) {
        updatedGroup = currentGroup.filter((item) => item !== option)
      } else {
        updatedGroup = [...currentGroup, option]
      }

      return {
        ...prev,
        [groupLabel]: updatedGroup,
      }
    })
  }

  // Function to add custom tags
  const addCustomTags = () => {
    const newTags = tagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag)
    setCustomTags([...customTags, ...newTags])
    setTagInput('')
  }

  // Update clearAllFilters to clear custom tags
  const clearAllFilters = () => {
    setSelectedFilters({})
    setCustomTags([])
  }

  return (
    <div className='mega-menu p-4 border border-gray-300 rounded-lg shadow-md'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-bold'>Your Menu Filters</h3>
        <button
          onClick={clearAllFilters}
          className='text-sm text-red-500 underline hover:text-red-700'
        >
          Clear All
        </button>
      </div>

      {yourFilterGroups.map((group) => (
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

export default YourMenuSelectors
