import { useMemo, useState } from 'react'
import { Volume2, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { speak } from '../../shared/audio/tts'
import { COLLOCATIONS, type Collocation } from './vocabularyData'

const PATTERNS: Collocation['pattern'][] = ['verb+noun', 'adj+noun', 'verb+prep', 'adverb+adj']
const PATTERN_LABELS: Record<Collocation['pattern'], string> = {
  'verb+noun': 'verbo + sustantivo',
  'adj+noun': 'adjetivo + sustantivo',
  'verb+prep': 'verbo + preposición',
  'adverb+adj': 'adverbio + adjetivo',
}

export function CollocationsExplorer() {
  const [pattern, setPattern] = useState<Collocation['pattern'] | 'all'>('all')
  const filtered = useMemo(
    () => (pattern === 'all' ? COLLOCATIONS : COLLOCATIONS.filter((c) => c.pattern === pattern)),
    [pattern],
  )

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-accent-300 bg-accent-100/50 p-4 text-xs text-canvas-700">
        <strong>Lexical Approach</strong> (Lewis 1993): el inglés se aprende por chunks, no por
        palabras sueltas. Estas son las colocaciones más críticas para hispanohablantes —
        memorizarlas completas evita interferencia ES → EN.
      </div>

      <div className="flex flex-wrap gap-2">
        <Pill active={pattern === 'all'} onClick={() => setPattern('all')}>
          Todas ({COLLOCATIONS.length})
        </Pill>
        {PATTERNS.map((p) => (
          <Pill key={p} active={pattern === p} onClick={() => setPattern(p)}>
            {PATTERN_LABELS[p]}
          </Pill>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {filtered.map((c) => (
          <CollocationCard key={c.chunk} c={c} />
        ))}
      </div>
    </div>
  )
}

function CollocationCard({ c }: { c: Collocation }) {
  const play = async () => {
    try {
      await speak(c.example, { lang: 'en-US', rate: 0.9 })
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <div className="rounded-xl border border-canvas-200 bg-canvas-50 p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-serif text-xl text-canvas-900">{c.chunk}</h3>
        <button
          type="button"
          onClick={play}
          className="rounded-md border border-canvas-300 bg-canvas-100 p-1 hover:border-accent-300 hover:bg-accent-100 hover:text-accent-700"
          aria-label="play"
        >
          <Volume2 className="h-3 w-3" />
        </button>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
        <span className="rounded bg-canvas-200 px-2 py-0.5 font-mono text-canvas-700">
          {PATTERN_LABELS[c.pattern]}
        </span>
        <span className="text-canvas-500">{c.category}</span>
      </div>

      <p className="mb-1 text-sm text-canvas-900">
        <span className="text-canvas-500">→ </span>
        {c.meaningEs}
      </p>
      <p className="text-xs text-canvas-700">
        <em>{c.example}</em>
      </p>
      <p className="text-xs italic text-canvas-500">{c.exampleEs}</p>

      {c.warning && (
        <div className="mt-3 flex items-start gap-1 rounded-md border-l-2 border-danger bg-danger/5 px-2 py-1 text-[11px] text-canvas-700">
          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-danger" />
          <span>{c.warning}</span>
        </div>
      )}
    </div>
  )
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-full border px-3 py-1 text-xs transition',
        active
          ? 'border-accent-500 bg-accent-500 text-white'
          : 'border-canvas-300 bg-canvas-50 text-canvas-700 hover:border-accent-300',
      )}
    >
      {children}
    </button>
  )
}
