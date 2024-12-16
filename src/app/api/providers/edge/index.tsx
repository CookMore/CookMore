export * from './BaseEdgeProvider'
export * from './ProfileEdgeProvider'
export * from './KitchenEdgeProvider'

// Combined provider for apps that need both Profile and Kitchen
import React from 'react'
import { BaseEdgeProvider } from './BaseEdgeProvider'
import { ProfileEdgeProvider } from './ProfileEdgeProvider'
import { KitchenEdgeProvider } from './KitchenEdgeProvider'
import type { EdgeServiceOptions } from '@/app/api/services/types'

interface CombinedEdgeProviderProps {
  children: React.ReactNode
  address?: string
  recipeId?: string
  userId?: string
  initialOptions?: EdgeServiceOptions
}

export function CombinedEdgeProvider({
  children,
  address,
  recipeId,
  userId,
  initialOptions = {},
}: CombinedEdgeProviderProps) {
  return (
    <BaseEdgeProvider initialOptions={initialOptions}>
      {address && (
        <ProfileEdgeProvider address={address}>
          {recipeId || userId ? (
            <KitchenEdgeProvider recipeId={recipeId} userId={userId}>
              {children}
            </KitchenEdgeProvider>
          ) : (
            children
          )}
        </ProfileEdgeProvider>
      )}
      {!address && (recipeId || userId) && (
        <KitchenEdgeProvider recipeId={recipeId} userId={userId}>
          {children}
        </KitchenEdgeProvider>
      )}
      {!address && !recipeId && !userId && children}
    </BaseEdgeProvider>
  )
}
