/**
 * Twin context API · llamado por Coach + Conversation + Scheduler.
 *
 * Devuelve un payload compacto del Twin listo para inyectar en prompts LLM
 * o decisiones del scheduler. NO incluye el embedding completo (ruido en LLM).
 */

import { getLatestSnapshot } from './twinStore'
import type { TwinSnapshot } from './twinSchema'

export type TwinContext = {
  effectiveCefr: TwinSnapshot['effectiveCefr']
  topErrors: { kind: string; pattern: string; count: number }[]
  weakPhonemes: { phoneme: string; gop: number }[]
  activeVocabCount: number
  topInterferencesES: { tag: string; example: string }[]
  hasData: boolean
}

export async function getTwinContext(): Promise<TwinContext> {
  const snap = await getLatestSnapshot()
  const hasData =
    snap.errorPatterns.length > 0 ||
    snap.phonemeAccuracy.length > 0 ||
    snap.vocabActive.length > 0

  return {
    effectiveCefr: snap.effectiveCefr,
    topErrors: snap.errorPatterns
      .slice()
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((e) => ({ kind: e.kind, pattern: `${e.produced} → ${e.target}`, count: e.count })),
    weakPhonemes: snap.phonemeAccuracy
      .slice()
      .sort((a, b) => a.gop - b.gop)
      .slice(0, 5)
      .map((p) => ({ phoneme: p.phoneme, gop: p.gop })),
    activeVocabCount: snap.vocabActive.filter((v) => v.producedCount > 0).length,
    topInterferencesES: snap.interferencesES
      .slice()
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((i) => ({ tag: i.tag, example: `${i.esExample} → ${i.enTarget}` })),
    hasData,
  }
}
