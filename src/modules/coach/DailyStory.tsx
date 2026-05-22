import { useEffect, useState } from 'react'
import { Sparkles, Volume2, RefreshCw } from 'lucide-react'
import { speak } from '../../shared/audio/tts'
import { getTwinContext } from '../../shared/twin/twinContext'
import { getPrefs } from '../practice/practiceDb'
import { ICON_CONTENTS } from '../practice/curriculumData'

const STORAGE_KEY = 'omni-lingua-daily-story'

type StoryCache = { story: string; cefr: string; date: string; vocabUsed: string[] }

export function DailyStory() {
  const [story, setStory] = useState<string>('')
  const [cefr, setCefr] = useState<string>('')
  const [vocab, setVocab] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState<string | null>(null)

  useEffect(() => {
    // Load cached story if same day
    const today = new Date().toISOString().slice(0, 10)
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const cache: StoryCache = JSON.parse(raw)
        if (cache.date === today) {
          setStory(cache.story)
          setCefr(cache.cefr)
          setVocab(cache.vocabUsed ?? [])
          setGenerated(cache.date)
          return
        }
      } catch {
        // ignore
      }
    }
    void generate()
  }, [])

  const generate = async () => {
    setLoading(true)
    try {
      const twin = await getTwinContext()
      const prefs = await getPrefs()
      const wishlistTitles = (prefs?.wishlistContentIds ?? [])
        .map((id) => ICON_CONTENTS.find((c) => c.id === id)?.title)
        .filter(Boolean)
        .slice(0, 3)
      const level = twin.effectiveCefr ?? prefs?.cefrSelfReport ?? 'A2'
      const newVocab = twin.topErrors.map((e) => e.pattern.split('→')[1]?.trim()).filter(Boolean).slice(0, 5)

      const res = await fetch('/api/daily-story', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ level, vocabFocus: newVocab, themes: wishlistTitles }),
      })
      const data = await res.json().catch(() => ({}))
      const today = new Date().toISOString().slice(0, 10)
      const finalStory = data.story ?? generateFallbackStory(level)
      const finalCefr = data.cefr ?? level
      const finalVocab = data.vocabUsed ?? newVocab

      setStory(finalStory)
      setCefr(finalCefr)
      setVocab(finalVocab)
      setGenerated(today)

      const cache: StoryCache = { story: finalStory, cefr: finalCefr, date: today, vocabUsed: finalVocab }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
    } catch {
      setStory(generateFallbackStory('A2'))
      setCefr('A2')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent-500" />
          <h2 className="font-serif text-lg text-canvas-900">Daily Story · Diferenciador #2</h2>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {cefr && <span className="rounded bg-canvas-200 px-2 py-0.5 font-mono text-canvas-700">{cefr}</span>}
          <button
            type="button"
            onClick={() => void generate()}
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-md border border-canvas-300 bg-canvas-100 px-2 py-1 hover:border-accent-300 disabled:opacity-40"
          >
            <RefreshCw className={loading ? 'h-3 w-3 animate-spin' : 'h-3 w-3'} /> Nueva
          </button>
        </div>
      </div>

      <p className="mb-3 text-xs text-canvas-500">
        Mini-historia 200 palabras personalizada cada día · Claude Haiku con tu nivel + vocab que
        estás aprendiendo + temas de tu wishlist (Reinders 2023 ↑40% efectividad vs textbook).
      </p>

      <div className="rounded-xl bg-canvas-100 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-canvas-500">
            {generated ? `Generada ${generated}` : 'Generando…'}
          </span>
          {story && (
            <button
              type="button"
              onClick={() => void speak(story, { lang: 'en-US', rate: 0.9 })}
              className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-accent-700"
            >
              <Volume2 className="h-3 w-3" /> Leer
            </button>
          )}
        </div>
        <p className="mt-2 whitespace-pre-wrap font-serif text-base leading-relaxed text-canvas-900">
          {loading ? 'Generando tu historia…' : story || '—'}
        </p>
      </div>

      {vocab.length > 0 && (
        <div className="mt-3">
          <div className="text-[10px] uppercase tracking-wider text-canvas-500">Vocab usado para ti</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {vocab.map((v) => (
              <span key={v} className="rounded bg-accent-100 px-2 py-0.5 text-[11px] text-accent-700">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function generateFallbackStory(level: string): string {
  // Demo fallback sin API
  return (
    `Demo · ${level} · sin ANTHROPIC_API_KEY no se generan historias reales.\n\n` +
    'When the morning sun came in through the kitchen window, Maria was already on her second cup of coffee. She had been thinking about her trip to London for weeks. The flight was tomorrow. She had her ticket, her passport, and even a list of phrases in English written on a small notebook. "I would like a coffee, please," she said to herself, smiling. "Where is the bathroom?" was next on the list. She closed the notebook, took a deep breath, and put it in her bag. Tomorrow, she would have to speak in English for real, for the first time in her life. She was nervous, but also excited.'
  )
}
