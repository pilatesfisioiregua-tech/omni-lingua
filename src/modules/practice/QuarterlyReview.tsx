import { useState } from 'react'
import { Sparkles, Loader2, Award, AlertTriangle, ArrowRight, MessageCircle } from 'lucide-react'
import { getTwinContext } from '../../shared/twin/twinContext'
import { practiceDb, recentLessonHistory, recentPain, streakDays, getPrefs } from './practiceDb'

type Review = {
  strengths: string[]
  weaknesses: string[]
  next_30_days: string
  honest_truth: string
  celebration: string
}

export function QuarterlyReview() {
  const [loading, setLoading] = useState(false)
  const [review, setReview] = useState<Review | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    setLoading(true)
    setError(null)
    try {
      const twin = await getTwinContext()
      const lessons = await recentLessonHistory(90)
      const pain = await recentPain(90)
      const sessions = await practiceDb.sessions.toArray()
      const prefs = await getPrefs()
      const streak = await streakDays()

      const avgRate = lessons.length ? lessons.reduce((a, b) => a + b.selfRate, 0) / lessons.length : 0
      const graduated = lessons.filter((l) => l.graduated).length
      const painAvg = pain.length
        ? {
            headache: pain.reduce((a, b) => a + b.zones.headache, 0) / pain.length,
            frustration: pain.reduce((a, b) => a + b.zones.frustration, 0) / pain.length,
            boredom: pain.reduce((a, b) => a + b.zones.boredom, 0) / pain.length,
            motivation: pain.reduce((a, b) => a + b.zones.motivation, 0) / pain.length,
          }
        : null

      const daysSinceOnboarding = sessions.length
        ? Math.floor((Date.now() - sessions[0].startedAt) / 86400000)
        : 0

      const res = await fetch('/api/quarterly-review', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          twin,
          lessonHistorySummary: { total: lessons.length, avgRate, graduated },
          painSummary: painAvg,
          streakDays: streak,
          daysSinceOnboarding,
          objective: prefs?.objective ?? 'conversational',
        }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setReview(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-accent-500" />
          <h2 className="font-serif text-lg text-canvas-900">Review tipo coach humano</h2>
        </div>
        <button
          type="button"
          onClick={() => void generate()}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-md bg-accent-500 px-3 py-1 text-xs font-medium text-white hover:bg-accent-700 disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
          {loading ? 'Generando…' : review ? 'Regenerar' : 'Generar review'}
        </button>
      </div>

      <p className="mb-4 text-xs text-canvas-500">
        Cada 30 días · Claude Sonnet analiza tu Twin + lessons + pain log + progreso y emite un
        review tipo coach humano: lo que haces bien, lo que no, y una verdad honest que evita el
        comfort fluff.
      </p>

      {error && (
        <div className="rounded-md border-l-2 border-danger bg-danger/5 px-3 py-2 text-xs text-canvas-700">
          {error}
        </div>
      )}

      {review && (
        <div className="space-y-4">
          <Block icon={<Award className="h-4 w-4 text-success" />} title="Lo que celebrar">
            <p className="text-sm text-canvas-900">{review.celebration}</p>
          </Block>

          {review.strengths.length > 0 && (
            <Block icon={<Award className="h-4 w-4 text-canvas-700" />} title="Fortalezas reales">
              <ul className="space-y-1">
                {review.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-canvas-700">· {s}</li>
                ))}
              </ul>
            </Block>
          )}

          {review.weaknesses.length > 0 && (
            <Block icon={<AlertTriangle className="h-4 w-4 text-warning" />} title="Áreas a trabajar">
              <ul className="space-y-1">
                {review.weaknesses.map((s, i) => (
                  <li key={i} className="text-sm text-canvas-700">· {s}</li>
                ))}
              </ul>
            </Block>
          )}

          <Block icon={<ArrowRight className="h-4 w-4 text-accent-500" />} title="Próximos 30 días">
            <p className="text-sm text-canvas-900">{review.next_30_days}</p>
          </Block>

          <div className="rounded-md border-l-2 border-danger bg-danger/5 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-danger">Honest truth</div>
            <p className="text-sm text-canvas-900">{review.honest_truth}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Block({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-canvas-100 p-3">
      <div className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-canvas-500">
        {icon} {title}
      </div>
      {children}
    </div>
  )
}
