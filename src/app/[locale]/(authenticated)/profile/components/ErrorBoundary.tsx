'use client'

import { Component, type ReactNode } from 'react'
import { toast } from 'sonner'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ProfileErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    // Log error to your error reporting service
    console.error('Profile Error:', error)
    toast.error('An error occurred while loading the profile')
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className='p-4 rounded-lg bg-red-50 dark:bg-red-900/20'>
          <h3 className='text-lg font-semibold text-red-800 dark:text-red-200'>
            Something went wrong
          </h3>
          <p className='mt-2 text-sm text-red-700 dark:text-red-300'>
            {this.state.error?.message || 'An error occurred while loading the profile'}
          </p>
          <button
            onClick={this.resetError}
            className='mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:hover:bg-red-700'
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
