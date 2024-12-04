export interface Collection {
  id: string
  name: string
  description: string
  recipes: string[] // Array of recipe IDs
}

export const mockCollections: Collection[] = [
  {
    id: 'collection1',
    name: 'Italian Favorites',
    description: 'A collection of classic Italian recipes.',
    recipes: ['1', '2', '3'], // Example recipe IDs
  },
  {
    id: 'collection2',
    name: 'Quick Meals',
    description: 'Recipes that can be prepared in under 30 minutes.',
    recipes: ['4', '5'],
  },
  // Add more collections as needed
]
