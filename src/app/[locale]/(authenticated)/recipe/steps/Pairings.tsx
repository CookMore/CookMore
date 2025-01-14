'use client'

import { useState, useEffect } from 'react'
import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { usePairings } from '@/app/[locale]/(authenticated)/recipe/hooks/usePairings'
import { useRecipeStorage } from '@/app/[locale]/(authenticated)/recipe/hooks/core/useRecipeStorage'
import {
  IconPlus,
  IconX,
  IconGitBranch,
  IconAlertCircle,
  IconLoader,
  IconWine,
  IconBeer,
  IconCheese,
  IconCaviar,
  IconWater,
  IconSpirit,
  IconCocktail,
  IconOther,
} from '@/app/api/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { BaseStep } from './BaseStep'
import { StepComponentProps } from './index'
import { CriticalControlPoint } from '../components/CriticalControlPoint'

const pairingTags = ['Wine', 'Beer', 'Cheese', 'Caviar', 'Water', 'Spirit', 'Cocktail', 'Other']

const pairingIcons = {
  Wine: <IconWine className='w-4 h-4 mr-1' />,
  Beer: <IconBeer className='w-4 h-4 mr-1' />,
  Cheese: <IconCheese className='w-4 h-4 mr-1' />,
  Caviar: <IconCaviar className='w-4 h-4 mr-1' />,
  Water: <IconWater className='w-4 h-4 mr-1' />,
  Spirit: <IconSpirit className='w-4 h-4 mr-1' />,
  Cocktail: <IconCocktail className='w-4 h-4 mr-1' />,
  Other: <IconOther className='w-4 h-4 mr-1' />,
}

export function Pairings({ onNext, onBack }: StepComponentProps) {
  const { state, updateRecipe } = useRecipe()
  const { updatePairings } = usePairings()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number>(0)
  const [isCcpOpen, setIsCcpOpen] = useState(false)
  const [aiPairingSuggestions, setAiPairingSuggestions] = useState<string>('')
  const [pairingInput, setPairingInput] = useState<string>('')

  const { storedData, saveDraft, loadDraft, clearDraft } = useRecipeStorage()

  useEffect(() => {
    if (storedData) {
      updateRecipe(storedData.recipeData)
    }
  }, [storedData, updateRecipe])

  const addPairingCategory = async () => {
    setError('')
    const newCategory = {
      category: '',
      items: [],
      notes: '',
      criticalControlPoints: [],
    }

    const updates = {
      pairings: [...(state.recipeData.pairings || []), newCategory],
    }

    try {
      updateRecipe(updates)
      if (state.recipeData.id) {
        setIsLoading(true)
        await updatePairings(state.recipeData.id, updates.pairings)
      }
    } catch (err) {
      setError('Failed to add pairing category')
    } finally {
      setIsLoading(false)
    }
  }

  const updatePairing = async (
    index: number,
    updates: Partial<(typeof state.recipeData.pairings)[0]>
  ) => {
    setError('')
    const current = [...(state.recipeData.pairings || [])]
    current[index] = { ...current[index], ...updates }

    try {
      updateRecipe({ pairings: current })
      if (state.recipeData.id) {
        setIsLoading(true)
        await updatePairings(state.recipeData.id, current)
      }
    } catch (err) {
      setError('Failed to update pairing')
    } finally {
      setIsLoading(false)
    }
  }

  const addPairingItem = async (index: number, item: string) => {
    if (!item.trim()) return
    setError('')

    const current = [...(state.recipeData.pairings || [])]
    current[index] = {
      ...current[index],
      items: [...(current[index].items || []), item.trim()],
    }

    try {
      updateRecipe({ pairings: current })
      if (state.recipeData.id) {
        setIsLoading(true)
        await updatePairings(state.recipeData.id, current)
      }
    } catch (err) {
      setError('Failed to add pairing item')
    } finally {
      setIsLoading(false)
    }
  }

  const removePairingItem = (categoryIndex: number, itemIndex: number) => {
    const current = [...(state.recipeData.pairings || [])]
    current[categoryIndex] = {
      ...current[categoryIndex],
      items: current[categoryIndex].items.filter((_, i) => i !== itemIndex),
    }
    updateRecipe({ pairings: current })
  }

  const removePairingCategory = (index: number) => {
    updateRecipe({
      pairings: state.recipeData.pairings?.filter((_, i) => i !== index),
    })
  }

  const validatePairings = () => {
    if (!state.recipeData.pairings?.length) {
      setError('At least one pairing category is required')
      return false
    }

    const invalidCategories = state.recipeData.pairings.filter(
      (category) => !category.category?.trim() || !category.items?.length
    )

    if (invalidCategories.length > 0) {
      setError('All pairing categories must have a name and at least one item')
      return false
    }

    return true
  }

  const handleTagSelection = (categoryIndex: number, tag: string) => {
    const current = [...(state.recipeData.pairings || [])]
    current[categoryIndex] = { ...current[categoryIndex], category: tag }
    updateRecipe({ pairings: current })
  }

  const handleAddCcp = (categoryIndex: number, ccp: { note: string }) => {
    const current = [...(state.recipeData.pairings || [])]
    current[categoryIndex].criticalControlPoints.push(ccp)

    const updates = {
      pairings: current,
    }

    updateRecipe(updates)
  }

  const toggleCcp = () => {
    setIsCcpOpen((prev) => !prev)
  }

  const handleOpenCategory = (index: number) => {
    setOpenCategoryIndex(index)
  }

  const handleGeneratePairings = async () => {
    try {
      const response = await fetch('/api/generate/generatePairings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: pairingInput }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setAiPairingSuggestions(data.suggestions || 'No suggestions available')
    } catch (error) {
      console.error('Error fetching pairings:', error)
      setAiPairingSuggestions('Error fetching pairings')
    }
  }

  return (
    <BaseStep
      title='Pairings'
      description='Suggest complementary items and pairings for the recipe.'
      data={state.recipeData}
      onChange={updateRecipe}
      onNext={() => validatePairings() && onNext()}
      onBack={onBack}
      isValid={!error && !isLoading}
      isSaving={isLoading}
    >
      {error && (
        <div className='mb-4 p-3 bg-github-danger-subtle rounded-md flex items-center text-github-danger-fg'>
          <IconAlertCircle className='w-4 h-4 mr-2' />
          {error}
        </div>
      )}

      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2 text-github-fg-muted'>
            <IconGitBranch className='w-4 h-4' />
            <span className='text-sm'>Pairing Categories</span>
          </div>
          <button
            onClick={addPairingCategory}
            disabled={isLoading}
            className='bg-[linear-gradient(#e9e9e9,#e9e9e9_50%,#fff)] group w-auto inline-flex transition-all duration-300 overflow-visible rounded-md'
          >
            <div className='w-full h-full bg-[linear-gradient(to_top,#ececec,#fff)] overflow-hidden p-1 rounded-md hover:shadow-none duration-300'>
              <div className='w-full h-full text-xl gap-x-0.5 gap-y-0.5 justify-center text-white bg-green-500 group-hover:bg-green-600 duration-200 items-center text-[18px] font-medium gap-4 inline-flex overflow-hidden px-4 py-2 rounded-md group-hover:text-blue-600'>
                <IconPlus className='w-5 h-5' />
                <span>Add Pairing</span>
              </div>
            </div>
          </button>
        </div>

        <div className='ai-pairing-agent mb-6'>
          <h2 className='text-lg font-semibold'>Pairé - Your AI Pairing Agent</h2>
          <input
            type='text'
            value={pairingInput}
            onChange={(e) => setPairingInput(e.target.value)}
            placeholder='Enter an item to pair with...'
            className='w-full px-3 py-2 mb-2 border border-gray-300 rounded-md'
          />
          <button
            onClick={handleGeneratePairings}
            className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Generate Pairings
          </button>
          {aiPairingSuggestions && (
            <div className='mt-4 p-3 bg-gray-100 rounded'>
              <h3 className='font-medium'>Suggestions:</h3>
              <p>{aiPairingSuggestions}</p>
            </div>
          )}
        </div>

        <AnimatePresence>
          <div className='space-y-6'>
            {state.recipeData.pairings?.map((category: any, categoryIndex: number) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`group space-y-4 p-6 bg-github-canvas-subtle rounded-lg border border-github-border-default
                         hover:border-github-border-default/80 transition-colors duration-200 ${openCategoryIndex === categoryIndex ? '' : 'hidden'}`}
                onClick={() => handleOpenCategory(categoryIndex)}
              >
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <input
                      type='text'
                      value={category.category}
                      onChange={(e) => updatePairing(categoryIndex, { category: e.target.value })}
                      className='text-lg font-medium bg-transparent border-none focus:ring-0 w-full
                               placeholder:text-github-fg-muted/50'
                      placeholder='Category name (e.g., Wines, Side Dishes)'
                    />
                  </div>
                  <button
                    onClick={() => removePairingCategory(categoryIndex)}
                    className='text-github-fg-muted hover:text-github-danger-fg transition-colors duration-200
                             opacity-0 group-hover:opacity-100'
                  >
                    <IconX className='w-5 h-5' />
                  </button>
                </div>

                <div className='tag-system mt-4'>
                  <label className='block mb-2'>Select Pairing Category:</label>
                  <div className='flex flex-wrap space-x-2'>
                    {pairingTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagSelection(categoryIndex, tag)}
                        className={`p-2 flex items-center ${category.category === tag ? 'bg-accent-emphasis text-fg-onEmphasis' : 'bg-btn-bg text-fg-default'} rounded hover:bg-btn-hover`}
                      >
                        {pairingIcons[tag]}
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='relative'>
                    <input
                      type='text'
                      placeholder='Add pairing item (press Enter)'
                      className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md
                               focus:border-github-accent-emphasis focus:ring-1 focus:ring-github-accent-emphasis'
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addPairingItem(categoryIndex, e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className='flex items-center gap-2 px-3 py-1.5 bg-github-canvas-default rounded-md border border-transparent hover:border-github-border-default transition-all duration-200'
                      >
                        <span className='text-sm text-github-fg-default'>{item}</span>
                        <button onClick={() => removePairingItem(categoryIndex, itemIndex)}>
                          <IconX className='w-4 h-4' />
                        </button>
                      </div>
                    ))}
                  </div>

                  <textarea
                    value={category.notes}
                    onChange={(e) => updatePairing(categoryIndex, { notes: e.target.value })}
                    className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md
                             focus:border-github-accent-emphasis focus:ring-1 focus:ring-github-accent-emphasis
                             resize-none transition-colors duration-200'
                    placeholder='Additional notes about these pairings...'
                    rows={2}
                  />
                </div>

                <div
                  className={`border border-red-600 p-4 rounded-md ${isCcpOpen ? '' : 'hover:bg-red-600 cursor-pointer'}`}
                  onClick={!isCcpOpen ? toggleCcp : undefined}
                >
                  <div className='flex justify-between items-center'>
                    <button onClick={toggleCcp} className='flex items-center space-x-2'>
                      <span className='text-center w-full'>{isCcpOpen ? '' : 'Add CCP'}</span>
                      <IconPlus className={`w-4 h-4 transform ${isCcpOpen ? 'rotate-45' : ''}`} />
                    </button>
                    {isCcpOpen && (
                      <button onClick={toggleCcp} className='text-red-600'>
                        <IconX className='w-4 h-4' />
                      </button>
                    )}
                  </div>
                  {isCcpOpen && (
                    <CriticalControlPoint onAdd={(ccp) => handleAddCcp(categoryIndex, ccp)} />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </BaseStep>
  )
}
