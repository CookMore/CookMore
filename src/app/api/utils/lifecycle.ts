export const handlePageHide = (callback: () => void) => {
  // Use 'pagehide' instead of 'unload'
  window.addEventListener('pagehide', callback)

  // Cleanup
  return () => window.removeEventListener('pagehide', callback)
}

export const handleVisibilityChange = (callback: () => void) => {
  const handler = () => {
    if (document.visibilityState === 'hidden') {
      callback()
    }
  }

  document.addEventListener('visibilitychange', handler)

  // Cleanup
  return () => document.removeEventListener('visibilitychange', handler)
}
