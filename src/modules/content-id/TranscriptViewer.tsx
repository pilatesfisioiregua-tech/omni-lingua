import { useEffect, useMemo, useState } from 'react'
import { Plus, Volume2, BarChart3 } from 'lucide-react'
import { speak } from '../../shared/audio/tts'
import { VOCAB } from '../vocabulary/vocabularyData'
import { markSeen, getAllCards } from '../vocabulary/vocabularyDb'

type Props = {
  transcript: string | null
  title: string
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'and', 'or', 'but', 'of',
  'in', 'on', 'at', 'to', 'for', 'with', 'as', 'by', 'this', 'that', 'these', 'those', 'i', 'you',
  'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its',
  'our', 'their', 'do', 'does', 'did', 'have', 'has', 'had', 'will', 'would', 'can', 'could',
  'should', 'may', 'might', 'so', 'not', 'no', 'yes', 'if', 'when', 'where', 'how', 'why', 'what',
])

export function TranscriptViewer({ transcript, title }: Props) {
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<string | null>(null)
  const [cefr, setCefr] = useState<string | null>(null)
  const [estimating, setEstimating] = useState(false)

  useEffect(() => {
    void (async () => {
      const cards = await getAllCards()
      const known = new Set(
        cards.filter((c) => c.timesProduced > 0 || c.markedKnown).map((c) => c.word.toLowerCase()),
      )
      VOCAB.forEach((v) => {
        if (knownWords.has(v.word.toLowerCase())) return
      })
      setKnownWords(known)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript])

  const sentences = useMemo(() => splitSentences(transcript ?? ''), [transcript])

  const i_plus_1 = useMemo(() => {
    if (!transcript) return new Set<number>()
    const out = new Set<number>()
    sentences.forEach((s, i) => {
      const unknown = countUnknown(s, knownWords)
      if (unknown === 1) out.add(i)
    })
    return out
  }, [sentences, knownWords, transcript])

  if (!transcript) {
    return (
      <div className="rounded-lg border border-canvas-200 bg-canvas-50 p-4 text-sm text-canvas-500">
        Identifica primero un contenido en la pestaña "Identificar".
      </div>
    )
  }

  const estimateCefr = async () => {
    setEstimating(true)
    try {
      const res = await fetch('/api/estimate-difficulty', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ transcript, title }),
      })
      const data = await res.json().catch(() => ({}))
      setCefr(data.cefr ?? 'A2')
    } catch {
      setCefr('A2')
    } finally {
      setEstimating(false)
    }
  }

  const addToDeck = async (word: string) => {
    await markSeen(word.toLowerCase())
    setKnownWords((s) => new Set([...s, word.toLowerCase()]))
  }

  const play = async (text: string) => {
    try {
      await speak(text, { lang: 'en-US', rate: 0.9 })
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl text-canvas-900">{title}</h2>
          <button
            type="button"
            onClick={estimateCefr}
            disabled={estimating}
            className="inline-flex items-center gap-1 rounded-md border border-canvas-300 bg-canvas-100 px-2 py-1 text-xs hover:border-accent-300 disabled:opacity-40"
          >
            <BarChart3 className="h-3 w-3" />
            {estimating ? 'Estimando…' : cefr ? `Nivel: ${cefr}` : 'Estimar CEFR'}
          </button>
        </div>

        <div className="mb-3 flex flex-wrap gap-2 text-[10px]">
          <Legend color="bg-canvas-200" label="conocida" />
          <Legend color="bg-accent-100" label="i+1 frase clave (sentence mining)" />
          <Legend color="bg-warning/20" label="desconocida · click para añadir" />
        </div>

        <div className="space-y-3 text-base leading-relaxed">
          {sentences.map((s, i) => (
            <Sentence
              key={i}
              text={s}
              known={knownWords}
              isIPlus1={i_plus_1.has(i)}
              onClickWord={(w) => setSelected(w)}
              onAddWord={addToDeck}
              onPlay={() => play(s)}
            />
          ))}
        </div>

        {selected && (
          <div className="mt-4 flex items-center gap-2 rounded-md border border-canvas-300 bg-canvas-100 p-3 text-sm">
            <span className="font-serif text-lg text-canvas-900">{selected}</span>
            <button
              type="button"
              onClick={() => play(selected)}
              className="rounded p-1 hover:bg-canvas-200"
              aria-label="play"
            >
              <Volume2 className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => {
                void addToDeck(selected)
                setSelected(null)
              }}
              className="ml-auto inline-flex items-center gap-1 rounded-md bg-accent-500 px-2 py-1 text-[11px] text-white hover:bg-accent-700"
            >
              <Plus className="h-3 w-3" /> Añadir a deck
            </button>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-canvas-200 bg-canvas-50 p-4 text-xs text-canvas-500">
        🧠 <strong>Sentence Mining</strong> (Refold/MIA · Mizumoto 2024): las frases marcadas con
        fondo coral tienen exactamente 1 palabra desconocida. Son tu input comprehensible i+1 ideal
        (Krashen 1985). Click en cualquier palabra para añadirla a tu deck.
      </div>
    </div>
  )
}

function Sentence({
  text,
  known,
  isIPlus1,
  onClickWord,
  onAddWord,
  onPlay,
}: {
  text: string
  known: Set<string>
  isIPlus1: boolean
  onClickWord: (w: string) => void
  onAddWord: (w: string) => void
  onPlay: () => void
}) {
  const tokens = tokenize(text)
  return (
    <p
      className={
        'rounded-md px-2 py-1 transition ' +
        (isIPlus1 ? 'bg-accent-100/60' : 'hover:bg-canvas-100')
      }
    >
      {tokens.map((t, i) => {
        if (t.type === 'word') {
          const lc = t.value.toLowerCase()
          const isStop = STOP_WORDS.has(lc)
          const isKnown = known.has(lc) || isStop || VOCAB.some((v) => v.word.toLowerCase() === lc)
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                onClickWord(t.value)
                if (!isKnown) onAddWord(t.value)
              }}
              className={
                'rounded px-0.5 transition ' +
                (isKnown
                  ? 'text-canvas-900 hover:bg-canvas-200'
                  : 'bg-warning/15 text-canvas-900 hover:bg-warning/30')
              }
            >
              {t.value}
            </button>
          )
        }
        return <span key={i}>{t.value}</span>
      })}
      <button
        type="button"
        onClick={onPlay}
        className="ml-1 inline-flex items-center text-canvas-500 hover:text-accent-700"
        aria-label="play"
      >
        <Volume2 className="h-3 w-3" />
      </button>
    </p>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-canvas-500">
      <span className={'inline-block h-2 w-3 rounded ' + color} /> {label}
    </span>
  )
}

function splitSentences(text: string): string[] {
  return text
    .split(/([.!?]+)/)
    .reduce<string[]>((acc, part) => {
      if (/[.!?]+/.test(part) && acc.length > 0) {
        acc[acc.length - 1] = acc[acc.length - 1] + part
      } else if (part.trim()) {
        acc.push(part.trim())
      }
      return acc
    }, [])
    .filter(Boolean)
}

function tokenize(text: string): { type: 'word' | 'sep'; value: string }[] {
  const out: { type: 'word' | 'sep'; value: string }[] = []
  const regex = /([A-Za-zÀ-ÿ']+)|([^A-Za-zÀ-ÿ']+)/g
  let m: RegExpExecArray | null
  while ((m = regex.exec(text)) !== null) {
    if (m[1]) out.push({ type: 'word', value: m[1] })
    else out.push({ type: 'sep', value: m[2] })
  }
  return out
}

function countUnknown(sentence: string, known: Set<string>): number {
  const words = sentence.match(/[A-Za-zÀ-ÿ']+/g) ?? []
  let unknown = 0
  for (const w of words) {
    const lc = w.toLowerCase()
    if (STOP_WORDS.has(lc)) continue
    if (known.has(lc)) continue
    if (VOCAB.some((v) => v.word.toLowerCase() === lc)) continue
    unknown += 1
  }
  return unknown
}
