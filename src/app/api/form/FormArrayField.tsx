'use client'

import { useFieldArray, Control, FieldValues, ArrayPath } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { IconPlus, IconTrash } from '@/app/api/icons'

interface FormArrayFieldProps<T extends FieldValues, K extends ArrayPath<T>> {
  name: K
  control: Control<T>
  label: string
  renderField: (field: any, index: number) => React.ReactNode
  emptyValue: any
  maxItems?: number
}

export function FormArrayField<T extends FieldValues, K extends ArrayPath<T>>({
  name,
  control,
  label,
  renderField,
  emptyValue,
  maxItems,
}: FormArrayFieldProps<T, K>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h4 className='text-sm font-medium'>{label}</h4>
        {(!maxItems || fields.length < maxItems) && (
          <button
            type='button'
            onClick={() => append(emptyValue)}
            className='text-github-accent-fg hover:text-github-accent-emphasis'
          >
            <IconPlus className='w-5 h-5' />
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
              <div className='flex-1'>{renderField(field, index)}</div>
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
