/**
 * Twin store · Dexie tabla `twin` con snapshots versionados.
 */

import Dexie, { type Table } from 'dexie'
import { EMPTY_TWIN, type TwinSnapshot } from './twinSchema'

type StoredSnapshot = TwinSnapshot & { id?: number }

class TwinDB extends Dexie {
  snapshots!: Table<StoredSnapshot, number>

  constructor() {
    super('omni-lingua-twin')
    this.version(1).stores({
      snapshots: '++id, ts, version',
    })
  }
}

export const twinDb = new TwinDB()

export async function getLatestSnapshot(): Promise<TwinSnapshot> {
  const last = await twinDb.snapshots.orderBy('ts').reverse().first()
  return last ?? EMPTY_TWIN
}

export async function saveSnapshot(snap: TwinSnapshot): Promise<void> {
  await twinDb.snapshots.add({ ...snap, ts: Date.now() })
}
