import { EDGE_CONFIG } from './constants'

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
  }
}

export type EdgeSettings = typeof edgeSettings
