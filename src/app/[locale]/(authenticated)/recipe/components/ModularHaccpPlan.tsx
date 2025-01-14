import { useState } from 'react'

interface ModularHaccpPlanProps {
  onSelect: (selectedCcp: string) => void
}

export function ModularHaccpPlan({ onSelect }: ModularHaccpPlanProps) {
  const categories = {
    'Cooking & Thermal Steps': [
      'Poultry Cooking',
      'Ground Meats',
      'Whole Muscle Meats',
      'Seafood Cooking',
      'Reheating Cooked Foods',
    ],
    'Cooling & Chilling': ['Cooling Cooked Foods', 'Cold Storage'],
    'Storage & Handling': ['Seafood Holding', 'Shellfish Tag Management'],
    'Sanitation & Hygiene': ['Surface Cleaning & Sanitizing', 'Hand Washing'],
    'Allergen Control': ['Cross-Contact Prevention', 'Labeling & Documentation', 'Handling SOPs'],
  }

  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <div className='p-4 bg-github-canvas-inset rounded-md'>
      <h4 className='text-md font-semibold mb-2'>Select a Preset CCP</h4>
      <div className='space-y-2'>
        {Object.keys(categories).map((category) => (
          <div key={category}>
            <button
              onClick={() => setActiveCategory(category)}
              className={`w-full text-left px-2 py-1 rounded-md transition-colors border-2 border-dashed truncate ${
                activeCategory === category
                  ? 'bg-blue-600 text-white border-blue-800'
                  : 'bg-gray-100 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600'
              } hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400`}
            >
              {category}
            </button>
            {activeCategory === category && (
              <div className='pl-4'>
                {categories[category].map((subCategory) => (
                  <button
                    key={subCategory}
                    onClick={() => onSelect(subCategory)}
                    className='w-full text-left px-2 py-1 rounded-md transition-colors border-2 border-dashed truncate bg-gray-100 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400'
                  >
                    {subCategory}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
