'use client'

import { useState } from 'react'
import { usePairings } from '@/hooks/usePairings'
import { useRecipePreview } from '@/hooks/useRecipePreview'
import { BaseStep } from './BaseStep'
import { RecipeData } from '@/types/recipe'
import { IconPlus, IconX, IconGitBranch, IconAlertCircle, IconLoader } from '@/components/ui/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { StepComponentProps } from './index'

export function Pairings({ data, onChange, onNext, onBack }: StepComponentProps) {
  const { updatePairings } = usePairings()
  const { updatePreview } = useRecipePreview()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const addPairingCategory = async () => {
    setError('')
    const newCategory = {
      category: '',
      items: [],
      notes: '',
    }

    const updates = {
      pairings: [...(data.pairings || []), newCategory],
    }

    try {
      onChange(updates)
      await updatePreview('pairings', updates)

      if (data.id) {
        setIsLoading(true)
        await updatePairings(data.id, updates.pairings)
      }
    } catch (err) {
      setError('Failed to add pairing category')
      onChange({ pairings: data.pairings }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const updatePairing = async (index: number, updates: Partial<RecipeData['pairings'][0]>) => {
    setError('')
    const current = [...(data.pairings || [])]
    current[index] = { ...current[index], ...updates }

    const pairingUpdates = { pairings: current }

    try {
      onChange(pairingUpdates)
      await updatePreview('pairings', pairingUpdates)

      if (data.id) {
        setIsLoading(true)
        await updatePairings(data.id, current)
      }
    } catch (err) {
      setError('Failed to update pairing')
      onChange({ pairings: data.pairings }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const addPairingItem = async (index: number, item: string) => {
    if (!item.trim()) return
    setError('')

    const current = [...(data.pairings || [])]
    current[index] = {
      ...current[index],
      items: [...(current[index].items || []), item.trim()],
    }

    const updates = { pairings: current }

    try {
      onChange(updates)
      await updatePreview('pairings', updates)

      if (data.id) {
        setIsLoading(true)
        await updatePairings(data.id, current)
      }
    } catch (err) {
      setError('Failed to add pairing item')
      onChange({ pairings: data.pairings }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const removePairingItem = (categoryIndex: number, itemIndex: number) => {
    const current = [...(data.pairings || [])]
    current[categoryIndex] = {
      ...current[categoryIndex],
      items: current[categoryIndex].items.filter((_, i) => i !== itemIndex),
    }
    onChange({ pairings: current })
  }

  const removePairingCategory = (index: number) => {
    onChange({
      pairings: data.pairings?.filter((_, i) => i !== index),
    })
  }

  const validatePairings = () => {
    if (!data.pairings?.length) {
      setError('At least one pairing category is required')
      return false
    }

    const invalidCategories = data.pairings.filter(
      (category) => !category.category?.trim() || !category.items?.length
    )

    if (invalidCategories.length > 0) {
      setError('All pairing categories must have a name and at least one item')
      return false
    }

    return true
  }

  return (
    <BaseStep
      title='Pairings'
      description='Suggest complementary items and pairings for the recipe.'
      data={data}
      onChange={onChange}
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
            className='flex items-center gap-2 px-4 py-2 bg-github-success-emphasis text-white rounded-md
                     hover:bg-github-success-emphasis/90 transition-colors duration-200 disabled:opacity-50'
          >
            {isLoading ? (
              <IconLoader className='w-4 h-4 animate-spin' />
            ) : (
              <IconPlus className='w-4 h-4' />
            )}
            <span>Add Category</span>
          </button>
        </div>

        <AnimatePresence>
          <div className='space-y-6'>
            {data.pairings?.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='group space-y-4 p-6 bg-github-canvas-subtle rounded-lg border border-github-border-default
                         hover:border-github-border-default/80 transition-colors duration-200'
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
                    <AnimatePresence>
                      {category.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className='group/item flex items-center gap-2 px-3 py-1.5 bg-github-canvas-default rounded-md
                                   border border-transparent hover:border-github-border-default transition-all duration-200'
                        >
                          <span className='text-sm text-github-fg-default'>{item}</span>
                          <button
                            onClick={() => removePairingItem(categoryIndex, itemIndex)}
                            className='text-github-fg-muted hover:text-github-danger-fg transition-colors duration-200
                                     opacity-0 group-hover/item:opacity-100'
                          >
                            <IconX className='w-4 h-4' />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
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
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </BaseStep>
  )
}
