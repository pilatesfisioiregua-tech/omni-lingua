import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Send, Sparkles, X, Trash2, Loader2, MessageCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { useAssistant } from './useAssistant'

type Props = {
  open: boolean
  onClose: () => void
}

export function AssistantSidebar({ open, onClose }: Props) {
  const { messages, streaming, streamedDelta, error, send, reset, greetIfNewRoute } = useAssistant()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()

  useEffect(() => {
    if (open) greetIfNewRoute(location.pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, location.pathname])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, streamedDelta])

  const doSend = async () => {
    const text = input.trim()
    if (!text || streaming) return
    setInput('')
    await send(text)
  }

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void doSend()
    }
  }

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-30 bg-black/30 transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={clsx(
          'fixed right-0 top-0 z-40 flex h-full w-full max-w-sm flex-col border-l border-canvas-200 bg-canvas-50 shadow-2xl transition-transform',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-canvas-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-500" />
            <h2 className="font-serif text-sm font-semibold text-canvas-900">
              Asistente Omni-Lingua
            </h2>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Borrar historial del asistente?')) reset()
                }}
                className="rounded-md p-1.5 text-canvas-500 hover:bg-canvas-200 hover:text-danger"
                aria-label="reset"
                title="Reset"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-canvas-500 hover:bg-canvas-200"
              aria-label="close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
          {messages.length === 0 && !streaming && (
            <div className="rounded-lg border border-canvas-200 bg-canvas-100 p-3 text-xs text-canvas-700">
              Modo demo activo. Sin <code>ANTHROPIC_API_KEY</code> el asistente responde con
              mensajes guiados. Para activar streaming completo, configura la key en{' '}
              <code>.env.local</code>.
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={clsx(
                'rounded-lg px-3 py-2 text-sm leading-relaxed',
                m.role === 'user'
                  ? 'ml-6 bg-accent-100 text-canvas-900'
                  : 'mr-6 bg-canvas-100 text-canvas-900',
              )}
            >
              {m.content}
            </div>
          ))}
          {streaming && (
            <div className="mr-6 rounded-lg bg-canvas-100 px-3 py-2 text-sm text-canvas-700">
              {streamedDelta || (
                <span className="inline-flex items-center gap-1 text-canvas-500">
                  <Loader2 className="h-3 w-3 animate-spin" /> pensando…
                </span>
              )}
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</div>
          )}
        </div>

        <div className="border-t border-canvas-200 p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={2}
              placeholder="Escribe en español o inglés…"
              className="flex-1 resize-none rounded-md border border-canvas-200 bg-canvas-100 px-3 py-2 text-sm text-canvas-900 placeholder:text-canvas-500 focus:border-accent-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => void doSend()}
              disabled={!input.trim() || streaming}
              className="rounded-md bg-accent-500 p-2 text-white hover:bg-accent-700 disabled:opacity-40"
              aria-label="send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export function AssistantToggleButton({
  open,
  onToggle,
}: {
  open: boolean
  onToggle: () => void
}) {
  if (open) return null
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed bottom-20 right-4 z-30 hidden items-center gap-1 rounded-full border border-accent-300 bg-accent-500 px-4 py-2 text-sm text-white shadow-lg hover:bg-accent-700 md:flex"
      aria-label="open assistant"
    >
      <MessageCircle className="h-4 w-4" /> Asistente
    </button>
  )
}
