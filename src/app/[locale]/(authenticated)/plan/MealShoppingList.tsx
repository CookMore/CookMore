// src/app/[locale]/(authenticated)/calendar/MealShoppingList.tsx

import { useState } from 'react'

export default function MealShoppingList() {
  const [shoppingList, setShoppingList] = useState<string[]>([])

  const generateShoppingList = async () => {
    console.log('Generating shopping list')
    try {
      const response = await fetch('/api/generateShoppingList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      console.log('Received shopping list:', data.shoppingList)
      setShoppingList(data.shoppingList)
    } catch (error) {
      console.error('Error generating shopping list:', error)
    }
  }

  return (
    <div>
      <h2>Shopping List</h2>
      <button onClick={generateShoppingList} className='mt-2 p-2 bg-green-500 text-white rounded'>
        Generate Shopping List
      </button>
      <ul className='list-disc pl-5 mt-4'>
        {shoppingList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
