'use client'

import React, { useState } from 'react'
// Import your custom icons
import { CustomCloseIcon } from '@/app/api/icons'
import { BaseStep } from './BaseStep'

// Full list of kitchen items categorized
const kitchenItems: Record<string, string[]> = {
  'Utensils & Hand Tools': [
    'Dinner Forks',
    'Salad Forks',
    'Dessert Forks',
    'Dinner Knives',
    'Paring Knives',
    'Chef’s Knife',
    'Serrated Bread Knife',
    'Boning Knife',
    'Teaspoons',
    'Tablespoons',
    'Soup Spoons',
    'Serving Spoons',
    'Dry Measuring Cups',
    'Liquid Measuring Cups',
    'Measuring Spoons',
    'Digital Kitchen Scale',
    'Vegetable Peeler',
    'Garlic Press',
    'Apple Corer/Slicer',
    'Zester/Microplane',
    'Graters',
    'Kitchen Shears',
    'Pizza Cutter',
    'Egg Separator',
    'Avocado Slicer',
    'Melon Baller',
    'Whisks',
    'Tongs',
    'Spatulas',
    'Wooden Spoons',
    'Ladles',
    'Slotted Spoons',
    'Basting Brush',
    'Potato Masher',
    'Pasta Server',
    'Ice Cream Scoop',
    'Manual Can Opener',
    'Electric Can Opener',
    'Bottle Opener',
    'Wine Corkscrew',
    'Jar Opener',
  ],
  'Knives & Cutting Boards': [
    'Chef’s Knife',
    'Paring Knife',
    'Serrated Bread Knife',
    'Santoku Knife',
    'Boning Knife',
    'Utility Knife',
    'Cleaver',
    'Wooden Cutting Board',
    'Plastic Cutting Board',
    'Bamboo Cutting Board',
    'Honing Steel',
    'Whetstone',
    'Electric Knife Sharpener',
  ],
  Cookware: [
    'Frying Pans',
    'Saucepan',
    'Sauté Pan',
    'Stockpot',
    'Dutch Oven',
    'Wok',
    'Baking Sheets',
    'Muffin Tin',
    'Loaf Pans',
    'Cake Pans',
    'Casserole Dishes',
    'Pie Dishes',
    'Roasting Pan',
  ],
  'Bakeware & Baking Tools': [
    'Rolling Pin',
    'Cooling Racks',
    'Mixing Bowls',
    'Pastry Brush',
    'Pastry Cutter',
    'Cookie Cutters',
    'Silicone Baking Mats',
    'Piping Bags and Tips',
    'Sifters',
    'Bench Scraper',
  ],
  'Food Prep Gadgets': [
    'Mandoline Slicer',
    'Box Grater',
    'Mortar & Pestle',
    'Salad Spinner',
    'Egg Timer',
    'Citrus Juicer',
    'Food Mill',
    'Meat Tenderizer',
    'Herb Scissors',
    'Corn Peeler',
  ],
  'Storage & Organization': [
    'Glass/Plastic Storage Containers',
    'Mason Jars',
    'Vacuum Sealer & Bags',
    'Ziplock Bags',
    'Bread Box',
    'Spice Racks',
    'Lazy Susan',
    'Canisters for Dry Goods',
    'Produce Baskets',
    'Drawer Organizers',
  ],
  Appliances: [
    'Electric Kettle',
    'Toaster',
    'Hand Mixer',
    'Blender',
    'Coffee Maker',
    'Food Processor',
    'Rice Cooker',
    'Stand Mixer',
    'Air Fryer',
    'Slow Cooker',
    'Instant Pot',
    'Microwave',
    'Refrigerator',
    'Freezer',
    'Oven',
    'Stovetop/Range',
    'Dishwasher',
  ],
  'Cooking & Serving Equipment': [
    'Colander/Strainer',
    'Salad Bowl & Tongs',
    'Gravy Boat',
    'Serving Platters',
    'Soup Tureen',
    'Carving Board',
    'Fondue Pot',
    'Lazy Susan for Serving',
  ],
  'Cleaning & Waste Management': [
    'Dish Brushes',
    'Sponges',
    'Microfiber Towels',
    'Dish Drying Rack',
    'Trash Can',
    'Compost Bin',
    'Recycling Bins',
  ],
}

export function Equipment() {
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({})
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const toggleItem = (category: string, name: string) => {
    setSelectedItems((prevSelected) => {
      const categoryItems = prevSelected[category] || []
      return {
        ...prevSelected,
        [category]: categoryItems.includes(name)
          ? categoryItems.filter((itemName) => itemName !== name)
          : [...categoryItems, name],
      }
    })
  }

  const removeItem = (category: string, name: string) => {
    setSelectedItems((prevSelected) => {
      const categoryItems = prevSelected[category] || []
      return {
        ...prevSelected,
        [category]: categoryItems.filter((itemName) => itemName !== name),
      }
    })
  }

  const sortedSelectedItems = Object.keys(kitchenItems).reduce(
    (acc, category) => {
      if (selectedItems[category]) {
        acc[category] = selectedItems[category].sort(
          (a, b) => kitchenItems[category].indexOf(a) - kitchenItems[category].indexOf(b)
        )
      }
      return acc
    },
    {} as Record<string, string[]>
  )

  return (
    <BaseStep title='Select Equipment' description='Choose the equipment you need for your recipe.'>
      <div className='max-w-5xl mx-auto p-6 rounded-lg shadow-md'>
        <div className='flex flex-col lg:flex-row lg:space-x-4'>
          <div className='flex-1 min-w-0'>
            <h3 className='text-lg font-semibold mb-2'>Select Equipment:</h3>
            <div className='h-100 overflow-y-auto space-y-2 mb-4 border-2 border-gray-300 dark:border-gray-600 p-2'>
              {Object.keys(kitchenItems).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left px-2 py-1 rounded-md transition-colors border-2 border-dashed truncate ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white border-blue-800'
                      : 'bg-gray-100 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600'
                  } hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400`}
                >
                  {category}
                </button>
              ))}
            </div>
            {activeCategory && (
              <div className='grid grid-cols-1 gap-2'>
                {kitchenItems[activeCategory].map((item) => (
                  <div
                    key={item}
                    onClick={() => toggleItem(activeCategory, item)}
                    className={`p-1 border rounded-md cursor-pointer transition-colors ${
                      selectedItems[activeCategory]?.includes(item)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-700 dark:text-white'
                    } hover:bg-gray-300 dark:hover:bg-gray-600 hover:border-gray-400`}
                  >
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='flex-1 min-w-0 mt-4 lg:mt-0'>
            <h3 className='text-lg font-semibold mb-2'>Selected Equipment:</h3>
            {Object.keys(sortedSelectedItems).map((category) => (
              <div key={category}>
                <h4 className='font-semibold'>{category}</h4>
                <ul className='flex flex-wrap'>
                  {sortedSelectedItems[category].map((item) => (
                    <li
                      key={item}
                      className='flex items-center p-1 border rounded-md m-1 bg-blue-500 text-white'
                    >
                      {item}
                      <CustomCloseIcon
                        onClick={() => removeItem(category, item)}
                        className='ml-2 text-red-500 cursor-pointer hover:text-red-700'
                        style={{ width: '16px', height: '16px' }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseStep>
  )
}
