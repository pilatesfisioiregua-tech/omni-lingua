import { useEffect, useState } from 'react'
import { Volume2, Mic, Square } from 'lucide-react'
import { speak } from '../../shared/audio/tts'
import { Recognizer, isAsrSupported } from '../../shared/speech/WebSpeechRecognition'
import { recordErrorPattern } from '../../shared/twin/twinAggregator'
import { SHADOWING_PHRASES } from './listeningData'

type Phase = 'idle' | 'playing' | 'ready' | 'listening' | 'done'

export function ShadowingDrill() {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [transcript, setTranscript] = useState('')
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const current = SHADOWING_PHRASES[idx]

  useEffect(() => {
    setPhase('idle')
    setTranscript('')
    setAccuracy(null)
  }, [idx])

  const playReference = async (times = 3) => {
    setPhase('playing')
    for (let i = 0; i < times; i++) {
      try {
        await speak(current.text, { lang: 'en-US', rate: 0.85 })
        await new Promise((r) => setTimeout(r, 300))
      } catch (e) {
        console.warn(e)
      }
    }
    setPhase('ready')
  }

  const record = () => {
    if (!isAsrSupported()) return
    setPhase('listening')
    setTranscript('')
    const rec = new Recognizer({ lang: 'en-US', continuous: false, interim: true })
    rec.onResult(async (r) => {
      setTranscript(r.transcript)
      if (r.isFinal) {
        const heard = r.transcript.toLowerCase().trim().replace(/[.,!?]/g, '')
        const target = current.text.toLowerCase().trim().replace(/[.,!?]/g, '')
        const acc = wordOverlap(heard, target)
        setAccuracy(acc)
        setPhase('done')
        if (acc < 0.5) {
          await recordErrorPattern('pronunciation', heard, target, 'shadowing_low_accuracy')
        }
      }
    })
    rec.onError(() => setPhase('ready'))
    rec.start()
  }

  const next = () => setIdx((i) => (i + 1) % SHADOWING_PHRASES.length)

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-6">
        <div className="mb-3 flex items-center justify-between text-xs text-canvas-500">
          <span>
            {idx + 1} / {SHADOWING_PHRASES.length}
          </span>
          <span className="rounded bg-canvas-200 px-2 py-0.5 font-mono text-canvas-700">{current.level}</span>
        </div>

        <p className="mb-2 font-serif text-2xl leading-relaxed text-canvas-900">{current.text}</p>
        <p className="mb-1 text-sm font-mono text-canvas-500">{current.ipa}</p>
        <p className="mb-5 text-sm italic text-canvas-700">{current.meaningEs}</p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => playReference(3)}
            disabled={phase === 'playing' || phase === 'listening'}
            className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-40"
          >
            <Volume2 className="h-4 w-4" />
            {phase === 'playing' ? 'Reproduciendo…' : 'Escuchar ×3'}
          </button>

          {phase === 'listening' ? (
            <button
              type="button"
              onClick={() => {/* recognizer stops itself on final */}}
              className="inline-flex items-center gap-2 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white"
            >
              <Square className="h-4 w-4" /> Escuchando…
            </button>
          ) : (
            <button
              type="button"
              onClick={record}
              disabled={!isAsrSupported() || phase === 'idle' || phase === 'playing'}
              className="inline-flex items-center gap-2 rounded-md border border-accent-500 bg-canvas-50 px-4 py-2 text-sm font-medium text-accent-700 hover:bg-accent-100 disabled:opacity-40"
            >
              <Mic className="h-4 w-4" /> Tu turno
            </button>
          )}

          {phase === 'done' && (
            <button
              type="button"
              onClick={next}
              className="ml-auto inline-flex items-center gap-1 rounded-md border border-canvas-300 bg-canvas-100 px-3 py-1 text-xs hover:border-accent-300"
            >
              Siguiente →
            </button>
          )}
        </div>

        {transcript && (
          <div className="mt-4 rounded-lg bg-canvas-100 px-3 py-2 text-sm">
            <div className="text-xs uppercase tracking-wider text-canvas-500">Tu producción</div>
            <div className="font-medium text-canvas-900">"{transcript}"</div>
          </div>
        )}

        {accuracy !== null && (
          <div className="mt-3 text-sm">
            {accuracy >= 0.8 ? (
              <span className="font-medium text-success">¡Excelente! Coincidencia {(accuracy * 100).toFixed(0)}%</span>
            ) : accuracy >= 0.5 ? (
              <span className="text-warning">Coincidencia {(accuracy * 100).toFixed(0)}% · escucha referencia otra vez</span>
            ) : (
              <span className="text-danger">Coincidencia {(accuracy * 100).toFixed(0)}% · más lento + más repeticiones</span>
            )}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-canvas-200 bg-canvas-50 p-4 text-xs text-canvas-500">
        💡 <strong>Shadowing (Tanaka)</strong>: escuchas 3 veces, luego repites a la vez. El cerebro
        aprende prosodia y ritmo que el textbook no puede enseñar.
      </div>
    </div>
  )
}

function wordOverlap(a: string, b: string): number {
  const wa = a.split(/\s+/).filter(Boolean)
  const wb = b.split(/\s+/).filter(Boolean)
  if (wa.length === 0 || wb.length === 0) return 0
  const setB = new Set(wb)
  const matches = wa.filter((w) => setB.has(w)).length
  return matches / Math.max(wa.length, wb.length)
}
