const COOKIE_KEY = 'clever_training_progress'
const EXPIRY_DAYS = 30

export function saveProgress(state) {
  try {
    const value = JSON.stringify(state)
    const expires = new Date()
    expires.setDate(expires.getDate() + EXPIRY_DAYS)
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  } catch (e) {
    // silently fail if cookies are blocked
  }
}

export function loadProgress() {
  try {
    const match = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${COOKIE_KEY}=`))
    if (!match) return null
    return JSON.parse(decodeURIComponent(match.split('=').slice(1).join('=')))
  } catch (e) {
    return null
  }
}

export function clearProgress() {
  document.cookie = `${COOKIE_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}
