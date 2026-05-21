/**
 * Shared AudioContext singleton.
 *
 * Browsers limit AudioContext creation; we use one and share it across modules
 * (tuner, metronome, ear-training, etc.). Created lazily on first user gesture
 * to comply with autoplay policy.
 */

let audioContext: AudioContext | null = null

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioContext = new Ctor()
  }
  return audioContext
}

/**
 * Some browsers (Safari, mobile Chrome) start the context suspended.
 * Call this from a user-gesture handler (button click) to resume it.
 */
export async function ensureAudioContextRunning(): Promise<AudioContext> {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }
  return ctx
}

export function getAudioContextState(): AudioContextState | 'uninitialized' {
  return audioContext ? audioContext.state : 'uninitialized'
}
