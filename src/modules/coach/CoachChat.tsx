import { useEffect, useRef, useState } from 'react'
import { Send, Bot, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'
import { getTwinContext } from '../../shared/twin/twinContext'
import { getPrefs } from '../practice/practiceDb'

type Message = { role: 'user' | 'assistant'; content: string }

export function CoachChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Hola. Soy tu Coach IA. Conozco tu nivel, tus errores frecuentes y tu wishlist. Pregúntame cualquier cosa: te recomiendo drills, añado palabras a tu deck o te enlazo recursos curados. ¿Por dónde empezamos hoy?',
      },
    ])
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setInput('')
    const newMessages = [...messages, { role: 'user' as const, content: text }]
    setMessages(newMessages)

    try {
      const twin = await getTwinContext()
      const prefs = await getPrefs()
      const ctxLines = [
        `CEFR efectivo: ${twin.effectiveCefr ?? 'unknown'}`,
        `Vocab activo medido: ${twin.activeVocabCount} palabras`,
        `Top errores: ${twin.topErrors.map((e) => e.pattern).join(', ') || 'ninguno'}`,
        `Fonemas débiles: ${twin.weakPhonemes.map((p) => p.phoneme).join(', ') || 'ninguno'}`,
        `Objetivo: ${prefs?.objective ?? 'conversational'}`,
      ].join(' | ')
      const sys = `You are an English coach for a Spanish speaker. CEO context: ${ctxLines}. Respond in Spanish unless the user writes in English. Be concise (max 4 short paragraphs). When relevant, suggest a specific drill (e.g. "Ve a /pronunciation y entrena /θ/ 5 minutos") or a curated resource. Mark all confidence claims as [high]/[medium]/[low].`

      const res = await fetch('/api/coach-stream', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          system: sys,
          twin,
        }),
      })
      const data = await res.json().catch(() => ({}))
      const reply =
        data.reply ?? 'Modo demo · sin ANTHROPIC_API_KEY el Coach responde con placeholders.'
      setMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: `Error: ${e instanceof Error ? e.message : 'unknown'}` },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-[55vh] flex-col rounded-2xl border border-canvas-200 bg-canvas-50">
      <div className="flex items-center gap-2 border-b border-canvas-200 px-4 py-2">
        <Bot className="h-4 w-4 text-accent-500" />
        <h2 className="font-serif text-base text-canvas-900">Coach IA · context completo</h2>
        <Sparkles className="ml-auto h-3 w-3 text-canvas-500" />
        <span className="text-[10px] text-canvas-500">Twin · prefs · errors inyectados</span>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={clsx(
              'whitespace-pre-wrap rounded-xl px-3 py-2 text-sm leading-relaxed',
              m.role === 'user' ? 'ml-12 bg-accent-100 text-canvas-900' : 'mr-12 bg-canvas-100 text-canvas-900',
            )}
          >
            {m.content}
          </div>
        ))}
        {sending && <div className="mr-12 text-xs italic text-canvas-500">Coach está pensando…</div>}
      </div>

      <div className="border-t border-canvas-200 p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void send()
              }
            }}
            rows={2}
            placeholder="Pregunta algo · 'qué practico hoy', 'cómo digo X en inglés', etc."
            className="flex-1 resize-none rounded-md border border-canvas-200 bg-canvas-100 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={!input.trim() || sending}
            className="rounded-md bg-accent-500 p-2 text-white hover:bg-accent-700 disabled:opacity-40"
            aria-label="send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
