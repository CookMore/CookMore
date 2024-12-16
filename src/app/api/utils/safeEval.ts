// Helper for safe timeouts
export const safeSetTimeout = (callback: () => void, delay: number) => {
  return setTimeout(callback, delay)
}

// Helper for safe intervals
export const safeSetInterval = (callback: () => void, delay: number) => {
  return setInterval(callback, delay)
}

// Replace any eval() with proper function calls
export const safeEval = <T>(fn: () => T): T => {
  return fn()
}
