/**
 * Web Speech Recognition wrapper · ASR cliente nativo (Chrome/Edge/Safari).
 *
 * 100% cliente · gratuito · privacy first (audio NUNCA al backend).
 * Fallback inteligente: si el navegador no soporta, se notifica al caller.
 */

export type AsrResult = {
  transcript: string
  confidence: number
  isFinal: boolean
}

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((e: unknown) => void) | null
  onerror: ((e: unknown) => void) | null
  onend: (() => void) | null
}

function getRecognitionCtor():
  | (new () => SpeechRecognitionLike)
  | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function isAsrSupported(): boolean {
  return getRecognitionCtor() !== null
}

export type RecognizerOptions = {
  lang?: 'en-US' | 'en-GB' | 'es-ES'
  continuous?: boolean
  interim?: boolean
}

export class Recognizer {
  private rec: SpeechRecognitionLike | null = null
  private listeners = new Set<(r: AsrResult) => void>()
  private errorListeners = new Set<(e: string) => void>()

  constructor(opts: RecognizerOptions = {}) {
    const Ctor = getRecognitionCtor()
    if (!Ctor) {
      throw new Error('SpeechRecognition no soportado en este navegador (prueba Chrome o Edge)')
    }
    this.rec = new Ctor()
    this.rec.lang = opts.lang ?? 'en-US'
    this.rec.continuous = opts.continuous ?? false
    this.rec.interimResults = opts.interim ?? true
    this.rec.maxAlternatives = 1

    this.rec.onresult = (e: unknown) => {
      const ev = e as { results: { length: number; isFinal: boolean; [i: number]: { transcript: string; confidence: number } }[]; resultIndex: number }
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i]
        const alt = r[0]
        this.listeners.forEach((l) =>
          l({ transcript: alt.transcript, confidence: alt.confidence ?? 0, isFinal: r.isFinal }),
        )
      }
    }
    this.rec.onerror = (e: unknown) => {
      const ev = e as { error?: string }
      this.errorListeners.forEach((l) => l(ev.error ?? 'asr_error'))
    }
  }

  start(): void {
    this.rec?.start()
  }

  stop(): void {
    this.rec?.stop()
  }

  abort(): void {
    this.rec?.abort()
  }

  onResult(fn: (r: AsrResult) => void): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  onError(fn: (msg: string) => void): () => void {
    this.errorListeners.add(fn)
    return () => this.errorListeners.delete(fn)
  }
}
