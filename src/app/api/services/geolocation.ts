interface GeoResponse {
  country_code: string
  country_name: string
  languages: string
}

const countryToLocale: { [key: string]: string } = {
  // European countries
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  IT: 'it',
  PT: 'pt',
  RU: 'ru',
  // Asian countries
  CN: 'zh',
  TW: 'zh',
  HK: 'zh',
  JP: 'ja',
  KR: 'ko',
  // Middle Eastern countries
  SA: 'ar',
  AE: 'ar',
  EG: 'ar',
  // Indian subcontinent
  IN: 'hi',
}

const FALLBACK_SERVICES = [
  'https://api.ipapi.is/json/', // Free tier, no CORS issues
  'https://api.ipregistry.co/?key=tryout', // Free tier with CORS support
  'https://api.db-ip.com/v2/free/self', // Free tier, CORS enabled
]

const DEFAULT_TIMEOUT = 5000 // 5 seconds

async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      mode: 'cors',
      headers: {
        Accept: 'application/json',
      },
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

export async function detectUserLocale(): Promise<string | null> {
  try {
    // Check if we already have a stored preference
    if (typeof window !== 'undefined') {
      const storedLocale = localStorage.getItem('preferred_locale')
      if (storedLocale) {
        return storedLocale
      }

      // Try navigator.language first as it's most reliable
      const browserLocale = navigator.language?.split('-')[0]
      if (browserLocale && countryToLocale[browserLocale.toUpperCase()]) {
        return countryToLocale[browserLocale.toUpperCase()]
      }
    }

    // Try each service in sequence until one works
    for (const serviceUrl of FALLBACK_SERVICES) {
      try {
        const response = await fetchWithTimeout(serviceUrl, DEFAULT_TIMEOUT)
        if (!response.ok) {
          if (response.status === 429) {
            // Rate limited, try next service
            continue
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: GeoResponse = await response.json()
        if (!data?.country_code) continue

        // Get suggested locale based on country code
        const suggestedLocale = countryToLocale[data.country_code] || 'en'

        // Store the suggestion if in browser
        if (typeof window !== 'undefined') {
          localStorage.setItem('detected_locale', suggestedLocale)
        }

        return suggestedLocale
      } catch (error) {
        console.warn(`Failed to fetch from ${serviceUrl}:`, error)
        continue // Try next service
      }
    }

    // If all services fail, return default
    console.warn('All geolocation services failed, defaulting to en')
    return 'en'
  } catch (error) {
    console.error('Failed to detect user locale:', error)
    return 'en' // Default to English on error
  }
}
