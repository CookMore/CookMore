export interface EdgeServiceOptions {
  skipCache?: boolean
  revalidate?: boolean
  headers?: HeadersInit
}

export interface ServiceResponse<T> {
  success: boolean
  data: T | null
  error?: string
}

export interface EdgeServiceConfig {
  baseUrl?: string
  headers?: HeadersInit
  options?: EdgeServiceOptions
}
