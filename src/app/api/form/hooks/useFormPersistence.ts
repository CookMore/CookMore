import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'

export function useFormPersistence<T>(form: UseFormReturn<T>, key: string, initialData?: T) {
  useEffect(() => {
    // Load saved data on mount
    const savedData = localStorage.getItem(key)
    if (savedData && !initialData) {
      form.reset(JSON.parse(savedData))
    }

    // Save form data on changes
    const subscription = form.watch((value) => {
      if (form.formState.isDirty) {
        localStorage.setItem(key, JSON.stringify(value))
      }
    })

    return () => subscription.unsubscribe()
  }, [form, key, initialData])

  // Clear saved data
  const clearSavedData = () => {
    localStorage.removeItem(key)
  }

  return { clearSavedData }
}
