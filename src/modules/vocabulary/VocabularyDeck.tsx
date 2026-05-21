import { useEffect, useMemo, useState } from 'react'
import { Volume2, ChevronLeft, ChevronRight, Eye, Mic, Star, CheckCircle2 } from 'lucide-react'
import { clsx } from 'clsx'
import { speak } from '../../shared/audio/tts'
import { Recognizer, isAsrSupported } from '../../shared/speech/WebSpeechRecognition'
import { recordVocabProduction, refreshEffectiveCefr } from '../../shared/twin/twinAggregator'
import { VOCAB, type VocabCategory } from './vocabularyData'
import { getCard, markSeen, markProduced, toggleKnown, toggleStar, type CardState } from './vocabularyDb'

type Props = {
  category: VocabCategory | 'all'
}

export function VocabularyDeck({ category }: Props) {
  const filtered = useMemo(
    () => (category === 'all' ? VOCAB : VOCAB.filter((v) => v.category === category)),
    [category],
  )
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [cardState, setCardState] = useState<CardState | null>(null)
  const [recognized, setRecognized] = useState<string | null>(null)
  const [recognizing, setRecognizing] = useState(false)
  const current = filtered[idx]

  useEffect(() => {
    setIdx(0)
    setRevealed(false)
  }, [category])

  useEffect(() => {
    if (!current) return
    void markSeen(current.word).then(() => getCard(current.word).then((c) => setCardState(c ?? null)))
    setRevealed(false)
    setRecognized(null)
  }, [current])

  if (!current) {
    return <div className="text-sm text-canvas-500">No hay palabras en esta categoría.</div>
  }

  const playWord = async () => {
    try {
      await speak(current.word, { lang: 'en-US', rate: 0.85 })
    } catch (e) {
      console.warn(e)
    }
  }

  const playExample = async () => {
    try {
      await speak(current.example, { lang: 'en-US', rate: 0.9 })
    } catch (e) {
      console.warn(e)
    }
  }

  const startRecord = async () => {
    if (!isAsrSupported()) return
    setRecognizing(true)
    setRecognized(null)
    const rec = new Recognizer({ lang: 'en-US', continuous: false, interim: false })
    rec.onResult(async (r) => {
      if (r.isFinal) {
        const norm = r.transcript.toLowerCase().trim().replace(/[.,!?]/g, '')
        setRecognized(norm)
        const target = current.word.toLowerCase()
        const matched = norm.includes(target) || target.includes(norm)
        if (matched) {
          await markProduced(current.word)
          await recordVocabProduction(current.word, true)
          await refreshEffectiveCefr()
          const c = await getCard(current.word)
          setCardState(c ?? null)
        }
        setRecognizing(false)
      }
    })
    rec.onError(() => setRecognizing(false))
    rec.start()
  }

  const next = () => {
    setIdx((i) => (i + 1) % filtered.length)
  }
  const prev = () => {
    setIdx((i) => (i - 1 + filtered.length) % filtered.length)
  }

  const onToggleKnown = async () => {
    await toggleKnown(current.word)
    const c = await getCard(current.word)
    setCardState(c ?? null)
  }
  const onToggleStar = async () => {
    await toggleStar(current.word)
    const c = await getCard(current.word)
    setCardState(c ?? null)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-6">
        <div className="mb-3 flex items-center justify-between text-xs text-canvas-500">
          <span>
            {idx + 1} / {filtered.length}
          </span>
          <div className="flex items-center gap-3">
            <span className="rounded bg-canvas-200 px-2 py-0.5 font-mono text-canvas-700">{current.cefr}</span>
            {current.tag && <span className="rounded bg-accent-100 px-2 py-0.5 text-accent-700">{current.tag}</span>}
            <button
              type="button"
              onClick={onToggleStar}
              className={clsx('transition', cardState?.starred ? 'text-warning' : 'text-canvas-400 hover:text-warning')}
              aria-label="star"
            >
              <Star className="h-4 w-4" fill={cardState?.starred ? 'currentColor' : 'none'} />
            </button>
            <button
              type="button"
              onClick={onToggleKnown}
              className={clsx('transition', cardState?.markedKnown ? 'text-success' : 'text-canvas-400 hover:text-success')}
              aria-label="known"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-serif text-5xl text-canvas-900">{current.word}</h2>
            <button
              type="button"
              onClick={playWord}
              className="inline-flex items-center gap-1 rounded-md border border-canvas-300 bg-canvas-100 px-2 py-1 text-xs hover:border-accent-300 hover:bg-accent-100 hover:text-accent-700"
            >
              <Volume2 className="h-3 w-3" /> Escuchar
            </button>
          </div>
          <p className="mt-2 font-mono text-sm text-canvas-500">{current.ipa}</p>
        </div>

        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
          >
            <Eye className="h-4 w-4" /> Revelar significado
          </button>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg bg-canvas-100 p-3">
              <div className="text-xs uppercase tracking-wider text-canvas-500">Significado</div>
              <div className="text-lg font-medium text-canvas-900">{current.meaningEs}</div>
            </div>

            <div className="rounded-lg bg-canvas-100 p-3">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-canvas-500">Ejemplo en contexto</div>
                <button
                  type="button"
                  onClick={playExample}
                  className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-accent-700"
                >
                  <Volume2 className="h-3 w-3" />
                </button>
              </div>
              <div className="text-sm text-canvas-900">{current.example}</div>
              <div className="mt-1 text-xs italic text-canvas-500">{current.exampleEs}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startRecord}
                disabled={recognizing || !isAsrSupported()}
                className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-40"
              >
                <Mic className="h-4 w-4" />
                {recognizing ? 'Escuchando…' : 'Dilo en voz alta'}
              </button>
              {recognized && (
                <div className="text-xs">
                  <span className="text-canvas-500">Te oí: </span>
                  <span className="font-medium text-canvas-900">"{recognized}"</span>
                </div>
              )}
            </div>

            {cardState && (
              <div className="border-t border-canvas-200 pt-3 text-[11px] text-canvas-500">
                Vistas: {cardState.timesSeen} · Producidas: {cardState.timesProduced}
                {cardState.timesProduced > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded bg-success/10 px-2 py-0.5 text-success">
                    ✓ vocab activo
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          className="inline-flex items-center gap-1 rounded-md border border-canvas-300 bg-canvas-50 px-3 py-1 text-xs hover:border-accent-300"
        >
          <ChevronLeft className="h-3 w-3" /> Anterior
        </button>
        <button
          type="button"
          onClick={next}
          className="inline-flex items-center gap-1 rounded-md border border-canvas-300 bg-canvas-50 px-3 py-1 text-xs hover:border-accent-300"
        >
          Siguiente <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
