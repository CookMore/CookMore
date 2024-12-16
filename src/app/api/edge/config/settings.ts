import { EDGE_CONFIG } from './constants'

export const EDGE_CACHE_KEYS = {
  PROFILE: (address: string) => `profile:${address}`,
  KITCHEN: (recipeId: string) => `kitchen:${recipeId}`,
  COLLECTION: (userId: string) => `collection:${userId}`,
} as const

export const EDGE_TTL = {
  PROFILE: 60 * 5, // 5 minutes
  KITCHEN: 60 * 15, // 15 minutes
  COLLECTION: 60 * 5, // 5 minutes
} as const

export const EDGE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
} as const

export const edgeSettings = {
  cache: {
    maxSize: EDGE_CONFIG.MAX_CACHE_SIZE,
    maxItems: EDGE_CONFIG.MAX_CACHE_ITEMS,
  },
  rateLimit: {
    maxRequests: EDGE_CONFIG.MAX_REQUESTS_PER_IP,
    window: EDGE_CONFIG.RATE_LIMIT_WINDOW,
  },
  headers: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    'CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  },
}

export type EdgeSettings = typeof edgeSettings
