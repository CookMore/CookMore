export const setCookie = (name: string, value: string, days = 7) => {
  const cookie = [
    `${name}=${value}`,
    'SameSite=Strict',
    'Secure',
    'Path=/',
    days && `Max-Age=${days * 24 * 60 * 60}`,
  ]
    .filter(Boolean)
    .join('; ')

  document.cookie = cookie
}

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift()
  }
}
