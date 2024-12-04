export interface RecipeStats {
  recipeId: string
  views: number
  likes: number
  shares: number
}

export const mockStats: RecipeStats[] = [
  {
    recipeId: '1',
    views: 150,
    likes: 30,
    shares: 10,
  },
  {
    recipeId: '2',
    views: 200,
    likes: 50,
    shares: 20,
  },
  // Add more stats as needed
]
