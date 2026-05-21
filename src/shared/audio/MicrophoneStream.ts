/**
 * Singleton microphone stream.
 *
 * Asks for microphone permission once and shares the MediaStreamAudioSourceNode
 * across modules. Subscribers attach analyser nodes to the source.
 *
 * This avoids:
 *  - Multiple permission prompts
 *  - Multiple input devices opened simultaneously
 *  - AudioContext fragmentation
 */

import { getAudioContext, ensureAudioContextRunning } from './AudioContextSingleton'

export type MicState = 'idle' | 'requesting' | 'running' | 'denied' | 'error'

type Listener = (state: MicState, error?: Error) => void

let stream: MediaStream | null = null
let source: MediaStreamAudioSourceNode | null = null
let state: MicState = 'idle'
let lastError: Error | undefined
const listeners = new Set<Listener>()

function setState(next: MicState, err?: Error) {
  state = next
  lastError = err
  listeners.forEach((l) => l(next, err))
}

export function getMicState(): MicState {
  return state
}

export function getMicError(): Error | undefined {
  return lastError
}

export function subscribeMicState(listener: Listener): () => void {
  listeners.add(listener)
  listener(state, lastError)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Request mic permission and start the stream. Idempotent — calling multiple
 * times returns the existing source node.
 */
export async function startMicrophone(): Promise<MediaStreamAudioSourceNode> {
  if (source) return source

  if (state === 'requesting') {
    // Wait for the in-flight request
    return new Promise((resolve, reject) => {
      const unsub = subscribeMicState((s, err) => {
        if (s === 'running' && source) {
          unsub()
          resolve(source)
        }
        if (s === 'denied' || s === 'error') {
          unsub()
          reject(err ?? new Error(`Mic state: ${s}`))
        }
      })
    })
  }

  setState('requesting')

  try {
    await ensureAudioContextRunning()
    const ctx = getAudioContext()

    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 1,
      },
      video: false,
    })

    source = ctx.createMediaStreamSource(stream)
    setState('running')
    return source
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    const isDenied =
      error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError'
    setState(isDenied ? 'denied' : 'error', error)
    throw error
  }
}

/**
 * Stop microphone stream and release the device. Call when leaving a page
 * where mic is not needed or before unmount cleanup.
 *
 * NOTE: Only call this if no other module is using the mic. For multi-module
 * scenarios prefer leaving the stream running (cheap) until the tab closes.
 */
export function stopMicrophone(): void {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop())
    stream = null
  }
  if (source) {
    try {
      source.disconnect()
    } catch {
      /* ignore */
    }
    source = null
  }
  setState('idle')
}
