import { useEffect, useState } from 'react'
import { RefreshCw, Check, AlertCircle, ExternalLink } from 'lucide-react'

type CheckResult = { updates_available: boolean; version: string; proposed_changes?: unknown[] }

export function CurriculumUpdater() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const check = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/curriculum-research')
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'check_failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void check()
  }, [])

  return (
    <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-accent-500" />
        <h2 className="font-serif text-lg text-canvas-900">Curriculum updater · Fase 4.7</h2>
      </div>

      <p className="mb-4 text-xs text-canvas-500">
        Cron mensual (1 del mes 00:00) dispara <code className="rounded bg-canvas-200 px-1">/api/curriculum-research</code>:
        Claude Sonnet con web search busca papers L2 + updates BBC Learning English + trending
        r/EnglishLearning. Propuesta JSON con confidence. <strong>Nunca auto-merge</strong> · revisión humana siempre.
      </p>

      <div className="mb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => void check()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-3 py-1 text-xs font-medium text-white hover:bg-accent-700 disabled:opacity-40"
        >
          <RefreshCw className={loading ? 'h-3 w-3 animate-spin' : 'h-3 w-3'} />
          {loading ? 'Comprobando…' : 'Comprobar updates'}
        </button>
        {result && (
          <span className="text-xs text-canvas-500">
            Versión curriculum: <code className="rounded bg-canvas-200 px-1">{result.version}</code>
          </span>
        )}
      </div>

      {result && (
        <div className="space-y-3">
          {result.updates_available ? (
            <div className="rounded-md border-l-2 border-accent-500 bg-accent-100/50 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-accent-900">
                <AlertCircle className="h-4 w-4" /> Hay {result.proposed_changes?.length ?? 0} cambios propuestos
              </div>
              <p className="mt-1 text-xs text-canvas-700">
                Revisa el repositorio <code>omni-lingua-curriculum</code> en GitHub para ver el diff.
              </p>
              <a
                href="https://github.com/pilatesfisioiregua-tech/omni-lingua-curriculum"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-accent-700 hover:text-accent-900"
              >
                Abrir repo curriculum <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-success">
              <Check className="h-4 w-4" /> Curriculum al día · sin updates pendientes
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-md border-l-2 border-danger bg-danger/5 px-3 py-2 text-xs text-canvas-700">
          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-danger" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
