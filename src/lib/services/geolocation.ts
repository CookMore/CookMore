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

export async function detectUserLocale(): Promise<string | null> {
  try {
    // Check if we already have a stored preference
    const storedLocale = localStorage.getItem('preferred_locale')
    if (storedLocale) {
      return storedLocale
    }

    // If no stored preference, detect based on IP
    const response = await fetch('https://ipapi.co/json/')
    const data: GeoResponse = await response.json()

    // Get suggested locale based on country code
    const suggestedLocale = countryToLocale[data.country_code] || 'en'

    // Store the suggestion
    localStorage.setItem('detected_locale', suggestedLocale)

    return suggestedLocale
  } catch (error) {
    console.error('Failed to detect user locale:', error)
    return null
  }
}
