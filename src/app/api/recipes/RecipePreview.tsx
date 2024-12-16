'use client'

import { useEffect, useRef } from 'react'
import { useRecipe } from '@/app/api/providers/RecipeProvider'
import { format } from 'date-fns'
import Image from 'next/image'
import {
  IconSettings,
  IconUser,
  IconCalendar,
  IconGitBranch,
  IconGitCommit,
  IconCheck,
  IconX,
  IconMenu,
  IconEye,
  IconStore,
  IconFrame,
  IconList,
  IconGrid,
  IconStar,
  IconTrash,
  IconClock,
} from '@/components/ui/icons'
import {
  RecipeData,
  IngredientGroup,
  IngredientItem,
  Equipment,
  PairingCategory,
  ChangeLogEntry,
  PreProductionTask,
  SpecialtyIngredient,
  Signature,
  Reviewer,
  PrivacySettings,
  NecessarySkills,
  MethodProduction,
  ServingPlatingDetails,
  PairingsDetails,
  ChangeLogDetails,
  SpecialtyIngredientsDetails,
  PreProductionDetails,
  TagsDetails,
  FinalImageDetails,
  FinishingTouchDetails,
  ReviewDetails,
  MintDetails,
} from '@/app/api/types/recipe'

const hasLength = <T extends any[] | undefined>(arr: T): arr is Exclude<T, undefined> => {
  return Array.isArray(arr) && arr.length > 0
}

export function RecipePreview({ selectedStepIndex }: { selectedStepIndex: number }) {
  const { recipeData } = useRecipe()
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy')
  }

  const stepsWithIndex =
    recipeData.productionMethod?.defaultFlow?.map((step, index) => ({
      ...step,
      index,
    })) ?? []

  useEffect(() => {
    if (selectedStepIndex !== undefined && stepRefs.current[selectedStepIndex]) {
      stepRefs.current[selectedStepIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedStepIndex])

  return (
    <div className='sticky top-6 px-4 lg:px-8'>
      <div className='bg-github-canvas-subtle rounded-lg shadow-md border border-github-border-default'>
        {/* Preview Header */}
        <div className='p-4 border-b border-github-border-default bg-github-canvas-default rounded-t-lg'>
          <h2 className='text-xl font-semibold text-github-fg-default flex items-center gap-2'>
            <IconFrame className='w-5 h-5' />
            Recipe Preview
          </h2>
        </div>

        {/* Preview Content */}
        <div className='p-6 space-y-8 max-h-[calc(100vh-4rem)] overflow-y-auto'>
          {/* Title & Description */}
          {recipeData.title && (
            <section className='space-y-4 bg-github-canvas-default p-4 rounded-md shadow-sm border border-github-border-default'>
              <div className='flex items-center justify-between border-b border-github-border-muted pb-3'>
                <h4 className='text-sm font-medium text-github-fg-default flex items-center gap-2'>
                  <IconList className='w-4 h-4' />
                  Recipe Details
                </h4>
              </div>
              <div className='space-y-2'>
                <h3 className='text-lg font-medium text-github-fg-default'>{recipeData.title}</h3>
                <p className='text-sm text-github-fg-muted'>{recipeData.description}</p>
              </div>
            </section>
          )}

          {/* Method of Production */}
          {hasLength(stepsWithIndex) && (
            <section className='space-y-4 bg-github-canvas-default p-4 rounded-md shadow-md border border-github-border-default'>
              <div className='flex items-center justify-between border-b border-github-border-muted pb-3'>
                <h4 className='text-sm font-medium text-github-fg-default flex items-center gap-2'>
                  <IconGrid className='w-4 h-4' />
                  Method of Production
                </h4>
              </div>
              <div className='space-y-8'>
                {stepsWithIndex.map((step, index) => (
                  <div
                    key={step.id}
                    ref={(el) => (stepRefs.current[index] = el)}
                    className='relative pl-8 animate-slideIn'
                    style={{ animationDelay: `${step.index * 100}ms` }}
                  >
                    {/* Step number bubble */}
                    <div className='absolute left-0 top-0 w-6 h-6 rounded-full bg-github-accent-emphasis flex items-center justify-center text-white text-sm font-medium'>
                      {step.index + 1}
                    </div>

                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <h5 className='font-medium text-github-fg-default'>
                          Step {step.index + 1}
                        </h5>
                        {step.time && (
                          <div className='flex items-center gap-2 text-github-fg-muted'>
                            <IconClock className='w-4 h-4' />
                            <span>
                              {step.time} {step.timeUnit}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className='text-github-fg-muted'>{step.content}</p>

                      {step.warning && (
                        <div className='flex items-start gap-2 p-3 bg-github-danger-subtle rounded-md transform hover:scale-[1.02] transition-transform'>
                          <IconX className='w-4 h-4 text-github-danger-fg flex-shrink-0' />
                          <p className='text-sm text-github-danger-fg'>{step.warning}</p>
                        </div>
                      )}

                      {step.image && (
                        <div className='relative group overflow-hidden rounded-md h-48'>
                          <Image
                            src={step.image}
                            alt={`Step ${step.index + 1}`}
                            fill
                            className='object-cover transform transition-transform group-hover:scale-105'
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Other sections like Ingredients, Equipment, etc. */}
          {/* ... */}
        </div>
      </div>
    </div>
  )
}
