'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { recipeSchema } from '@/lib/validations/recipe'
import type { Recipe } from '@/types/recipe'

interface RecipeEditorProps {
  recipe?: Recipe
  onSave: (data: Recipe) => Promise<void>
  isLoading?: boolean
}

export function RecipeEditor({ recipe, onSave, isLoading = false }: RecipeEditorProps) {
  const form = useForm<Recipe>({
    resolver: zodResolver(recipeSchema),
    defaultValues: recipe || {
      title: '',
      description: '',
      ingredients: [],
      instructions: [],
      equipment: [],
      servings: 1,
      prepTime: 0,
      cookTime: 0,
      difficulty: 'easy',
      cuisine: '',
      tags: [],
    },
  })

  const handleSubmit = async (data: Recipe) => {
    try {
      await onSave(data)
    } catch (error) {
      console.error('Failed to save recipe:', error)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
      <div>
        <label htmlFor='title' className='block text-sm font-medium text-github-fg-default'>
          Title
        </label>
        <input
          type='text'
          id='title'
          {...form.register('title')}
          className='mt-1 block w-full rounded-md border border-github-border-default bg-github-canvas-default px-3 py-2'
        />
      </div>

      <div>
        <label htmlFor='description' className='block text-sm font-medium text-github-fg-default'>
          Description
        </label>
        <textarea
          id='description'
          {...form.register('description')}
          rows={3}
          className='mt-1 block w-full rounded-md border border-github-border-default bg-github-canvas-default px-3 py-2'
        />
      </div>

      <button
        type='submit'
        disabled={isLoading}
        className='inline-flex justify-center rounded-md border border-transparent bg-github-success-emphasis px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-github-success-emphasis/90 focus:outline-none focus:ring-2 focus:ring-github-success-emphasis focus:ring-offset-2'
      >
        {isLoading ? 'Saving...' : 'Save Recipe'}
      </button>
    </form>
  )
}
