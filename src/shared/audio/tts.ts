/**
 * Text-to-Speech wrapper over Web Speech SpeechSynthesis.
 *
 * 100% cliente · gratuito · idiomas EN-US/EN-GB nativos en macOS/iOS/Android.
 * Privacy first: NUNCA al backend.
 */

export type TtsVoice = 'en-US' | 'en-GB' | 'es-ES'

export type TtsOptions = {
  lang?: TtsVoice
  rate?: number // 0.5-2 default 1
  pitch?: number // 0-2 default 1
  volume?: number // 0-1 default 1
}

let voicesCache: SpeechSynthesisVoice[] = []

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis
    const v = synth.getVoices()
    if (v.length > 0) {
      voicesCache = v
      resolve(v)
      return
    }
    const handler = () => {
      voicesCache = synth.getVoices()
      synth.onvoiceschanged = null
      resolve(voicesCache)
    }
    synth.onvoiceschanged = handler
    setTimeout(() => handler(), 1000) // safety timeout
  })
}

export async function speak(text: string, opts: TtsOptions = {}): Promise<void> {
  if (!('speechSynthesis' in window)) {
    throw new Error('SpeechSynthesis no soportado en este navegador')
  }
  const synth = window.speechSynthesis
  if (voicesCache.length === 0) await loadVoices()

  // Cancelar utterances previas para evitar cola
  synth.cancel()

  return new Promise((resolve, reject) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = opts.lang ?? 'en-US'
    u.rate = opts.rate ?? 1
    u.pitch = opts.pitch ?? 1
    u.volume = opts.volume ?? 1

    // Preferir voz nativa del idioma si está disponible
    const lang = u.lang
    const preferred = voicesCache.find((v) => v.lang.startsWith(lang.slice(0, 2)) && v.localService)
    if (preferred) u.voice = preferred

    u.onend = () => resolve()
    u.onerror = (e) => reject(new Error(e.error ?? 'tts_error'))
    synth.speak(u)
  })
}

export function cancelSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

export function isTtsSupported(): boolean {
  return 'speechSynthesis' in window
}
