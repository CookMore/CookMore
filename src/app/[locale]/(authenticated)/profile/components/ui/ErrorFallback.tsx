'use client'

interface ErrorFallbackProps {
  title: string
  message: string
  buttonText?: string
}

export function ErrorFallback({ title, message, buttonText = 'Try Again' }: ErrorFallbackProps) {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='rounded-lg bg-white p-8 shadow-lg'>
        <h2 className='mb-4 text-xl font-semibold'>{title}</h2>
        <p className='mb-4 text-gray-600'>{message}</p>
        <button
          onClick={() => window.location.reload()}
          className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}
