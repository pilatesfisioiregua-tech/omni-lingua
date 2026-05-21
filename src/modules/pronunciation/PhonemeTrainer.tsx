import { useEffect, useMemo, useState } from 'react'
import { Volume2, Mic, Square, CheckCircle2, AlertTriangle } from 'lucide-react'
import { clsx } from 'clsx'
import { speak, isTtsSupported } from '../../shared/audio/tts'
import { Recognizer, isAsrSupported, type AsrResult } from '../../shared/speech/WebSpeechRecognition'
import { getPreset, getPhonemeById, type Phoneme } from '../../shared/ipa/phonemes'
import { recordPhonemeAttempt, recordErrorPattern } from '../../shared/twin/twinAggregator'

type Props = {
  presetId: string
}

type AttemptStatus = 'idle' | 'listening' | 'evaluating' | 'done'

export function PhonemeTrainer({ presetId }: Props) {
  const preset = getPreset(presetId)
  const phonemes = useMemo(
    () => (preset?.phonemeIds ?? []).map(getPhonemeById).filter((p): p is Phoneme => !!p),
    [preset],
  )
  const [idx, setIdx] = useState(0)
  const current = phonemes[idx]
  const example = current?.examples[0]
  const [status, setStatus] = useState<AttemptStatus>('idle')
  const [transcript, setTranscript] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [recognizer, setRecognizer] = useState<Recognizer | null>(null)
  const ttsOk = isTtsSupported()
  const asrOk = isAsrSupported()

  useEffect(() => {
    setIdx(0)
    setStatus('idle')
    setTranscript('')
    setScore(null)
  }, [presetId])

  if (!current || !example) {
    return <div className="text-sm text-canvas-500">No hay fonemas para este preset.</div>
  }

  const playTarget = async () => {
    try {
      await speak(example.word, { lang: 'en-US', rate: 0.8 })
    } catch (e) {
      // navegador sin TTS · seguimos
      console.warn('tts unavailable', e)
    }
  }

  const startListening = () => {
    if (!asrOk) return
    try {
      const rec = new Recognizer({ lang: 'en-US', continuous: false, interim: true })
      setRecognizer(rec)
      setTranscript('')
      setScore(null)
      setStatus('listening')

      rec.onResult((r: AsrResult) => {
        setTranscript(r.transcript.trim())
        if (r.isFinal) {
          evaluate(r.transcript.trim())
        }
      })
      rec.onError(() => {
        setStatus('idle')
      })
      rec.start()
    } catch (e) {
      console.error('asr error', e)
      setStatus('idle')
    }
  }

  const stopListening = () => {
    recognizer?.stop()
  }

  const evaluate = async (heard: string) => {
    setStatus('evaluating')
    const target = example.word.toLowerCase().trim()
    const norm = heard.toLowerCase().replace(/[.,!?]/g, '').trim()

    // Score sencillo (placeholder de GOP real · refinado con Modal wav2vec2 en F4.9):
    // - Match exacto: 0.95
    // - Match parcial Levenshtein: 0.4-0.85
    // - Sin match: 0.1-0.3
    const dist = levenshtein(target, norm)
    const maxLen = Math.max(target.length, norm.length, 1)
    const similarity = 1 - dist / maxLen
    const finalScore = Math.max(0.1, Math.min(0.95, similarity))
    setScore(finalScore)
    setStatus('done')

    // Persistir en Twin
    await recordPhonemeAttempt(current.ipa, finalScore)
    if (finalScore < 0.5 && norm) {
      await recordErrorPattern('pronunciation', norm, target, current.id)
    }
  }

  const next = () => {
    setStatus('idle')
    setTranscript('')
    setScore(null)
    setIdx((i) => (i + 1) % phonemes.length)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-canvas-500">
            {idx + 1} / {phonemes.length}
          </span>
          <span
            className={clsx(
              'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
              current.difficulty === 'easy' && 'bg-success/10 text-success',
              current.difficulty === 'medium' && 'bg-warning/10 text-warning',
              current.difficulty === 'hard' && 'bg-danger/10 text-danger',
            )}
          >
            {current.difficulty}
          </span>
        </div>

        <div className="mb-4 flex items-baseline gap-4">
          <span className="font-serif text-6xl text-accent-700">{current.ipa}</span>
          <span className="text-sm text-canvas-500">{current.category}</span>
        </div>

        <div className="mb-5">
          <div className="text-xs uppercase tracking-wider text-canvas-500">Palabra ejemplo</div>
          <div className="flex items-center gap-3">
            <span className="font-serif text-3xl text-canvas-900">{example.word}</span>
            <span className="text-sm text-canvas-500">{example.ipa}</span>
            <span className="text-sm italic text-canvas-700">· {example.meaningEs}</span>
            <button
              type="button"
              onClick={playTarget}
              disabled={!ttsOk}
              className="ml-auto inline-flex items-center gap-1 rounded-md border border-canvas-300 bg-canvas-100 px-3 py-1 text-xs hover:border-accent-300 hover:bg-accent-100 hover:text-accent-700 disabled:opacity-40"
            >
              <Volume2 className="h-3 w-3" /> Escuchar
            </button>
          </div>
        </div>

        {current.esContrast && (
          <div className="mb-3 rounded-lg border-l-2 border-accent-500 bg-accent-100/40 px-3 py-2 text-xs text-canvas-700">
            <span className="font-medium">Contraste ES:</span> {current.esContrast}
          </div>
        )}
        {current.tip && (
          <div className="mb-4 text-xs text-canvas-500">💡 {current.tip}</div>
        )}

        <div className="flex items-center gap-2">
          {status !== 'listening' ? (
            <button
              type="button"
              onClick={startListening}
              disabled={!asrOk || status === 'evaluating'}
              className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-40"
            >
              <Mic className="h-4 w-4" />
              {asrOk ? 'Grabar' : 'ASR no soportado'}
            </button>
          ) : (
            <button
              type="button"
              onClick={stopListening}
              className="inline-flex items-center gap-2 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white"
            >
              <Square className="h-4 w-4" />
              Parar
            </button>
          )}
          {status === 'done' && (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-2 rounded-md border border-canvas-300 bg-canvas-100 px-4 py-2 text-sm hover:border-accent-300"
            >
              Siguiente →
            </button>
          )}
        </div>

        {!asrOk && (
          <div className="mt-3 text-xs text-canvas-500">
            ⚠️ Tu navegador no soporta Web Speech Recognition. Prueba Chrome o Edge desktop.
          </div>
        )}

        {transcript && (
          <div className="mt-4 rounded-lg bg-canvas-100 px-3 py-2 text-sm">
            <span className="text-xs text-canvas-500">Te he oído decir:</span>{' '}
            <span className="font-medium text-canvas-900">"{transcript}"</span>
          </div>
        )}

        {score !== null && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            {score >= 0.75 ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="font-medium text-success">¡Perfecto! Score {(score * 100).toFixed(0)}%</span>
              </>
            ) : score >= 0.5 ? (
              <>
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-warning">Casi · score {(score * 100).toFixed(0)}% · repite el ejemplo y vuelve a intentar</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-danger" />
                <span className="text-danger">Score {(score * 100).toFixed(0)}% · escucha el ejemplo otra vez antes de repetir</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-canvas-200 bg-canvas-50 p-4 text-xs text-canvas-500">
        🧠 Cada intento alimenta tu <strong className="text-canvas-700">Language Twin</strong> con
        un GOP estimado por fonema. Visita <code className="rounded bg-canvas-200 px-1">/twin</code>{' '}
        para ver tu mapa de fonemas en construcción.
      </div>
    </div>
  )
}

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}
