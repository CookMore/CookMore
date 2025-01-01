export const EDGE_CACHE_TTL = {
  PROFILE: 60 * 5, // 5 minutes
  KITCHEN: 60 * 15, // 15 minutes
  STATIC: 60 * 60 * 24, // 24 hours
}

export const EDGE_CACHE_KEYS = {
  PROFILE: (address: string) => `profile:${address}`,
  KITCHEN: (recipeId: string) => `kitchen:${recipeId}`,
  COLLECTION: (userId: string) => `collection:${userId}`,
}

export const EDGE_CONFIG = {
  API_VERSION: 'v1',
  BASE_URL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}:${process.env.NEXT_PUBLIC_API_PORT || '3000'}`,
  ENDPOINTS: {
    PROFILE: '/api/profile',
    KITCHEN: '/api/kitchen',
  },
} as const

export const EDGE_CACHE_CONFIG = {
  VERSION: 'v1',
  MAX_AGE: 60 * 60 * 24, // 24 hours
  STALE_WHILE_REVALIDATE: 60 * 5, // 5 minutes
} as const
