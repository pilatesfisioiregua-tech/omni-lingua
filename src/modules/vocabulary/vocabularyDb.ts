/**
 * Dexie schema vocabulary deck con estado FSRS-lite.
 *
 * FSRS-5 completo llega en Fase 4 (módulo Practice). Aquí mantenemos un estado
 * minimal: timesSeen · timesProduced · lastSeenTs · markedKnown.
 */

import Dexie, { type Table } from 'dexie'

export type CardState = {
  word: string
  timesSeen: number
  timesProduced: number
  lastSeenTs: number
  markedKnown: boolean
  starred: boolean
}

class VocabDB extends Dexie {
  cards!: Table<CardState, string>

  constructor() {
    super('omni-lingua-vocab')
    this.version(1).stores({
      cards: 'word, timesSeen, lastSeenTs, markedKnown, starred',
    })
  }
}

export const vocabDb = new VocabDB()

export async function getCard(word: string): Promise<CardState | undefined> {
  return vocabDb.cards.get(word)
}

export async function markSeen(word: string): Promise<void> {
  const existing = await vocabDb.cards.get(word)
  if (existing) {
    existing.timesSeen += 1
    existing.lastSeenTs = Date.now()
    await vocabDb.cards.put(existing)
  } else {
    await vocabDb.cards.put({
      word,
      timesSeen: 1,
      timesProduced: 0,
      lastSeenTs: Date.now(),
      markedKnown: false,
      starred: false,
    })
  }
}

export async function markProduced(word: string): Promise<void> {
  const existing = (await vocabDb.cards.get(word)) ?? {
    word,
    timesSeen: 0,
    timesProduced: 0,
    lastSeenTs: Date.now(),
    markedKnown: false,
    starred: false,
  }
  existing.timesProduced += 1
  existing.lastSeenTs = Date.now()
  await vocabDb.cards.put(existing)
}

export async function toggleKnown(word: string): Promise<void> {
  const existing = await vocabDb.cards.get(word)
  if (existing) {
    existing.markedKnown = !existing.markedKnown
    await vocabDb.cards.put(existing)
  }
}

export async function toggleStar(word: string): Promise<void> {
  const existing = await vocabDb.cards.get(word)
  if (existing) {
    existing.starred = !existing.starred
    await vocabDb.cards.put(existing)
  } else {
    await vocabDb.cards.put({
      word,
      timesSeen: 0,
      timesProduced: 0,
      lastSeenTs: Date.now(),
      markedKnown: false,
      starred: true,
    })
  }
}

export async function getAllCards(): Promise<CardState[]> {
  return vocabDb.cards.toArray()
}
