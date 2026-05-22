const STORAGE_KEY = 'omni-lingua-theme'

export type Theme = 'light' | 'dark'

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (saved === 'light' || saved === 'dark') return saved
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export function setTheme(t: Theme) {
  localStorage.setItem(STORAGE_KEY, t)
  applyTheme(t)
}

export function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === 'light' ? 'dark' : 'light'
  setTheme(next)
  return next
}
