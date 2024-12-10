module.exports = {
  locales: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi'],
  defaultLocale: 'en',
  messages: {
    // Load messages synchronously for server components
    loadMessages: async (locale) => {
      try {
        return (await import(`./src/messages/${locale}/common.json`)).default
      } catch (error) {
        console.error(`Failed to load messages for locale ${locale}:`, error)
        // Fallback to English messages
        return (await import('./src/messages/en/common.json')).default
      }
    },
  },
}
