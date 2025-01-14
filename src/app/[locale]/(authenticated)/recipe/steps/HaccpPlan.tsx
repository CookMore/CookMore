'use client'

import { useState } from 'react'
import { useHaccp } from '@/app/[locale]/(authenticated)/recipe/hooks/useHaccp'
import {
  IconAlertCircle,
  IconLoader,
  IconPlus,
  IconX,
  IconAlertTriangle,
  IconInfo,
} from '@/app/api/icons'
import { BaseStep } from './BaseStep'
import { RecipeData, HaccpStep } from '@/app/[locale]/(authenticated)/recipe/types/recipe'
import { StepComponentProps } from './index'

export function HaccpPlan({ data, onChange, onNext, onBack }: StepComponentProps) {
  const { updateHaccpPlan } = useHaccp()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: string[] }>({})

  const categories = {
    'Cooking & Thermal Steps': [
      'Poultry Cooking',
      'Ground Meats',
      'Whole Muscle Meats',
      'Seafood Cooking',
      'Reheating Cooked Foods',
    ],
    'Cooling & Chilling': ['Cooling Cooked Foods', 'Cold Storage'],
    'Storage & Handling': ['Seafood Holding', 'Shellfish Tag Management'],
    'Sanitation & Hygiene': ['Surface Cleaning & Sanitizing', 'Hand Washing'],
    'Allergen Control': ['Cross-Contact Prevention', 'Labeling & Documentation', 'Handling SOPs'],
  }

  const addHaccpStep = async () => {
    setError('')
    setIsLoading(true)
    const newStep: HaccpStep = {
      step: '',
      hazards: [],
      controls: [],
      criticalLimits: [],
      monitoring: {
        what: '',
        how: '',
        when: '',
        who: '',
      },
      correctiveActions: [],
      verification: [],
      records: [],
    }

    const updates: Partial<RecipeData> = {
      haccpPlan: [...(data.haccpPlan || []), newStep],
    }

    try {
      onChange(updates)
      await updateHaccpPlan(data.id, updates.haccpPlan || [])
    } catch (err) {
      setError('Failed to add HACCP step')
      onChange({ haccpPlan: data.haccpPlan }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const toggleInfo = () => setShowInfo(!showInfo)

  const updateHaccpStep = async (index: number, updates: Partial<HaccpStep>) => {
    setError('')
    const current = [...(data.haccpPlan || [])] as HaccpStep[]
    current[index] = { ...current[index], ...updates }

    const haccpUpdates: Partial<RecipeData> = { haccpPlan: current }

    try {
      onChange(haccpUpdates)
      await updateHaccpPlan(data.id, current)
    } catch (err) {
      setError('Failed to update HACCP step')
      onChange({ haccpPlan: data.haccpPlan }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const removeHaccpStep = async (index: number) => {
    setError('')
    const updates = {
      haccpPlan: data.haccpPlan?.filter((_: any, i: number) => i !== index),
    }

    try {
      onChange(updates)
      await updateHaccpPlan(data.id, updates.haccpPlan)
    } catch (err) {
      setError('Failed to remove HACCP step')
      onChange({ haccpPlan: data.haccpPlan }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const validateHaccpPlan = () => {
    if (!data.haccpPlan?.length) {
      setError('At least one HACCP control point is required')
      return false
    }

    const invalidSteps = data.haccpPlan.filter(
      (step: HaccpStep) =>
        !step.step ||
        !step.hazards.length ||
        !step.controls.length ||
        !step.monitoring.what ||
        !step.monitoring.how ||
        !step.monitoring.when ||
        !step.monitoring.who ||
        !step.correctiveActions.length
    )

    if (invalidSteps.length > 0) {
      setError('All HACCP control points must be completely filled out')
      return false
    }

    return true
  }

  const toggleItem = (category: string, item: string) => {
    setSelectedItems((prev) => {
      const newItems = { ...prev }
      if (!newItems[category]) {
        newItems[category] = []
      }
      if (newItems[category].includes(item)) {
        newItems[category] = newItems[category].filter((i) => i !== item)
      } else {
        newItems[category] = [...newItems[category], item]
      }
      return newItems
    })
  }

  const removeItem = (category: string, item: string) => {
    setSelectedItems((prev) => {
      const newItems = { ...prev }
      newItems[category] = newItems[category].filter((i) => i !== item)
      return newItems
    })
  }

  return (
    <BaseStep
      title='HACCP Plan'
      description='Define critical control points and food safety measures.'
      onChange={onChange}
      onNext={() => validateHaccpPlan() && onNext()}
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
          <div className='flex items-center space-x-2 text-red-600'>
            <IconAlertTriangle className='w-5 h-5' />
            <span className='text-sm font-semibold'>
              Ensure all critical control points are properly documented
            </span>
          </div>
          <button
            onClick={toggleInfo}
            className='flex items-center space-x-2 px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white active:bg-red-600 active:border-white transition-colors duration-200'
          >
            <IconInfo className='w-4 h-4' />
            <span>HACCP Info</span>
          </button>
        </div>

        {showInfo && (
          <div className='p-4 bg-github-canvas-inset rounded-md space-y-4 border border-red-600'>
            <div className='p-4 bg-github-canvas-inset rounded-md border border-gray-300'>
              <h4 className='text-md font-semibold mb-1'>Codex Alimentarius Guidelines</h4>
              <ul className='list-disc pl-5 mb-2'>
                <li>
                  Codex Alimentarius Commission: The Codex Alimentarius Commission has published a
                  key document titled “General Principles of Food Hygiene” (CXC 1-1969) which
                  includes the Annex on HACCP.
                </li>
                <li>
                  7 Principles of HACCP: The Codex sets forth the classical 7 principles, which form
                  the foundation for many national regulations.
                </li>
              </ul>
            </div>
            <div className='p-4 bg-github-canvas-inset rounded-md border border-gray-300'>
              <h4 className='text-md font-semibold mb-1'>United States Regulations</h4>
              <ul className='list-disc pl-5 mb-2'>
                <li>
                  FDA (Food and Drug Administration): FSMA mandates a “preventive controls” approach
                  that parallels HACCP, requiring food facilities to develop and implement food
                  safety plans.
                </li>
                <li>
                  USDA (United States Department of Agriculture): FSIS enforces HACCP for meat,
                  poultry, and egg processors.
                </li>
              </ul>
            </div>
            <div className='p-4 bg-github-canvas-inset rounded-md border border-gray-300'>
              <h4 className='text-md font-semibold mb-1'>European Union Regulations</h4>
              <ul className='list-disc pl-5 mb-2'>
                <li>
                  Regulation (EC) No 852/2004: Lays out general hygiene requirements for all food
                  business operators in the EU.
                </li>
                <li>
                  Regulation (EC) No 853/2004: Provides specific hygiene rules for foods of animal
                  origin.
                </li>
              </ul>
            </div>
            <div className='p-4 bg-github-canvas-inset rounded-md border border-gray-300'>
              <h4 className='text-md font-semibold mb-1'>Other International Standards</h4>
              <ul className='list-disc pl-5 mb-2'>
                <li>
                  ISO 22000: Integrates HACCP principles with a broader food safety management
                  framework.
                </li>
                <li>
                  GFSI Recognized Schemes: Schemes like BRC, FSSC 22000, SQF, and IFS incorporate
                  HACCP principles.
                </li>
              </ul>
            </div>
            <div className='p-4 bg-github-canvas-inset rounded-md border border-gray-300'>
              <h4 className='text-md font-semibold mb-1'>
                Key Elements in Current HACCP/FSMS Requirements
              </h4>
              <ul className='list-disc pl-5 mb-2'>
                <li>
                  <strong>Documented Hazard Analysis:</strong> Food businesses are required to
                  systematically identify potential hazards (biological, chemical, and physical).
                </li>
                <li>
                  <strong>Identification of Critical Control Points (CCPs):</strong> Businesses must
                  pinpoint where in the process hazards can be effectively prevented or reduced.
                </li>
                <li>
                  <strong>Establishment of Critical Limits:</strong> Measurable criteria for each
                  CCP (e.g., temperature, time, pH, etc.).
                </li>
                <li>
                  <strong>Monitoring Procedures:</strong> Ongoing checks (e.g., temperature logs) to
                  ensure CCPs remain within critical limits.
                </li>
                <li>
                  <strong>Corrective Actions:</strong> Clear steps to take if monitoring shows a
                  deviation from critical limits.
                </li>
                <li>
                  <strong>Record-Keeping:</strong> Detailed documentation to demonstrate compliance
                  with HACCP/food safety plans.
                </li>
                <li>
                  <strong>Verification Activities:</strong> Periodic reviews (internal audits,
                  testing) to ensure the HACCP system is functioning as intended.
                </li>
              </ul>
            </div>
            <div className='p-4 bg-github-canvas-inset rounded-md border border-gray-300'>
              <h4 className='text-md font-semibold mb-1'>Enforcement and Compliance</h4>
              <ul className='list-disc pl-5 mb-2'>
                <li>Inspections and Audits</li>
                <li>Penalties and Recalls</li>
                <li>Continuous Improvement</li>
              </ul>
            </div>
          </div>
        )}

        <button
          onClick={addHaccpStep}
          disabled={isLoading}
          className='flex items-center space-x-2 px-4 py-2 bg-github-success-emphasis text-white rounded-md disabled:opacity-50'
        >
          {isLoading ? (
            <IconLoader className='w-4 h-4 animate-spin' />
          ) : (
            <IconPlus className='w-4 h-4' />
          )}
          <span>Add Control Point</span>
        </button>

        <div className='flex flex-col lg:flex-row lg:space-x-4'>
          <div className='flex-1 min-w-0'>
            <h3 className='text-lg font-semibold mb-2'>Select Categories:</h3>
            <div className='h-100 overflow-y-auto space-y-2 mb-4 border-2 border-gray-300 dark:border-gray-600 p-2'>
              {Object.keys(categories).map((category) => (
                <div key={category}>
                  <button
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-2 py-1 rounded-md transition-colors border-2 border-dashed truncate ${
                      activeCategory === category
                        ? 'bg-blue-600 text-white border-blue-800'
                        : 'bg-gray-100 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600'
                    } hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400`}
                  >
                    {category}
                  </button>
                  {activeCategory === category && (
                    <div className='pl-4'>
                      {categories[category].map((subCategory) => (
                        <button
                          key={subCategory}
                          onClick={() => toggleItem(category, subCategory)}
                          className={`w-full text-left px-2 py-1 rounded-md transition-colors border-2 border-dashed truncate ${
                            selectedItems[category]?.includes(subCategory)
                              ? 'bg-blue-500 text-white border-blue-800'
                              : 'bg-gray-100 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600'
                          } hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400`}
                        >
                          {subCategory}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className='flex-1 min-w-0 mt-4 lg:mt-0'>
            <h3 className='text-lg font-semibold mb-2'>Selected Control Points:</h3>
            {Object.keys(selectedItems).map((category) => (
              <div key={category}>
                <h4 className='font-semibold'>{category}</h4>
                <ul className='flex flex-wrap'>
                  {selectedItems[category].map((item) => (
                    <li
                      key={item}
                      className='flex items-center p-1 border rounded-md m-1 bg-blue-500 text-white'
                    >
                      {item}
                      <IconX
                        onClick={() => removeItem(category, item)}
                        className='ml-2 text-red-500 cursor-pointer hover:text-red-700'
                        style={{ width: '16px', height: '16px' }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseStep>
  )
}
