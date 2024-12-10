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
  MAX_REQUESTS_PER_IP: 100,
  RATE_LIMIT_WINDOW: 60 * 60, // 1 hour
  MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_CACHE_ITEMS: 1000,
}
