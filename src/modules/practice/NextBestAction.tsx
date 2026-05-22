import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, ArrowRight, Loader2, RefreshCw } from 'lucide-react'
import { clsx } from 'clsx'
import { getTwinContext } from '../../shared/twin/twinContext'
import { getPrefs, recentLessonHistory } from './practiceDb'

type NBA = {
  recommendation: string
  route: string
  skill_tags: string[]
  rationale: string
  minutes: number
  priority: 'honest' | 'wins' | 'fun'
}

const PRIORITY_LABEL: Record<NBA['priority'], { label: string; color: string }> = {
  honest: { label: 'Lo más útil ahora', color: 'border-warning bg-warning/5' },
  wins: { label: 'Quick win', color: 'border-success bg-success/5' },
  fun: { label: 'Algo divertido', color: 'border-accent-500 bg-accent-100/50' },
}

export function NextBestAction() {
  const [loading, setLoading] = useState(false)
  const [nba, setNba] = useState<NBA | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const twin = await getTwinContext()
      const prefs = await getPrefs()
      const recent = await recentLessonHistory(7)
      const recentSkills = recent.flatMap((r) => r.lessonId).slice(0, 5)
      const res = await fetch('/api/next-best-action', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          twin,
          objective: prefs?.objective ?? 'conversational',
          minutesAvailable: prefs?.minutesPerSession ?? 20,
          recentSkills,
        }),
      })
      setNba(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  if (loading && !nba) {
    return (
      <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5 text-sm text-canvas-500">
        <Loader2 className="mr-1 inline h-3 w-3 animate-spin" /> Calculando tu siguiente paso óptimo…
      </div>
    )
  }
  if (!nba) return null

  const ps = PRIORITY_LABEL[nba.priority] ?? PRIORITY_LABEL.honest

  return (
    <div className={clsx('rounded-2xl border-l-4 bg-canvas-50 p-5', ps.color)}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-canvas-500">
          <Compass className="h-3 w-3" /> Next best action · {ps.label}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="rounded-md border border-canvas-300 bg-canvas-100 p-1 hover:border-accent-300 disabled:opacity-40"
          aria-label="refresh"
        >
          <RefreshCw className={loading ? 'h-3 w-3 animate-spin' : 'h-3 w-3'} />
        </button>
      </div>

      <h3 className="font-serif text-lg leading-snug text-canvas-900">{nba.recommendation}</h3>
      <p className="mt-2 text-xs italic text-canvas-700">{nba.rationale}</p>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-[11px] text-canvas-500">~{nba.minutes} min</div>
        <Link
          to={nba.route}
          className="inline-flex items-center gap-1 rounded-md bg-accent-500 px-3 py-1 text-xs font-medium text-white hover:bg-accent-700"
        >
          Ir <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
