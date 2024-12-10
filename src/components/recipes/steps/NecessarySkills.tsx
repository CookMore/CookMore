'use client'

import { useState } from 'react'
import { useSkills } from '@/app/(authenticated)/kitchen/hooks/useSkills'
import { useRecipePreview } from '@/hooks/useRecipePreview'
import { BaseStep } from './BaseStep'
import { RecipeData, Skills } from '@/types/recipe'
import { IconPlus, IconX, IconAlertCircle } from '@/components/ui/icons'
import { StepComponentProps } from './index'

export function NecessarySkills({ data, onChange, onNext, onBack }: StepComponentProps) {
  const { updateSkills } = useSkills()
  const { updatePreview } = useRecipePreview()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const addSkill = async (category: keyof Skills, value: string) => {
    if (!value.trim()) return
    setError('')
    setIsLoading(true)

    const currentSkills: Skills = data.skills || {
      required: [],
      recommended: [],
      certifications: [],
      training: [],
    }

    const updates = {
      skills: {
        ...currentSkills,
        [category]: [...(currentSkills[category] || []), value.trim()],
      },
    }

    try {
      onChange(updates)
      await updatePreview('skills', updates)

      if (data.id) {
        await updateSkills(data.id, updates.skills, category)
      }
    } catch (err) {
      setError(`Failed to add ${category} skill`)
      // Rollback changes if contract update fails
      onChange({ skills: currentSkills })
    } finally {
      setIsLoading(false)
    }
  }

  const removeSkill = async (category: keyof Skills, index: number) => {
    if (!data.skills) return
    setError('')
    setIsLoading(true)

    const currentSkills = { ...data.skills }
    const current = currentSkills[category] || []

    if (Array.isArray(current)) {
      const updates = {
        skills: {
          ...currentSkills,
          [category]: current.filter((_, i) => i !== index),
        },
      }

      try {
        onChange(updates)
        await updatePreview('skills', updates)

        if (data.id) {
          await updateSkills(data.id, updates.skills, category)
        }
      } catch (err) {
        setError(`Failed to remove ${category} skill`)
        // Rollback changes if contract update fails
        onChange({ skills: currentSkills })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const validateSkills = () => {
    if (!data.skills?.required?.length) {
      setError('At least one required skill is needed')
      return false
    }
    return true
  }

  return (
    <BaseStep
      title='Necessary Skills & Training'
      description='Define the skills and qualifications needed to successfully execute this recipe.'
      data={data}
      onChange={onChange}
      onNext={() => validateSkills() && onNext()}
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
        {/* Required Skills */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>
            Required Skills
            <span className='text-github-danger-fg ml-1'>*</span>
          </h3>
          <div className='space-y-2'>
            <input
              type='text'
              placeholder='Add a required skill'
              className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default 
                       rounded-md focus:ring-2 focus:ring-github-accent-emphasis'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addSkill('required', e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
              disabled={isLoading}
            />
            <div className='flex flex-wrap gap-2'>
              {data.skills?.required?.map((skill, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-2 px-2 py-1 bg-github-canvas-subtle rounded-md'
                >
                  <span className='text-sm'>{skill}</span>
                  <button onClick={() => removeSkill('required', index)}>
                    <IconX className='w-4 h-4 text-github-fg-muted hover:text-github-danger-fg' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Skills */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>Recommended Skills</h3>
          <div className='space-y-2'>
            <input
              type='text'
              placeholder='Add a recommended skill'
              className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addSkill('recommended', e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
            />
            <div className='flex flex-wrap gap-2'>
              {data.skills?.recommended?.map((skill, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-2 px-2 py-1 bg-github-canvas-subtle rounded-md'
                >
                  <span className='text-sm'>{skill}</span>
                  <button onClick={() => removeSkill('recommended', index)}>
                    <IconX className='w-4 h-4 text-github-fg-muted hover:text-github-danger-fg' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>Required Certifications</h3>
          <div className='space-y-2'>
            <input
              type='text'
              placeholder='Add required certification'
              className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addSkill('certifications', e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
            />
            <div className='flex flex-wrap gap-2'>
              {data.skills?.certifications?.map((cert, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-2 px-2 py-1 bg-github-canvas-subtle rounded-md'
                >
                  <span className='text-sm'>{cert}</span>
                  <button onClick={() => removeSkill('certifications', index)}>
                    <IconX className='w-4 h-4 text-github-fg-muted hover:text-github-danger-fg' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Training Requirements */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>Training Requirements</h3>
          <div className='space-y-2'>
            <input
              type='text'
              placeholder='Add training requirement'
              className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addSkill('training', e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
            />
            <div className='flex flex-wrap gap-2'>
              {data.skills?.training?.map((training, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-2 px-2 py-1 bg-github-canvas-subtle rounded-md'
                >
                  <span className='text-sm'>{training}</span>
                  <button onClick={() => removeSkill('training', index)}>
                    <IconX className='w-4 h-4 text-github-fg-muted hover:text-github-danger-fg' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseStep>
  )
}
