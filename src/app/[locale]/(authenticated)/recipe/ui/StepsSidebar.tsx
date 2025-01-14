'use client'

import { useRecipe } from '../context/RecipeContext'
import { IconChevronLeft } from '@/app/api/icons'
import { STEPS } from '../steps/steps'
import { useState, useEffect } from 'react'

interface Props {
  currentStep: number
  setCurrentStep: (step: number) => void
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  validationResults: Record<string, string>
}

export function StepsSidebar({
  currentStep,
  setCurrentStep,
  isExpanded,
  setIsExpanded,
  validationResults,
}: Props) {
  const { recipeData } = useRecipe()
  const [hydrated, setHydrated] = useState(false)

  // Handle hydration
  useEffect(() => {
    setHydrated(true)
  }, [])

  const handleStepClick = async (index: number) => {
    if (!hydrated) return

    if (index > currentStep) {
      const stepValidation = validationResults[STEPS[currentStep].id] || []
      if (stepValidation.length > 0) {
        console.log('Validation errors:', stepValidation)
        return
      }
    }
    console.log('Attempting to change to step:', index)
    console.log('Step validation passed, changing to step:', index)
    setCurrentStep(index)
  }

  return (
    <>
      {isExpanded && (
        <div
          className='fixed inset-0 bg-github-canvas-default z-30 lg:hidden'
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div
        className={`
          fixed top-14 bottom-0 left-0 
          border-r border-github-border-default
          bg-github-canvas-default
          transition-all duration-100 ease-in-out
          z-[99999]
          pt-10
          flex flex-col
          ${isExpanded ? 'w-[280px]' : 'w-[48px]'}
        `}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            absolute -right-[-6px] top-[7px]
            bg-github-canvas-default 
            border border-github-border-default
            rounded-full
            shadow-sm
            hover:bg-github-canvas-subtle
            flex items-center justify-center
            w-8 h-8
            transition-transform duration-200
            ${isExpanded ? 'rotate-0' : 'rotate-180'}
          `}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <IconChevronLeft className='w-4 h-4 text-github-fg-muted' />
        </button>

        {hydrated && (
          <div className='flex-1 min-h-0 overflow-y-auto pt-3'>
            {isExpanded ? (
              <div
                className={`
                  space-y-1 px-2
                  transition-opacity duration-500 ease-in-out
                  ${isExpanded ? 'opacity-100' : 'opacity-0'}
                `}
              >
                {STEPS.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={`
                      relative group w-full text-left px-3 py-2 rounded-md
                      transition-all duration-100 ease-in-out
                      ${
                        currentStep === index
                          ? 'text-github-fg-default bg-github-canvas-default ring-2 ring-github-accent-emphasis'
                          : 'text-github-fg-muted hover:text-github-fg-default'
                      }
                      hover:bg-github-canvas-default
                      hover:ring-2 hover:ring-github-accent-emphasis/50
                      hover:scale-[1.02]
                      active:scale-[0.98]
                      focus:outline-none
                    `}
                  >
                    <span className='text-sm transform transition-transform duration-100 ease-in-out group-hover:translate-x-0.5'>
                      {step.label}
                    </span>

                    {currentStep === index && (
                      <span className='absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-github-accent-emphasis' />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div
                className={`
                  flex flex-col items-center py-2 space-y-2
                  transition-opacity duration-100 ease-in-out
                  ${!isExpanded ? 'opacity-100' : 'opacity-0'}
                `}
              >
                {STEPS.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={`
                      relative group
                      w-8 h-8 rounded-md
                      flex items-center justify-center
                      transition-all duration-200 ease-in-out
                      ${
                        currentStep === index
                          ? 'text-github-fg-default bg-github-canvas-default ring-2 ring-github-accent-emphasis'
                          : 'text-github-fg-muted hover:text-github-fg-default'
                      }
                      hover:bg-github-canvas-default
                      hover:ring-2 hover:ring-github-accent-emphasis/50
                      hover:scale-110
                      active:scale-95
                      focus:outline-none
                    `}
                  >
                    <span className='text-sm font-medium'>{index + 1}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
