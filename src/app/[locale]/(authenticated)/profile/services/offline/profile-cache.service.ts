'use client'

import { openDB, type IDBPDatabase } from 'idb'
import type { Profile, ProfileMetadata } from '../../profile'

interface ProfileDB {
  profiles: {
    key: string
    value: Profile
  }
  metadata: {
    key: string
    value: ProfileMetadata
  }
}

const DB_NAME = 'profile_cache'
const DB_VERSION = 1

class ProfileCacheService {
  private db: IDBPDatabase<ProfileDB> | null = null

  private async initDB() {
    // Only initialize IndexedDB on the client side
    if (typeof window === 'undefined') return null

    return openDB<ProfileDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create stores if they don't exist
        if (!db.objectStoreNames.contains('profiles')) {
          db.createObjectStore('profiles')
        }
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata')
        }
      },
    })
  }

  private async getDB() {
    if (!this.db) {
      this.db = await this.initDB()
    }
    return this.db
  }

  async cacheProfile(address: string, profile: Profile) {
    const db = await this.getDB()
    if (!db) return

    // Add timestamp to cache
    const cacheEntry = {
      ...profile,
      cachedAt: Date.now(),
    }

    await db.put('profiles', cacheEntry, address)
  }

  async getCachedProfile(address: string): Promise<Profile | null> {
    const db = await this.getDB()
    if (!db) return null

    const cached = await db.get('profiles', address)
    if (!cached) return null

    // Invalidate cache after 5 minutes
    if (Date.now() - cached.cachedAt > 5 * 60 * 1000) {
      await this.clearCache()
      return null
    }

    return cached
  }

  async cacheMetadata(address: string, metadata: ProfileMetadata) {
    const db = await this.getDB()
    if (!db) return
    await db.put('metadata', metadata, address)
  }

  async getCachedMetadata(address: string): Promise<ProfileMetadata | null> {
    const db = await this.getDB()
    if (!db) return null
    return db.get('metadata', address)
  }

  async clearCache() {
    const db = await this.getDB()
    if (!db) return
    await db.clear('profiles')
    await db.clear('metadata')
  }
}

export const profileCacheService = new ProfileCacheService()
