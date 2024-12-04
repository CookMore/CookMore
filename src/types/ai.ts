import { ProfileTier } from './profile'

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  metadata?: {
    tier: ProfileTier
    recipeId?: string
    functionCall?: string
  }
}

export interface AIFunctionCall {
  name: string
  arguments: Record<string, any>
  tier: ProfileTier
}

export interface AIStreamResponse {
  id: string
  choices: {
    delta: {
      content?: string
      role?: string
      functionCall?: AIFunctionCall
    }
    finishReason: string | null
  }[]
}
