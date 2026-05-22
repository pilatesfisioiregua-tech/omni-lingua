/**
 * Notifications · PWA Notification API · respeta cronotipo.
 *
 * Sin servidor push real (Web Push requiere VAPID + service worker push handler).
 * Aquí implementamos "in-app reminders" + Notification API local cuando la pestaña
 * está activa. Para verdadero push background hay que añadir VAPID + sw push event.
 */

const CRONOTYPE_KEY = 'omni-lingua-cronotype'
const LAST_NOTIFY_KEY = 'omni-lingua-last-notify'

export type Cronotype = 'morning' | 'afternoon' | 'evening' | 'unknown'

export function getCronotype(): Cronotype {
  return (localStorage.getItem(CRONOTYPE_KEY) as Cronotype) ?? 'unknown'
}

export function getCronotypeHourRange(c: Cronotype): [number, number] {
  switch (c) {
    case 'morning':
      return [7, 11]
    case 'afternoon':
      return [13, 18]
    case 'evening':
      return [19, 23]
    default:
      return [10, 21]
  }
}

export function isWithinCronotype(date: Date = new Date()): boolean {
  const [start, end] = getCronotypeHourRange(getCronotype())
  const h = date.getHours()
  return h >= start && h < end
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  return Notification.requestPermission()
}

export async function notifyIfWithinCronotype(title: string, body: string): Promise<boolean> {
  if (!isWithinCronotype()) return false
  if (!('Notification' in window) || Notification.permission !== 'granted') return false
  // No spamear: máx 1 notif/día
  const last = localStorage.getItem(LAST_NOTIFY_KEY)
  const today = new Date().toISOString().slice(0, 10)
  if (last === today) return false
  try {
    new Notification(title, { body, icon: '/icon-192.png', tag: 'omni-lingua-daily' })
    localStorage.setItem(LAST_NOTIFY_KEY, today)
    return true
  } catch {
    return false
  }
}

/** Llamado en app start · si dentro de la franja, dispara notif del día. */
export async function maybeNotifyOnStart(): Promise<void> {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  if (!isWithinCronotype()) return
  await notifyIfWithinCronotype(
    'Omni-Lingua',
    'Sesión de inglés esperándote · 10-15 min en tu hora pico cognitiva.',
  )
}
