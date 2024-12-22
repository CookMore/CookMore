import { RateLimiter } from './rate-limit'
import { ProfileApiService } from '@/app/api/edge/services'

export const rateLimitService = new RateLimiter()
export const profileEdgeService = new ProfileApiService()

// Re-export other services
export * from './kitchen'
export * from './ipfs-service'
export * from './openai'
export * from './avatar'
