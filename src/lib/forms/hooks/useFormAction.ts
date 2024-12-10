'use client'

import { useOptimistic } from 'react'

type ActionState = {
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string | null
}

export function useFormAction(
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>,
  initialState: ActionState
) {
  const [state, setState] = useOptimistic<ActionState>(initialState)

  const formAction = async (formData: FormData) => {
    setState((prev) => ({ ...prev, status: 'loading' }))
    try {
      const result = await action(state, formData)
      setState(result)
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
      })
    }
  }

  return [state, formAction] as const
}

export type { ActionState }
