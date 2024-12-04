import { Redis } from '@upstash/redis'
import { ProfileTier } from '@/types/profile'
import { TIER_LIMITS } from './ai-service'

export class RateLimiter {
  private redis: Redis

  async isAllowed(userId: string, tier: ProfileTier): Promise<boolean> {
    const key = `rate_limit:${userId}`
    const count = await this.redis.incr(key)

    if (count === 1) {
      await this.redis.expire(key, 24 * 60 * 60) // 24 hours
    }

    return count <= TIER_LIMITS[tier].requestsPerDay
  }
}
