const DEBUG = process.env.NEXT_PUBLIC_DEBUG === 'true'

export const debugLog = {
  auth: (message: string, data?: any) => {
    if (DEBUG) console.log(`🔐 Auth: ${message}`, data)
  },
  profile: (message: string, data?: any) => {
    if (DEBUG) console.log(`👤 Profile: ${message}`, data)
  },
  tiers: (message: string, data?: any) => {
    if (DEBUG) console.log(`🏷️ Tiers: ${message}`, data)
  },
  form: (message: string, data?: any) => {
    if (DEBUG) console.log(`📝 Form: ${message}`, data)
  },
  error: (message: string, error: any) => {
    if (DEBUG) console.error(`❌ Error: ${message}`, error)
  },
}
