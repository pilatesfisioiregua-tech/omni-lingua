import { useCallback, useRef, useState } from 'react'

export type AssistantMessage = { role: 'user' | 'assistant'; content: string }

const ROUTE_GREETINGS: Record<string, string> = {
  '/': 'Bienvenido a Omni-Lingua. ¿Por dónde quieres empezar hoy? Te recomiendo el módulo Twin para entender qué construye el sistema sobre tu inglés.',
  '/twin':
    'Aquí vive tu Language Twin — el vector único que modela tu inglés. Aún sin datos. Empieza por Pronunciación o Vocabulario para alimentarlo.',
  '/pronunciation':
    'Pronunciación llegará en Fase 1: fonemas IPA, pitch detection con Pitchy y tongue twisters con Tone.js.',
  '/vocabulary':
    'Vocabulario llegará en Fase 2: 500 palabras A1-A2 priorizadas + 200 collocations. El "mástil" del inglés.',
  '/listening':
    'Listening llegará en Fase 3: minimal pairs, shadowing (Tanaka) y live transcriber.',
  '/practice':
    'El plan adaptativo es el módulo grande, llegará en Fase 4: curriculum 40 skills + FSRS-5 + honest dashboard anti-Duolingo.',
  '/content-id':
    '"Shazam de inglés" llegará en Fase 4.5: identifica canción/podcast, transcribe, marca frases i+1, sentence mining auto.',
  '/conversation':
    'Conversación voz-a-voz con Claude llegará en Fase 4.6, con Linguistic Mirror y Conversational Replay.',
  '/coach':
    'Coach IA llegará en Fase 4.8 con Daily Story (mini-historia 200pal personalizada cada día).',
  '/performance':
    'Análisis boca/labios con MediaPipe + autocrítica IA llegará en Fase 4.9.',
}

export function useAssistant() {
  const [messages, setMessages] = useState<AssistantMessage[]>([])
  const [streaming, setStreaming] = useState(false)
  const [streamedDelta, setStreamedDelta] = useState('')
  const [error, setError] = useState<string | null>(null)
  const lastGreetedRoute = useRef<string | null>(null)

  const greetIfNewRoute = useCallback((route: string) => {
    if (lastGreetedRoute.current === route) return
    lastGreetedRoute.current = route
    const greeting = ROUTE_GREETINGS[route] ?? ROUTE_GREETINGS['/']
    setMessages((prev) =>
      prev.length === 0 ? [{ role: 'assistant', content: greeting }] : prev,
    )
  }, [])

  const send = useCallback(
    async (text: string) => {
      setError(null)
      setMessages((prev) => [...prev, { role: 'user', content: text }])
      setStreaming(true)
      setStreamedDelta('')

      try {
        const res = await fetch('/api/assistant-stream', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, { role: 'user', content: text }],
            route: window.location.pathname,
          }),
        })

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const data = await res.json()
        const reply = data.reply ?? data.message ?? 'Sin respuesta.'
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        // Modo demo · fallback local cuando no hay backend o ANTHROPIC_API_KEY
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Modo demo · sin backend disponible (${msg}). Cuando configures ANTHROPIC_API_KEY en .env.local, el asistente responderá con streaming real.`,
          },
        ])
      } finally {
        setStreaming(false)
        setStreamedDelta('')
      }
    },
    [messages],
  )

  const reset = useCallback(() => {
    setMessages([])
    setStreamedDelta('')
    setError(null)
    lastGreetedRoute.current = null
  }, [])

  return { messages, streaming, streamedDelta, error, send, reset, greetIfNewRoute }
}
