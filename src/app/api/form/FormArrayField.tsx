'use client'

import { useFieldArray, Control, FieldValues, ArrayPath } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { IconPlus, IconTrash } from '@/app/api/icons'

interface FormArrayFieldProps<T extends FieldValues, K extends ArrayPath<T>> {
  name: K
  control: Control<T>
  label: string
  render: (props: { field: any; index: number }) => React.ReactNode
  emptyValue?: any
  maxItems?: number
  addButtonText?: string
  validate?: (value: any) => true | string
}

export function FormArrayField<T extends FieldValues, K extends ArrayPath<T>>({
  name,
  control,
  label,
  render,
  emptyValue = {},
  maxItems,
  addButtonText = 'Add Item',
  validate,
}: FormArrayFieldProps<T, K>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    rules: validate ? { validate } : undefined,
  })

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h4 className='text-sm font-medium'>{label}</h4>
        {(!maxItems || fields.length < maxItems) && (
          <button
            type='button'
            onClick={() => append(emptyValue)}
            className='text-github-accent-fg hover:text-github-accent-emphasis flex items-center gap-1.5'
          >
            <IconPlus className='w-5 h-5' />
            <span className='text-sm'>{addButtonText}</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='relative'
          >
            <div className='flex gap-2 items-start'>
              <div className='flex-1'>{render({ field, index })}</div>
              <button
                type='button'
                onClick={() => remove(index)}
                className='text-github-danger-fg hover:text-github-danger-emphasis mt-8'
              >
                <IconTrash className='w-5 h-5' />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
