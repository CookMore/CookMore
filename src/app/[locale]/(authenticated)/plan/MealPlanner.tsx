'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { ChefHat, Crown, Users, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useMealPlannerAI } from './hooks/useMealPlannerAI'
import { toast } from 'sonner'
import * as RecipeTypes from '@/app/[locale]/(authenticated)/recipe/types/recipe'

interface MealPlannerProps {
  setMealPlans: React.Dispatch<React.SetStateAction<string[]>>
}

const tierIcons: Record<Lowercase<keyof typeof ProfileTier>, typeof ChefHat> = {
  free: ChefHat,
  pro: Crown,
  group: Users,
  og: Star,
} as const

const tierColors = {
  free: 'text-blue-500 bg-blue-500/10',
  pro: 'text-purple-500 bg-purple-500/10',
  group: 'text-amber-500 bg-amber-500/10',
  og: 'text-emerald-500 bg-emerald-500/10',
} as const

const tierKey = (tier: ProfileTier | keyof typeof ProfileTier) => {
  const tierMap = {
    [ProfileTier.FREE]: 'free',
    [ProfileTier.PRO]: 'pro',
    [ProfileTier.GROUP]: 'group',
    [ProfileTier.OG]: 'og',
  } as const

  return (tierMap[tier as ProfileTier] ?? 'free') as Lowercase<keyof typeof ProfileTier>
}

interface MealPlanFormData extends Partial<RecipeTypes.RecipeData> {
  timeToCook: string
  cuisineType: string
  preferences: string[]
  dietaryRestrictions: string
  inspiration: RecipeTypes.Inspiration
  mealCount: string
  numberOfPeople: number
  numberOfMeals?: number
  budget: number
  mealPlanningOption: string
}

interface MealPlanResponse {
  mealPlan: string
  image?: string
}

export default function MealPlanner({ setMealPlans }: MealPlannerProps) {
  const [mounted, setMounted] = useState(false)
  const { generateMealPlan, isLoading, error } = useMealPlannerAI()
  const { currentTier } = useAuth()
  const form = useForm<MealPlanFormData>({
    defaultValues: {
      timeToCook: '',
      cuisineType: '',
      preferences: [],
      dietaryRestrictions: '',
      inspiration: '',
      mealCount: 'one',
      numberOfPeople: 1,
      servings: 1,
      prepTime: 1,
      cookTime: 1,
      difficulty: 'easy',
      budget: 5,
      mealPlanningOption: 'sameMealDifferentDays',
    },
  })
  const [mealPlanResponse, setMealPlanResponse] = useState<MealPlanResponse>({ mealPlan: '' })
  const [mealPlanTitle, setMealPlanTitle] = useState<string>('')
  const [budgetValue, setBudgetValue] = useState(5)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 100) // Small delay to ensure parent is mounted

    const storedMealPlan = localStorage.getItem('mealPlanResponse')
    const storedTitle = localStorage.getItem('mealPlanTitle')
    if (storedMealPlan) {
      try {
        const parsedMealPlan = JSON.parse(storedMealPlan)
        setMealPlanResponse(parsedMealPlan)
      } catch (e) {
        console.error('Failed to parse meal plan from local storage:', e)
      }
    }
    if (storedTitle) {
      setMealPlanTitle(storedTitle)
    }

    return () => clearTimeout(timer)
  }, [])

  const onSubmit = async (data: MealPlanFormData) => {
    try {
      const promptData = {
        ...data,
        includeMetadata: true,
      }
      const response: MealPlanResponse = await generateMealPlan(promptData)
      setMealPlans((prev) => [...prev, response.mealPlan])
      setMealPlanResponse(response)
      setMealPlanTitle(`Meal Plan for ${data.cuisineType}`)
      localStorage.setItem('mealPlanResponse', JSON.stringify({ mealPlan: response.mealPlan }))
      localStorage.setItem('mealPlanTitle', `Meal Plan for ${data.cuisineType}`)
      localStorage.setItem('mealPlanSettings', JSON.stringify(data))
      toast.success('Meal plan generated successfully!')
    } catch (err) {
      toast.error(error || 'Failed to generate meal plan')
    }
  }

  const generateShoppingListFromMealPlan = () => {
    if (!mealPlanResponse.mealPlan) return

    // Debugging log to check the content of mealPlanResponse
    console.log('Meal Plan Response:', mealPlanResponse)

    // Extract ingredients from the meal plan
    const ingredientsSection = mealPlanResponse.mealPlan
      .split('**Instructions**')[0]
      .split('**Ingredients**')[1]

    if (!ingredientsSection) {
      console.error('Ingredients section not found in meal plan response.')
      return
    }

    const trimmedIngredientsSection = ingredientsSection.trim()
    const ingredients = trimmedIngredientsSection.match(/\d+\.\s+[^\n]+/g) || []
    console.log('Extracted ingredients:', ingredients)
    const shoppingList = ingredients.map((line) => line.replace(/^\d+\.\s+/, '').trim())
    console.log('Final shopping list:', shoppingList)

    // Store the shopping list in local storage
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList))

    // Emit a custom event to notify the PlanSidebar
    const event = new Event('shoppingListGenerated')
    window.dispatchEvent(event)

    toast.success('Shopping list generated successfully!')
  }

  const clearMealPlan = () => {
    localStorage.removeItem('mealPlanResponse')
    localStorage.removeItem('mealPlanTitle')
    setMealPlanResponse({ mealPlan: '' })
    setMealPlanTitle('')
  }

  if (!mounted) {
    return (
      <div className='max-w-4xl mx-auto p-6'>
        <div className='animate-pulse'>
          <div className='h-8 bg-github-canvas-subtle rounded w-1/4 mb-6'></div>
          <div className='space-y-4'>
            <div className='h-32 bg-github-canvas-subtle rounded'></div>
            <div className='h-32 bg-github-canvas-subtle rounded'></div>
          </div>
        </div>
      </div>
    )
  }

  const togglePreference = (pref: string) => {
    const currentPreferences = form.watch('preferences')
    form.setValue(
      'preferences',
      currentPreferences.includes(pref)
        ? currentPreferences.filter((p) => p !== pref)
        : [...currentPreferences, pref]
    )
  }

  const TierIcon = tierIcons[tierKey(currentTier)]

  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBudgetValue(Number(event.target.value))
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-github-fg-default'>Meal Planner</h2>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${tierColors[tierKey(currentTier)]}`}
        >
          <TierIcon className='w-5 h-5' />
          <span className='font-medium'>{tierKey(currentTier)}</span>
        </motion.div>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 border border-github-border-default rounded-lg p-6 bg-github-canvas-subtle shadow-lg'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='col-span-2 border-b border-github-border-default pb-4 mb-4'>
            <h3 className='text-lg font-semibold text-github-fg-default'>Planning</h3>
          </div>

          <div className='hover:border-github-accent-emphasis border border-transparent rounded-md p-2 transition-colors'>
            <label className='block text-sm font-medium mb-2 text-github-fg-default'>
              How Many Meals Are You Planning For?
            </label>
            <input
              type='number'
              {...form.register('numberOfMeals')}
              className='w-full p-2 rounded-md bg-github-canvas-default border border-github-border-default text-github-fg-default shadow-sm focus:ring-2 focus:ring-github-accent-emphasis'
              min='1'
            />
          </div>

          <div className='hover:border-github-accent-emphasis border border-transparent rounded-md p-2 transition-colors'>
            <label className='block text-sm font-medium mb-2 text-github-fg-default'>
              Meal Planning Options:
            </label>
            <select
              {...form.register('mealPlanningOption')}
              className='w-full p-2 rounded-md bg-github-canvas-default border border-github-border-default text-github-fg-default shadow-sm focus:ring-2 focus:ring-github-accent-emphasis'
            >
              <option value='sameMealDifferentDays'>Same Meal/Different Days</option>
              <option value='differentMealsDifferentDays'>Different Meals/Different Days</option>
            </select>
          </div>

          <div className='hover:border-github-accent-emphasis border border-transparent rounded-md p-2 transition-colors'>
            <label className='block text-sm font-medium mb-2 text-github-fg-default'>
              How Many People Are We Planning For?
            </label>
            <input
              type='number'
              {...form.register('numberOfPeople')}
              className='w-full p-2 rounded-md bg-github-canvas-default border border-github-border-default text-github-fg-default shadow-sm focus:ring-2 focus:ring-github-accent-emphasis'
              min='1'
            />
          </div>

          <div className='hover:border-github-accent-emphasis border border-transparent rounded-md p-2 transition-colors'>
            <label className='block text-sm font-medium mb-2 text-github-fg-default'>
              How Many Servings?
            </label>
            <input
              type='number'
              {...form.register('servings')}
              className='w-full p-2 rounded-md bg-github-canvas-default border border-github-border-default text-github-fg-default shadow-sm focus:ring-2 focus:ring-github-accent-emphasis'
              min='1'
            />
          </div>

          <div className='hover:border-github-accent-emphasis border border-transparent rounded-md p-2 transition-colors'>
            <label className='block text-sm font-medium mb-2 text-github-fg-default'>Budget:</label>
            <input
              type='range'
              {...form.register('budget')}
              className='w-full'
              min='5'
              max='1000'
              step='5'
              onChange={handleBudgetChange}
            />
            <div className='flex justify-between text-sm text-github-fg-muted'>
              <span>$5</span>
              <span>${budgetValue}</span>
              <span>$1000</span>
            </div>
          </div>

          <div className='col-span-2 border-b border-github-border-default pb-4 mt-4 mb-4'>
            <h3 className='text-lg font-semibold text-github-fg-default'>Cooking Details</h3>
          </div>

          <div className='hover:border-github-accent-emphasis border border-transparent rounded-md p-2 transition-colors'>
            <label className='block text-sm font-medium mb-2 text-github-fg-default'>
              How long do you want to cook?
            </label>
            <select
              {...form.register('timeToCook')}
              className='w-full p-2 rounded-md bg-github-canvas-default border border-github-border-default text-github-fg-default shadow-sm focus:ring-2 focus:ring-github-accent-emphasis'
            >
              <option value=''>Select Time</option>
              <option value='15 min'>15 min</option>
              <option value='30 min'>30 min</option>
              <option value='1 hour'>1 hour</option>
              <option value='2 hours'>2 hours</option>
              <option value='More than 2 hours'>More than 2 hours</option>
            </select>
          </div>

          <div className='hover:border-github-accent-emphasis border border-transparent rounded-md p-2 transition-colors'>
            <label className='block text-sm font-medium mb-2 text-github-fg-default'>
              Prep Time (minutes):
            </label>
            <input
              type='number'
              {...form.register('prepTime')}
              className='w-full p-2 rounded-md bg-github-canvas-default border border-github-border-default text-github-fg-default shadow-sm focus:ring-2 focus:ring-github-accent-emphasis'
              min='1'
            />
          </div>

          <div className='hover:border-github-accent-emphasis border border-transparent rounded-md p-2 transition-colors'>
            <label className='block text-sm font-medium mb-2 text-github-fg-default'>
              Cook Time (minutes):
            </label>
            <input
              type='number'
              {...form.register('cookTime')}
              className='w-full p-2 rounded-md bg-github-canvas-default border border-github-border-default text-github-fg-default shadow-sm focus:ring-2 focus:ring-github-accent-emphasis'
              min='1'
            />
          </div>

          <div className='hover:border-github-accent-emphasis border border-transparent rounded-md p-2 transition-colors'>
            <label className='block text-sm font-medium mb-2 text-github-fg-default'>
              Difficulty:
            </label>
            <select
              {...form.register('difficulty')}
              className='w-full p-2 rounded-md bg-github-canvas-default border border-github-border-default text-github-fg-default shadow-sm focus:ring-2 focus:ring-github-accent-emphasis'
            >
              <option value=''>Select Difficulty</option>
              <option value='easy'>Easy</option>
              <option value='medium'>Medium</option>
              <option value='hard'>Hard</option>
              <option value='expert'>Expert</option>
            </select>
          </div>

          <div className='col-span-2 border-b border-github-border-default pb-4 mt-4 mb-4'>
            <h3 className='text-lg font-semibold text-github-fg-default'>Meal Details</h3>
          </div>

          <div className='hover:border-github-accent-emphasis border border-transparent rounded-md p-2 transition-colors'>
            <label className='block text-sm font-medium mb-2 text-github-fg-default'>
              Cuisine Type:
            </label>
            <select
              {...form.register('cuisineType')}
              className='w-full p-2 rounded-md bg-github-canvas-default border border-github-border-default text-github-fg-default shadow-sm focus:ring-2 focus:ring-github-accent-emphasis'
            >
              <option value=''>Select Cuisine</option>
              <option value='Italian'>Italian</option>
              <option value='Chinese'>Chinese</option>
              <option value='Mexican'>Mexican</option>
              <option value='Japanese'>Japanese</option>
              <option value='Indian'>Indian</option>
              <option value='Mediterranean'>Mediterranean</option>
            </select>
          </div>

          <div className='hover:border-github-accent-emphasis border border-transparent rounded-md p-2 transition-colors'>
            <label className='block text-sm font-medium mb-2 text-github-fg-default'>
              Preferences:
            </label>
            <div className='flex flex-wrap gap-2'>
              {['Vegetarian', 'Vegan', 'Gluten-Free', 'Low-Carb', 'Keto'].map((pref) => (
                <button
                  key={pref}
                  type='button'
                  onClick={() => togglePreference(pref)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    form.watch('preferences').includes(pref)
                      ? 'bg-github-accent-emphasis text-github-fg-onEmphasis'
                      : 'bg-github-btn-bg hover:bg-github-btn-hover text-github-fg-default border border-github-border-default'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <div className='hover:border-github-accent-emphasis border border-transparent rounded-md p-2 transition-colors'>
            <label className='block text-sm font-medium mb-2 text-github-fg-default'>
              Dietary Restrictions:
            </label>
            <input
              {...form.register('dietaryRestrictions')}
              type='text'
              className='w-full p-2 rounded-md bg-github-canvas-default border border-github-border-default text-github-fg-default shadow-sm focus:ring-2 focus:ring-github-accent-emphasis'
            />
          </div>

          <div className='hover:border-github-accent-emphasis border border-transparent rounded-md p-2 transition-colors'>
            <label className='block text-sm font-medium mb-2 text-github-fg-default'>
              Inspiration or Themes:
            </label>
            <textarea
              {...form.register('inspiration')}
              className='w-full p-2 rounded-md bg-github-canvas-default border border-github-border-default text-github-fg-default shadow-sm focus:ring-2 focus:ring-github-accent-emphasis'
            />
          </div>
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className={`w-full p-3 rounded-md transition-colors shadow-md ${
            isLoading
              ? 'bg-github-btn-bg cursor-not-allowed'
              : 'bg-github-accent-emphasis hover:bg-github-accent-muted text-github-fg-onEmphasis'
          }`}
        >
          {isLoading ? (
            <span className='flex items-center justify-center gap-2'>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className='w-5 h-5 border-2 border-github-fg-onEmphasis border-t-transparent rounded-full'
              />
              Generating...
            </span>
          ) : (
            'Generate Meal Plan'
          )}
        </button>
      </form>

      {mealPlanResponse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='mt-8 border border-github-border-default rounded-lg overflow-hidden'
        >
          <div className='bg-github-canvas-default p-4 border-b border-github-border-default flex justify-between items-center'>
            <h3 className='text-lg font-semibold text-github-fg-default'>Your Meal Plan</h3>
            <div className='flex gap-2'>
              <button
                onClick={clearMealPlan}
                className='p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors'
              >
                Clear Meal Plan
              </button>
              <button
                onClick={generateShoppingListFromMealPlan}
                className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
              >
                Make Shopping List
              </button>
            </div>
          </div>
          <div className='bg-github-canvas-subtle p-6'>
            <h4 className='text-lg font-semibold text-github-fg-default mt-4'>Settings Used</h4>
            <div className='flex flex-wrap gap-2 mb-4'>
              {Object.entries(form.getValues()).map(([key, value]) => (
                <div
                  key={key}
                  className='bg-github-canvas-default p-2 rounded-md text-github-fg-muted border border-github-border-default'
                >
                  <span className='font-medium'>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
                  </span>{' '}
                  {Array.isArray(value) ? value.join(', ') : value}
                </div>
              ))}
            </div>

            <div className='prose prose-github max-w-none mt-4'>
              {mealPlanResponse.mealPlan.split('\n').map((line, index) => {
                if (line.match(/^\*\*.*\*\*$/)) {
                  // Headers (wrapped in **)
                  return (
                    <h4 key={index} className='text-github-fg-default font-medium mt-4 first:mt-0'>
                      {line.replace(/^\*\*|\*\*$/g, '')}
                    </h4>
                  )
                } else if (line.match(/^\*\s/)) {
                  // Bold text (wrapped in *)
                  return (
                    <p key={index} className='font-bold text-github-fg-default'>
                      {line.replace(/^\*|\*$/g, '')}
                    </p>
                  )
                } else if (line.match(/^\d+\./)) {
                  // Numbered list items
                  return (
                    <div key={index} className='flex items-start gap-2 mt-2'>
                      <div className='w-2 h-2 rounded-full bg-github-success-emphasis mt-2'></div>
                      <p className='text-github-fg-default flex-1'>
                        {line.replace(/^\d+\.\s*/, '')}
                      </p>
                    </div>
                  )
                } else if (line.trim() === '') {
                  // Empty lines
                  return <div key={index} className='h-4'></div>
                } else {
                  // Regular text
                  return (
                    <p key={index} className='text-github-fg-muted'>
                      {line}
                    </p>
                  )
                }
              })}
            </div>

            {mealPlanResponse.image && (
              <div className='mt-4'>
                <img
                  src={mealPlanResponse.image}
                  alt='Meal Plan Image'
                  className='w-full rounded-md shadow-md'
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
