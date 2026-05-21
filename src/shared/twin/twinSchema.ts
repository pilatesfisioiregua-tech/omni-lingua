/**
 * Language Twin · schema del vector único que modela TU inglés.
 *
 * Diferenciador #1 · alimenta Coach + Conversation + Scheduler como context primario.
 * Privacy first · todo vive en Dexie local del navegador, NUNCA al backend.
 */

export type ErrorPattern = {
  /** Categoría: grammar · lexical · pronunciation · pragmatic */
  kind: 'grammar' | 'lexical' | 'pronunciation' | 'pragmatic'
  /** Forma incorrecta producida */
  produced: string
  /** Forma correcta esperada */
  target: string
  /** Frecuencia observada */
  count: number
  /** Última vez detectado (ms epoch) */
  lastSeenTs: number
  /** Skill o tag asociado · "present_perfect" · "false_friend_embarrassed" · etc. */
  tag: string
}

export type PhonemeAccuracy = {
  /** IPA symbol · /θ/ · /ɪ/ · /ə/ */
  phoneme: string
  /** 0..1 · running average de Goodness of Pronunciation */
  gop: number
  /** Número de muestras */
  samples: number
  /** Última actualización */
  updatedTs: number
}

export type VocabActiveEntry = {
  word: string
  /** Veces que el usuario lo ha PRODUCIDO (no solo visto) */
  producedCount: number
  /** Veces que lo ha visto en context */
  exposedCount: number
  /** Última producción */
  lastProducedTs: number | null
}

export type InterferenceES = {
  /** Patrón estructural ES que causa interferencia */
  esPattern: string
  /** Forma en español */
  esExample: string
  /** Forma correcta en inglés */
  enTarget: string
  /** Veces detectado */
  count: number
  /** Tag: "have_vs_be" · "subject_omission" · "do_make" · etc. */
  tag: string
}

export type TwinSnapshot = {
  /** Versión schema del Twin */
  version: number
  /** Timestamp del snapshot */
  ts: number
  /** CEFR efectivo estimado (medido por uso, no aspiracional) */
  effectiveCefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null
  /** Patrones de error recurrentes */
  errorPatterns: ErrorPattern[]
  /** Accuracy por fonema · alimenta Phonetic Distance Map (#3) */
  phonemeAccuracy: PhonemeAccuracy[]
  /** Vocab activo medido (lo que has PRODUCIDO, no lo que has visto) */
  vocabActive: VocabActiveEntry[]
  /** Interferencias del español detectadas (Dijkstra BIA+) */
  interferencesES: InterferenceES[]
  /** Embedding del Twin (BGE-small ONNX en navegador) · null hasta tener datos */
  embedding: number[] | null
}

export const EMPTY_TWIN: TwinSnapshot = {
  version: 1,
  ts: Date.now(),
  effectiveCefr: null,
  errorPatterns: [],
  phonemeAccuracy: [],
  vocabActive: [],
  interferencesES: [],
  embedding: null,
}
