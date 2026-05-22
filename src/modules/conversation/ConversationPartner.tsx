import { useEffect, useRef, useState } from 'react'
import { Mic, Square, Send, MessageCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { speak } from '../../shared/audio/tts'
import { Recognizer, isAsrSupported } from '../../shared/speech/WebSpeechRecognition'
import type { Scenario, Persona, Level } from './conversationData'
import { saveSession, type Turn, type ConversationSession } from './conversationDb'

type Props = {
  scenario: Scenario
  persona: Persona
  level: Level
  onEnd: (session: ConversationSession) => void
}

export function ConversationPartner({ scenario, persona, level, onEnd }: Props) {
  const [turns, setTurns] = useState<Turn[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [recording, setRecording] = useState(false)
  const startedAtRef = useRef(Date.now())
  const recRef = useRef<Recognizer | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void greeting()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns])

  const greeting = async () => {
    const initial: Turn = {
      role: 'assistant',
      text: `Hi! I'm your ${persona.label.toLowerCase()}. Let's have a conversation in the ${scenario.label} setting at level ${level}. Ready when you are.`,
      ts: Date.now(),
    }
    setTurns([initial])
    void speak(initial.text, { lang: 'en-US' })
  }

  const startRecording = () => {
    if (!isAsrSupported()) return
    try {
      const rec = new Recognizer({ lang: 'en-US', continuous: false, interim: true })
      recRef.current = rec
      setRecording(true)
      let lastInterim = ''
      rec.onResult((r) => {
        if (r.isFinal) {
          setInput(lastInterim || r.transcript)
          setRecording(false)
        } else {
          lastInterim = r.transcript
          setInput(r.transcript)
        }
      })
      rec.onError(() => setRecording(false))
      rec.start()
    } catch {
      setRecording(false)
    }
  }

  const stopRecording = () => {
    recRef.current?.stop()
    setRecording(false)
  }

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    const userTurn: Turn = { role: 'user', text, ts: Date.now() }
    const newTurns = [...turns, userTurn]
    setTurns(newTurns)
    setInput('')

    // 1) Linguistic Mirror (diferenciador #7) — check si dijo algo no-natural
    let mirror: Turn['mirror'] | null = null
    try {
      const mirrorRes = await fetch('/api/mirror-conversation', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ produced: text, scenario: scenario.id, level }),
      })
      const mirrorData = await mirrorRes.json().catch(() => ({}))
      if (mirrorData.mirror_detected && mirrorData.intended) {
        mirror = {
          intended: mirrorData.intended,
          produced: mirrorData.produced ?? text,
          explanation: mirrorData.gap_explanation ?? '',
        }
      }
    } catch {
      // ignore
    }

    // 2) Reply via assistant-stream
    try {
      const sys = `${persona.systemHint} ${scenario.systemHint} Adjust your vocabulary to CEFR level ${level}. Keep replies under 30 words. After each user message, very briefly note any vocabulary they could have used better (1 line at most).`
      const res = await fetch('/api/assistant-stream', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: newTurns.map((t) => ({ role: t.role, content: t.text })),
          route: '/conversation',
          system: sys,
        }),
      })
      const data = await res.json().catch(() => ({}))
      const reply = data.reply ?? `Sorry, I'm in demo mode. Configure ANTHROPIC_API_KEY to chat for real.`

      // Estimate difficulty 1-5 from user text length + uncommon words
      const difficulty = estimateDifficulty(text)

      const updatedUserTurn: Turn = { ...userTurn, difficulty, mirror }
      const assistantTurn: Turn = { role: 'assistant', text: reply, ts: Date.now() }
      setTurns([...turns, updatedUserTurn, assistantTurn])

      void speak(reply, { lang: 'en-US' })
    } catch {
      const fallback: Turn = {
        role: 'assistant',
        text: 'Sorry, I had trouble responding. Try again.',
        ts: Date.now(),
      }
      setTurns([...newTurns, fallback])
    } finally {
      setSending(false)
    }
  }

  const endSession = async () => {
    // Identify 3 hardest turns for replay
    const idxWithDiff = turns
      .map((t, i) => ({ i, d: t.difficulty ?? 0, role: t.role }))
      .filter((x) => x.role === 'user')
      .sort((a, b) => b.d - a.d)
      .slice(0, 3)
      .map((x) => x.i)

    const session: ConversationSession = {
      scenarioId: scenario.id,
      personaId: persona.id,
      level,
      startedAt: startedAtRef.current,
      endedAt: Date.now(),
      turns,
      hardestTurnIdx: idxWithDiff,
    }
    const id = await saveSession(session)
    onEnd({ ...session, id })
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-2xl border border-canvas-200 bg-canvas-50">
      <div className="flex items-center justify-between border-b border-canvas-200 px-4 py-2">
        <div className="flex items-center gap-2 text-sm">
          <MessageCircle className="h-4 w-4 text-accent-500" />
          <span className="font-medium">
            {scenario.emoji} {scenario.label} · {persona.label} · {level}
          </span>
        </div>
        <button
          type="button"
          onClick={endSession}
          className="rounded-md border border-canvas-300 bg-canvas-100 px-2 py-1 text-xs hover:border-accent-300"
        >
          Terminar
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {turns.map((t, i) => (
          <div
            key={i}
            className={clsx(
              'rounded-xl px-3 py-2 text-sm leading-relaxed',
              t.role === 'user' ? 'ml-12 bg-accent-100 text-canvas-900' : 'mr-12 bg-canvas-100 text-canvas-900',
            )}
          >
            <div>{t.text}</div>
            {t.mirror && (
              <div className="mt-2 rounded-md border-l-2 border-warning bg-warning/5 px-2 py-1 text-[11px] text-canvas-700">
                <div className="font-medium text-warning">🪞 Linguistic Mirror</div>
                <div>Dijiste: <em>"{t.mirror.produced}"</em></div>
                <div>Más natural: <strong>"{t.mirror.intended}"</strong></div>
                {t.mirror.explanation && <div className="text-canvas-500">{t.mirror.explanation}</div>}
              </div>
            )}
          </div>
        ))}
        {sending && <div className="mr-12 text-xs italic text-canvas-500">…</div>}
      </div>

      <div className="border-t border-canvas-200 p-3">
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            disabled={!isAsrSupported() || sending}
            className={clsx(
              'rounded-md p-2 text-white',
              recording ? 'bg-danger' : 'bg-accent-500 hover:bg-accent-700',
              'disabled:opacity-40',
            )}
            aria-label="record"
          >
            {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
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
            placeholder="Habla o escribe en inglés…"
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

function estimateDifficulty(text: string): number {
  const words = text.split(/\s+/).filter(Boolean)
  const long = words.filter((w) => w.length > 7).length
  const score = Math.min(5, Math.max(1, Math.round(words.length / 6 + long / 2)))
  return score
}
