/**
 * Twin aggregator · funciones para actualizar el Twin desde los módulos.
 *
 * Pronunciation llama a `recordPhonemeAttempt`.
 * Vocabulary llama a `recordVocabProduction`.
 * Listening llama a `recordErrorPattern`.
 * Conversation llama a `recordInterferenceES`.
 *
 * Mantiene running averages para evitar saltos por outliers.
 */

import { getLatestSnapshot, saveSnapshot } from './twinStore'
import type {
  TwinSnapshot,
  PhonemeAccuracy,
  VocabActiveEntry,
  ErrorPattern,
  InterferenceES,
} from './twinSchema'

async function update(mut: (s: TwinSnapshot) => TwinSnapshot): Promise<void> {
  const current = await getLatestSnapshot()
  const next = mut({ ...current })
  await saveSnapshot(next)
}

export async function recordPhonemeAttempt(phoneme: string, score: number): Promise<void> {
  await update((s) => {
    const existing = s.phonemeAccuracy.find((p) => p.phoneme === phoneme)
    if (existing) {
      // Running average ponderado por muestras
      const newSamples = existing.samples + 1
      const newGop = (existing.gop * existing.samples + score) / newSamples
      existing.gop = newGop
      existing.samples = newSamples
      existing.updatedTs = Date.now()
    } else {
      const fresh: PhonemeAccuracy = {
        phoneme,
        gop: score,
        samples: 1,
        updatedTs: Date.now(),
      }
      s.phonemeAccuracy = [...s.phonemeAccuracy, fresh]
    }
    return s
  })
}

export async function recordVocabProduction(word: string, produced: boolean): Promise<void> {
  await update((s) => {
    const existing = s.vocabActive.find((v) => v.word === word)
    if (existing) {
      if (produced) {
        existing.producedCount += 1
        existing.lastProducedTs = Date.now()
      } else {
        existing.exposedCount += 1
      }
    } else {
      const fresh: VocabActiveEntry = {
        word,
        producedCount: produced ? 1 : 0,
        exposedCount: produced ? 0 : 1,
        lastProducedTs: produced ? Date.now() : null,
      }
      s.vocabActive = [...s.vocabActive, fresh]
    }
    return s
  })
}

export async function recordErrorPattern(
  kind: ErrorPattern['kind'],
  produced: string,
  target: string,
  tag: string,
): Promise<void> {
  await update((s) => {
    const existing = s.errorPatterns.find(
      (e) => e.produced === produced && e.target === target && e.kind === kind,
    )
    if (existing) {
      existing.count += 1
      existing.lastSeenTs = Date.now()
    } else {
      const fresh: ErrorPattern = {
        kind,
        produced,
        target,
        count: 1,
        lastSeenTs: Date.now(),
        tag,
      }
      s.errorPatterns = [...s.errorPatterns, fresh]
    }
    return s
  })
}

export async function recordInterferenceES(
  tag: string,
  esExample: string,
  enTarget: string,
  esPattern: string,
): Promise<void> {
  await update((s) => {
    const existing = s.interferencesES.find((i) => i.tag === tag)
    if (existing) {
      existing.count += 1
    } else {
      const fresh: InterferenceES = {
        tag,
        esPattern,
        esExample,
        enTarget,
        count: 1,
      }
      s.interferencesES = [...s.interferencesES, fresh]
    }
    return s
  })
}

/** Estima CEFR efectivo · simple por ahora · refinado en F4. */
export async function refreshEffectiveCefr(): Promise<void> {
  await update((s) => {
    const vocab = s.vocabActive.filter((v) => v.producedCount > 0).length
    let cefr: TwinSnapshot['effectiveCefr'] = null
    if (vocab < 50) cefr = null
    else if (vocab < 200) cefr = 'A1'
    else if (vocab < 500) cefr = 'A2'
    else if (vocab < 1500) cefr = 'B1'
    else if (vocab < 3000) cefr = 'B2'
    else cefr = 'C1'
    s.effectiveCefr = cefr
    return s
  })
}
