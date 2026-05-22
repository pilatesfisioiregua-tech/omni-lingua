import { useState } from 'react'
import { RotateCcw, Volume2, Mic, Square, CheckCircle2 } from 'lucide-react'
import { speak } from '../../shared/audio/tts'
import { Recognizer, isAsrSupported } from '../../shared/speech/WebSpeechRecognition'
import type { ConversationSession } from './conversationDb'

type Props = {
  session: ConversationSession
  onClose: () => void
}

export function ConversationReplay({ session, onClose }: Props) {
  const hardest = session.hardestTurnIdx
    .map((i) => ({ i, turn: session.turns[i] }))
    .filter((x) => x.turn && x.turn.role === 'user')

  const [activeIdx, setActiveIdx] = useState(0)
  const [retryText, setRetryText] = useState('')
  const [recording, setRecording] = useState(false)
  const [done, setDone] = useState<Set<number>>(new Set())

  if (hardest.length === 0) {
    return (
      <div className="rounded-lg border border-canvas-200 bg-canvas-50 p-4 text-sm text-canvas-500">
        No hay turnos suficientemente difíciles para replay. Continúa conversando para que el
        sistema detecte tus peores momentos.
      </div>
    )
  }

  const current = hardest[activeIdx]
  const previousAssistant = session.turns[current.i - 1]

  const record = () => {
    if (!isAsrSupported()) return
    try {
      const rec = new Recognizer({ lang: 'en-US', continuous: false, interim: false })
      setRecording(true)
      rec.onResult((r) => {
        if (r.isFinal) {
          setRetryText(r.transcript)
          setRecording(false)
        }
      })
      rec.onError(() => setRecording(false))
      rec.start()
    } catch {
      setRecording(false)
    }
  }

  const markDone = () => {
    setDone((s) => new Set([...s, activeIdx]))
    if (activeIdx < hardest.length - 1) {
      setActiveIdx(activeIdx + 1)
      setRetryText('')
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
        <div className="mb-3 flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-accent-500" />
          <h2 className="font-serif text-lg text-canvas-900">Replay · Diferenciador #9</h2>
        </div>
        <p className="mb-4 text-sm text-canvas-700">
          Estos {hardest.length} turnos fueron tus más difíciles. Re-juégalos con tiempo · retrieval
          practice sobre tu dolor real (Roediger 2006 + Bjork desirable difficulties).
        </p>

        <div className="mb-4 flex gap-1">
          {hardest.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setActiveIdx(i)
                setRetryText('')
              }}
              className={
                'flex-1 rounded-md border p-2 text-xs ' +
                (i === activeIdx
                  ? 'border-accent-500 bg-accent-100 text-accent-900'
                  : done.has(i)
                  ? 'border-success bg-success/10 text-success'
                  : 'border-canvas-300 bg-canvas-100 text-canvas-700')
              }
            >
              Turno #{i + 1} {done.has(i) && '✓'}
            </button>
          ))}
        </div>

        {previousAssistant && (
          <div className="mb-3 rounded-lg bg-canvas-100 p-3">
            <div className="text-[10px] uppercase tracking-wider text-canvas-500">Te dijeron</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-canvas-900">{previousAssistant.text}</span>
              <button
                type="button"
                onClick={() => void speak(previousAssistant.text, { lang: 'en-US' })}
                className="rounded p-1 hover:bg-canvas-200"
              >
                <Volume2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        <div className="mb-3 rounded-lg border border-danger/30 bg-danger/5 p-3">
          <div className="text-[10px] uppercase tracking-wider text-danger">Tu respuesta original (difícil)</div>
          <div className="text-sm text-canvas-900">{current.turn.text}</div>
          {current.turn.mirror && (
            <div className="mt-2 text-xs text-canvas-700">
              🪞 Sugerencia: <strong>{current.turn.mirror.intended}</strong>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-canvas-700">Inténtalo otra vez con calma:</div>
          <div className="flex items-end gap-2">
            <textarea
              value={retryText}
              onChange={(e) => setRetryText(e.target.value)}
              rows={2}
              placeholder="Escribe o graba tu nueva versión…"
              className="flex-1 resize-none rounded-md border border-canvas-200 bg-canvas-50 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={recording ? () => setRecording(false) : record}
              disabled={!isAsrSupported()}
              className={
                'rounded-md p-2 text-white ' +
                (recording ? 'bg-danger' : 'bg-accent-500 hover:bg-accent-700') +
                ' disabled:opacity-40'
              }
            >
              {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="button"
            onClick={markDone}
            disabled={!retryText.trim()}
            className="inline-flex items-center gap-1 rounded-md bg-accent-500 px-3 py-1 text-xs text-white hover:bg-accent-700 disabled:opacity-40"
          >
            <CheckCircle2 className="h-3 w-3" />
            {done.has(activeIdx) ? 'Hecho · siguiente' : 'Marcar como mejorado'}
          </button>
        </div>

        {done.size === hardest.length && (
          <div className="mt-4 rounded-md border-l-2 border-success bg-success/10 p-3 text-sm text-canvas-700">
            ✓ Replay completado. Esos patrones entran en tu FSRS · te aparecerán antes de que los
            olvides.
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-3 text-xs text-canvas-500 hover:text-canvas-900"
        >
          Cerrar replay
        </button>
      </div>
    </div>
  )
}
