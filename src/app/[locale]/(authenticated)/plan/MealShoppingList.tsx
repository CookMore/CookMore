'use client'

import { useState, useEffect } from 'react'

export default function MealShoppingList() {
  const [shoppingList, setShoppingList] = useState<string[]>([])

  useEffect(() => {
    const storedShoppingList = localStorage.getItem('shoppingList')
    if (storedShoppingList) {
      try {
        setShoppingList(JSON.parse(storedShoppingList))
      } catch (error) {
        console.error('Failed to parse shopping list:', error)
      }
    }
  }, [])

  useEffect(() => {
    console.log('Rendering active view: MealShoppingList')
    if (shoppingList.length > 0) {
      localStorage.setItem('mealPlanAvailable', 'true')
    }
  }, [shoppingList])

  const clearShoppingList = () => {
    localStorage.removeItem('shoppingList')
    localStorage.setItem('mealPlanAvailable', 'false')
    setShoppingList([])
  }

  return (
    <div className='p-6'>
      <div className='bg-gray-800 shadow-md rounded-lg p-4'>
        <h2 className='text-xl font-bold mb-4 text-white'>Shopping List</h2>
        <ul className='list-disc pl-5 space-y-2'>
          {shoppingList.map((item, index) => (
            <li key={index} className='text-gray-300'>
              {item}
            </li>
          ))}
        </ul>
        <button
          onClick={clearShoppingList}
          className='mt-4 p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors'
        >
          Clear Shopping List
        </button>
      </div>
    </div>
  )
}
