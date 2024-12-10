import { EdgeCache } from '@/lib/cache/edge'
import { edgeSettings } from '../config/settings'
import { EDGE_CACHE_TTL } from '../config/constants'

export interface EdgeServiceOptions {
  cache?: boolean
  ttl?: number
  headers?: Record<string, string>
}

export abstract class BaseEdgeService {
  protected cache: typeof EdgeCache
  protected settings: typeof edgeSettings
  protected ttl: typeof EDGE_CACHE_TTL

  constructor() {
    this.cache = EdgeCache
    this.settings = edgeSettings
    this.ttl = EDGE_CACHE_TTL
  }

  protected async withCache<T>(
    key: string,
    fn: () => Promise<T>,
    options: EdgeServiceOptions = {}
  ): Promise<T> {
    const { cache = true, ttl = this.ttl.STATIC } = options

    if (!cache) return fn()

    const cached = await this.cache.get<T>(key)
    if (cached) return cached

    const data = await fn()
    await this.cache.set(key, data, ttl)
    return data
  }

  protected getHeaders(options: EdgeServiceOptions = {}): HeadersInit {
    return {
      ...this.settings.headers,
      ...options.headers,
    }
  }
}
