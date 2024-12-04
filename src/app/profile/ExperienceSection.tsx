'use client'

import { Control, Controller, FieldErrors, useFieldArray } from 'react-hook-form'
import type { ProProfileMetadata, GroupProfileMetadata } from '@/types/profile'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormInput } from '@/components/ui/form/FormInput'
import { FormDateInput } from '@/components/ui/form/FormDateInput'
import { FormTextarea } from '@/components/ui/form/FormTextarea'
import { IconBriefcase } from '@/components/ui/icons'

type ProfileFormData = ProProfileMetadata | GroupProfileMetadata

interface ExperienceSectionProps {
  control: Control<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
}

export default function ExperienceSection({ control, errors }: ExperienceSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience.history',
  })

  return (
    <FormSection
      title='Professional Experience'
      icon={<IconBriefcase />}
      description='Your culinary career history'
    >
      <div className='space-y-6'>
        {/* Current Position */}
        <div className='space-y-4'>
          <h4 className='text-sm font-medium'>Current Position</h4>
          <Controller
            name='experience.current.role'
            control={control}
            render={({ field }) => (
              <FormInput
                label='Role'
                error={errors.experience?.current?.role?.message}
                {...field}
              />
            )}
          />

          <Controller
            name='experience.current.company'
            control={control}
            render={({ field }) => (
              <FormInput
                label='Company'
                error={errors.experience?.current?.company?.message}
                {...field}
              />
            )}
          />

          <div className='grid grid-cols-2 gap-4'>
            <Controller
              name='experience.current.startDate'
              control={control}
              render={({ field }) => (
                <FormDateInput
                  label='Start Date'
                  error={errors.experience?.current?.startDate?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name='experience.current.endDate'
              control={control}
              render={({ field }) => (
                <FormDateInput
                  label='End Date'
                  optional
                  error={errors.experience?.current?.endDate?.message}
                  {...field}
                />
              )}
            />
          </div>

          <Controller
            name='experience.current.description'
            control={control}
            render={({ field }) => (
              <FormTextarea
                label='Description'
                optional
                error={errors.experience?.current?.description?.message}
                {...field}
              />
            )}
          />
        </div>

        {/* Work History */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h4 className='text-sm font-medium'>Work History</h4>
            <button
              type='button'
              onClick={() =>
                append({
                  role: '',
                  company: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                })
              }
              className='text-sm text-github-accent-fg hover:text-github-accent-emphasis'
            >
              Add Experience
            </button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className='space-y-4 p-4 border border-github-border-default rounded-md'
            >
              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={() => remove(index)}
                  className='text-sm text-github-danger-fg hover:text-github-danger-emphasis'
                >
                  Remove
                </button>
              </div>

              <Controller
                name={`experience.history.${index}.role`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    label='Role'
                    error={errors.experience?.history?.[index]?.role?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name={`experience.history.${index}.company`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    label='Company'
                    error={errors.experience?.history?.[index]?.company?.message}
                    {...field}
                  />
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <Controller
                  name={`experience.history.${index}.startDate`}
                  control={control}
                  render={({ field }) => (
                    <FormDateInput
                      label='Start Date'
                      error={errors.experience?.history?.[index]?.startDate?.message}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name={`experience.history.${index}.endDate`}
                  control={control}
                  render={({ field }) => (
                    <FormDateInput
                      label='End Date'
                      error={errors.experience?.history?.[index]?.endDate?.message}
                      {...field}
                    />
                  )}
                />
              </div>

              <Controller
                name={`experience.history.${index}.description`}
                control={control}
                render={({ field }) => (
                  <FormTextarea
                    label='Description'
                    optional
                    error={errors.experience?.history?.[index]?.description?.message}
                    {...field}
                  />
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </FormSection>
  )
}
