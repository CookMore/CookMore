import React from 'react'

const MenuRecipePreview: React.FC = () => {
  return (
    <div className='p-4 bg-github-canvas-default text-github-fg-default rounded-lg shadow-lg border border-gray-200'>
      <h2 className='text-xl font-bold mb-4'>Recipe Preview</h2>
      <p className='text-github-fg-muted'>
        This is a placeholder for the recipe preview content. Here you can display detailed
        information about the recipe, such as ingredients, preparation steps, and more.
      </p>
    </div>
  )
}

export default MenuRecipePreview
