'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import dynamic from 'next/dynamic'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <DevTools />}
    </QueryClientProvider>
  )
}

// Dynamically import DevTools only in development
const DevTools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then((mod) => ({
      default: () => <mod.ReactQueryDevtools initialIsOpen={false} />,
    })),
  { ssr: false }
)
