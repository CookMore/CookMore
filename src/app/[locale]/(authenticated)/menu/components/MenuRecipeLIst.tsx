import React, { useState } from 'react'
import placeholderData from '../placeholderData.json'

interface Recipe {
  id: string
  title: string
  description: string
  tags: string[]
  isMinted: boolean
}

const MenuRecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(placeholderData)

  const [searchTerm, setSearchTerm] = useState('')

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddRecipe = (recipeId: string) => {
    // Logic to add recipe to the menu
    console.log(`Adding recipe ${recipeId} to the menu`)
  }

  return (
    <div className='menu-recipe-list'>
      <input
        type='text'
        placeholder='Search recipes...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='search-bar'
      />
      <ul>
        {filteredRecipes.map((recipe) => (
          <li key={recipe.id} className='recipe-card'>
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <p>Tags: {recipe.tags.join(', ')}</p>
            <button onClick={() => handleAddRecipe(recipe.id)}>Add to Menu</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MenuRecipeList
