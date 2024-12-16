'use client'

import type { EdgeServiceConfig, EdgeServiceOptions, ServiceResponse } from './types'

export class BaseEdgeService {
  protected config: EdgeServiceConfig

  constructor(config: EdgeServiceConfig = {}) {
    this.config = {
      baseUrl: '',
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    }
  }

  protected getHeaders(options?: EdgeServiceOptions): HeadersInit {
    return {
      ...this.config.headers,
      ...options?.headers,
    }
  }

  protected handleError(error: unknown): never {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unknown error occurred')
  }

  protected async handleResponse<T>(response: Response): Promise<ServiceResponse<T>> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }))
      return {
        success: false,
        data: null,
        error: error.message || `HTTP error! status: ${response.status}`,
      }
    }
    const data = await response.json()
    return {
      success: true,
      data,
    }
  }
}

export type { EdgeServiceConfig, EdgeServiceOptions, ServiceResponse }
