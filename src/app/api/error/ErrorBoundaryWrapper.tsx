'use client'

import React, { Component, ErrorInfo } from 'react'
import { cn } from '@/app/api/utils/utils'

interface Props {
  children: React.ReactNode
  name?: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundaryWrapper extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Filter out hydration errors
    if (error.message.includes('Hydration')) {
      console.warn('Hydration error caught:', error)
      return
    }

    // Simple error logging without any translation dependencies
    console.error('ErrorBoundary caught an error:', error)
    this.props.onError?.(error, errorInfo)
  }

  private resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      // Don't show error UI for hydration errors
      if (this.state.error?.message.includes('Hydration')) {
        return this.props.children
      }

      return (
        <div
          className={cn(
            'p-6 rounded-lg',
            'bg-github-canvas-subtle border border-github-border-default',
            'text-github-fg-default'
          )}
        >
          <div className='flex flex-col items-center text-center'>
            <svg
              className='w-12 h-12 text-github-danger-fg mb-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>

            <h2 className='text-xl font-semibold mb-2'>
              An error occurred in {this.props.name || 'this component'}.
            </h2>

            <p className='text-github-fg-muted mb-4'>
              We've encountered an error and are working to fix it.
            </p>

            <button
              className={cn(
                'px-4 py-2 rounded-md transition-colors',
                'bg-github-danger-emphasis text-white',
                'hover:bg-github-danger-emphasis/90',
                'focus:outline-none focus:ring-2 focus:ring-github-danger-emphasis/30'
              )}
              onClick={this.resetError}
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
