/**
 * Twin embedder · genera embeddings de frases del usuario para:
 * - Sentence Mining más preciso (similitud semántica entre frases conocidas/desconocidas)
 * - Cluster errores recurrentes
 * - "ya sabes 'work' → 'workplace' es 80% similar"
 *
 * Lazy-loads @xenova/transformers (BGE-small ONNX) · primera carga ~30MB.
 * Persistente en IndexedDB via Dexie.
 */

import Dexie, { type Table } from 'dexie'

export type EmbeddingEntry = {
  text: string
  vector: number[]
  ts: number
  tag: string // 'sentence' | 'error_pattern' | 'vocab' | ...
}

class EmbedDB extends Dexie {
  vectors!: Table<EmbeddingEntry, string>
  constructor() {
    super('omni-lingua-twin-vectors')
    this.version(1).stores({ vectors: 'text, tag, ts' })
  }
}
const db = new EmbedDB()

type Pipeline = ((text: string, opts?: { pooling?: string; normalize?: boolean }) => Promise<{ data: Float32Array }>) | null

let pipelinePromise: Promise<Pipeline> | null = null

async function getPipeline(): Promise<Pipeline> {
  if (pipelinePromise) return pipelinePromise
  pipelinePromise = (async () => {
    try {
      const transformers = await import('@xenova/transformers')
      // env.allowLocalModels = false → fetch desde CDN HuggingFace
      ;(transformers as unknown as { env: { allowLocalModels: boolean } }).env.allowLocalModels = false
      const pipe = await transformers.pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5')
      return pipe as unknown as Pipeline
    } catch (e) {
      console.warn('twinEmbedder · pipeline load failed', e)
      return null
    }
  })()
  return pipelinePromise
}

export async function embed(text: string, tag = 'sentence'): Promise<number[] | null> {
  const cached = await db.vectors.get(text)
  if (cached) return cached.vector

  const pipe = await getPipeline()
  if (!pipe) return null

  try {
    const out = await pipe(text, { pooling: 'mean', normalize: true })
    const vector = Array.from(out.data) as number[]
    await db.vectors.put({ text, vector, ts: Date.now(), tag })
    return vector
  } catch (e) {
    console.warn('embed failed', e)
    return null
  }
}

export function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  if (na === 0 || nb === 0) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

export async function findSimilar(text: string, tag?: string, topK = 5): Promise<{ text: string; sim: number }[]> {
  const v = await embed(text)
  if (!v) return []
  const candidates = tag
    ? await db.vectors.where('tag').equals(tag).toArray()
    : await db.vectors.toArray()
  const scored = candidates
    .filter((c) => c.text !== text)
    .map((c) => ({ text: c.text, sim: cosine(v, c.vector) }))
    .sort((a, b) => b.sim - a.sim)
    .slice(0, topK)
  return scored
}

export async function clearVectorCache(): Promise<void> {
  await db.vectors.clear()
}
