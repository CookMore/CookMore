import { edgeHeaders } from '../edge/config'

export class EdgeCache {
  private static getKeyUrl(key: string) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'
    return `${origin}/${key}`
  }

  static async get(key: string) {
    const cache = await caches.open('v1')
    const response = await cache.match(this.getKeyUrl(key))
    return response ? response.json() : null
  }

  static async set(key: string, data: any) {
    const cache = await caches.open('v1')
    await cache.put(
      this.getKeyUrl(key),
      new Response(JSON.stringify(data), {
        headers: edgeHeaders,
      })
    )
  }

  static async delete(key: string) {
    const cache = await caches.open('v1')
    await cache.delete(this.getKeyUrl(key))
  }
}
