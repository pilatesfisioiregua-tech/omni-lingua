import { useMemo, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { clsx } from 'clsx'
import { CURATED_LINKS, type CuratedLink } from './curatedLinks'

const TOPICS: CuratedLink['topic'][] = ['listening', 'speaking', 'pronunciation', 'grammar', 'vocabulary', 'reading', 'writing', 'culture']
const CEFRS: CuratedLink['cefr'][] = ['A1', 'A2', 'B1', 'B2', 'C1']

export function CuratedResources() {
  const [topic, setTopic] = useState<CuratedLink['topic'] | 'all'>('all')
  const [cefr, setCefr] = useState<CuratedLink['cefr'] | 'all'>('all')

  const filtered = useMemo(() => {
    return CURATED_LINKS.filter((l) => (topic === 'all' || l.topic === topic) && (cefr === 'all' || l.cefr === cefr))
  }, [topic, cefr])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-xs text-canvas-500">Filtrar por topic</div>
        <div className="flex flex-wrap gap-1">
          <Chip active={topic === 'all'} onClick={() => setTopic('all')}>Todos</Chip>
          {TOPICS.map((t) => (
            <Chip key={t} active={topic === t} onClick={() => setTopic(t)}>
              {t}
            </Chip>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-xs text-canvas-500">Filtrar por nivel</div>
        <div className="flex flex-wrap gap-1">
          <Chip active={cefr === 'all'} onClick={() => setCefr('all')}>Todos</Chip>
          {CEFRS.map((c) => (
            <Chip key={c} active={cefr === c} onClick={() => setCefr(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>

      <div className="text-xs text-canvas-500">{filtered.length} recursos</div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {filtered.map((l) => (
          <a
            key={l.id}
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border border-canvas-200 bg-canvas-50 p-3 transition hover:border-accent-300"
          >
            <div className="mb-1 flex items-start justify-between gap-2">
              <div className="font-medium text-canvas-900 group-hover:text-accent-700">{l.title}</div>
              <ExternalLink className="h-3 w-3 shrink-0 text-canvas-500 group-hover:text-accent-700" />
            </div>
            <div className="mb-2 flex items-center gap-2 text-[10px]">
              <span className="rounded bg-canvas-200 px-1.5 py-0.5 font-mono text-canvas-700">{l.cefr}</span>
              <span className="text-canvas-500">{l.topic}</span>
              <span className="text-canvas-500">· {l.source}</span>
            </div>
            <div className="text-xs text-canvas-700">{l.description}</div>
          </a>
        ))}
      </div>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-full border px-2 py-0.5 text-[11px] transition',
        active
          ? 'border-accent-500 bg-accent-500 text-white'
          : 'border-canvas-300 bg-canvas-50 text-canvas-700 hover:border-accent-300',
      )}
    >
      {children}
    </button>
  )
}
