import { useEffect, useMemo, useState } from 'react'
import { Volume2, CheckCircle2, XCircle, RotateCw } from 'lucide-react'
import { clsx } from 'clsx'
import { speak } from '../../shared/audio/tts'
import { recordErrorPattern } from '../../shared/twin/twinAggregator'
import { MINIMAL_PAIRS } from './listeningData'

type Stats = { correct: number; total: number; perPair: Record<string, { correct: number; total: number }> }

const EMPTY_STATS: Stats = { correct: 0, total: 0, perPair: {} }

export function ListeningTrainer() {
  const [idx, setIdx] = useState(0)
  const [target, setTarget] = useState<'a' | 'b'>('a')
  const [played, setPlayed] = useState(false)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [stats, setStats] = useState<Stats>(EMPTY_STATS)

  const pair = MINIMAL_PAIRS[idx]
  const pairId = useMemo(() => `${pair.a.word}_${pair.b.word}`, [pair])

  useEffect(() => {
    setResult(null)
    setPlayed(false)
    // pick a o b al azar
    setTarget(Math.random() < 0.5 ? 'a' : 'b')
  }, [idx])

  const playTarget = async () => {
    setPlayed(true)
    setResult(null)
    try {
      await speak(pair[target].word, { lang: 'en-US', rate: 0.85 })
    } catch (e) {
      console.warn(e)
    }
  }

  const pick = async (choice: 'a' | 'b') => {
    if (!played) return
    const ok = choice === target
    setResult(ok ? 'correct' : 'wrong')
    setStats((s) => {
      const per = { ...s.perPair, [pairId]: s.perPair[pairId] ?? { correct: 0, total: 0 } }
      per[pairId] = { correct: per[pairId].correct + (ok ? 1 : 0), total: per[pairId].total + 1 }
      return { correct: s.correct + (ok ? 1 : 0), total: s.total + 1, perPair: per }
    })
    if (!ok) {
      await recordErrorPattern('pronunciation', pair[choice].word, pair[target].word, `minimal_pair_${pair.contrast}`)
    }
  }

  const next = () => setIdx((i) => (i + 1) % MINIMAL_PAIRS.length)
  const playAgain = () => playTarget()

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-6">
        <div className="mb-3 flex items-center justify-between text-xs text-canvas-500">
          <span>
            {idx + 1} / {MINIMAL_PAIRS.length}
          </span>
          <span className="rounded bg-canvas-200 px-2 py-0.5 font-mono text-canvas-700">{pair.contrast}</span>
        </div>

        <p className="mb-4 text-sm text-canvas-700">
          Pulsa <strong>Escuchar</strong> y luego elige cuál de las dos has oído.
        </p>

        <div className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={playTarget}
            className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
          >
            <Volume2 className="h-4 w-4" /> Escuchar
          </button>
          {played && (
            <button
              type="button"
              onClick={playAgain}
              className="inline-flex items-center gap-1 rounded-md border border-canvas-300 bg-canvas-100 px-3 py-1 text-xs hover:border-accent-300"
            >
              <RotateCw className="h-3 w-3" /> Repetir
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(['a', 'b'] as const).map((side) => {
            const word = pair[side]
            const isPicked = result !== null && side === target
            const isWrong = result === 'wrong' && side !== target && result !== null
            return (
              <button
                key={side}
                type="button"
                disabled={!played || result !== null}
                onClick={() => pick(side)}
                className={clsx(
                  'flex flex-col gap-1 rounded-xl border bg-canvas-50 p-4 text-left transition disabled:opacity-50',
                  result === null && played && 'hover:border-accent-300 hover:bg-accent-100/50',
                  isPicked && 'border-success bg-success/10',
                  isWrong && 'border-danger bg-danger/10',
                  !isPicked && !isWrong && 'border-canvas-200',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl text-canvas-900">{word.word}</span>
                  {isPicked && <CheckCircle2 className="h-5 w-5 text-success" />}
                  {isWrong && <XCircle className="h-5 w-5 text-danger" />}
                </div>
                <span className="font-mono text-xs text-canvas-500">{word.ipa}</span>
                <span className="text-xs italic text-canvas-700">{word.meaningEs}</span>
              </button>
            )
          })}
        </div>

        {result && (
          <div className="mt-4 space-y-2">
            <div className={clsx('text-sm font-medium', result === 'correct' ? 'text-success' : 'text-danger')}>
              {result === 'correct' ? '¡Correcto!' : `❌ Era "${pair[target].word}". Has elegido "${pair[target === 'a' ? 'b' : 'a'].word}".`}
            </div>
            <div className="text-xs text-canvas-700">💡 {pair.tip}</div>
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-1 rounded-md border border-canvas-300 bg-canvas-100 px-3 py-1 text-xs hover:border-accent-300"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-canvas-200 bg-canvas-50 p-4">
        <div className="text-xs uppercase tracking-wider text-canvas-500">Tu accuracy esta sesión</div>
        <div className="font-serif text-2xl text-canvas-900">
          {accuracy}% <span className="text-sm text-canvas-500">· {stats.correct}/{stats.total}</span>
        </div>
        {stats.total > 0 && stats.total < 5 && (
          <div className="mt-1 text-[11px] text-canvas-500">
            Muestra pequeña · acumula más intentos para que el dato sea fiable.
          </div>
        )}
      </div>
    </div>
  )
}
