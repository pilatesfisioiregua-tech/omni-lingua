import Dexie, { type Table } from 'dexie'

export type Turn = {
  role: 'user' | 'assistant'
  text: string
  ts: number
  difficulty?: number // 1-5 how hard it was to produce (for replay)
  mirror?: { intended: string; produced: string; explanation: string } | null
}

export type ConversationSession = {
  id?: number
  scenarioId: string
  personaId: string
  level: string
  startedAt: number
  endedAt: number | null
  turns: Turn[]
  hardestTurnIdx: number[]
}

class ConvDB extends Dexie {
  sessions!: Table<ConversationSession, number>

  constructor() {
    super('omni-lingua-conversation')
    this.version(1).stores({
      sessions: '++id, startedAt, scenarioId',
    })
  }
}

export const convDb = new ConvDB()

export async function saveSession(s: ConversationSession): Promise<number> {
  if (s.id) {
    await convDb.sessions.put(s)
    return s.id
  }
  return convDb.sessions.add(s) as Promise<number>
}

export async function recentSessions(limit = 10): Promise<ConversationSession[]> {
  return convDb.sessions.orderBy('startedAt').reverse().limit(limit).toArray()
}
