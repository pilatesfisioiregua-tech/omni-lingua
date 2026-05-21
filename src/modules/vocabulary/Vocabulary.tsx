import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Layers } from 'lucide-react'
import { clsx } from 'clsx'
import { VocabularyDeck } from './VocabularyDeck'
import { CollocationsExplorer } from './CollocationsExplorer'
import { CATEGORY_LABELS, VOCAB, type VocabCategory } from './vocabularyData'

type Mode = 'deck' | 'collocations'

export function Vocabulary() {
  const [mode, setMode] = useState<Mode>('deck')
  const [category, setCategory] = useState<VocabCategory | 'all'>('all')

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: VOCAB.length }
    for (const v of VOCAB) {
      counts[v.category] = (counts[v.category] ?? 0) + 1
    }
    return counts
  }, [])

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-canvas-900">
        <ArrowLeft className="h-3 w-3" /> volver
      </Link>

      <header className="space-y-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-accent-300 bg-accent-100 px-3 py-1 text-xs text-accent-700">
          <BookOpen className="h-3 w-3" /> Fase 2 · Vocabulario
        </span>
        <h1 className="font-serif text-3xl text-canvas-900">
          Construye tu vocabulario activo
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-canvas-700">
          Palabras priorizadas A1-A2 (Cambridge English Profile) y colocaciones icónicas (Lexical
          Approach · Lewis 1993). Dual coding: palabra + IPA + audio + ejemplo en contexto + meaning.
          Cada palabra producida alimenta el vocab activo medido del Twin.
        </p>
      </header>

      <div className="flex gap-2 border-b border-canvas-200">
        <TabBtn active={mode === 'deck'} onClick={() => setMode('deck')} icon={<BookOpen className="h-3.5 w-3.5" />}>
          Deck ({VOCAB.length})
        </TabBtn>
        <TabBtn active={mode === 'collocations'} onClick={() => setMode('collocations')} icon={<Layers className="h-3.5 w-3.5" />}>
          Collocations
        </TabBtn>
      </div>

      {mode === 'deck' && (
        <>
          <div className="flex flex-wrap gap-2">
            <CategoryChip active={category === 'all'} count={categoryCounts.all} onClick={() => setCategory('all')}>
              Todas
            </CategoryChip>
            {(Object.keys(CATEGORY_LABELS) as VocabCategory[]).map((c) => (
              <CategoryChip
                key={c}
                active={category === c}
                count={categoryCounts[c] ?? 0}
                onClick={() => setCategory(c)}
              >
                {CATEGORY_LABELS[c]}
              </CategoryChip>
            ))}
          </div>
          <VocabularyDeck category={category} />
        </>
      )}

      {mode === 'collocations' && <CollocationsExplorer />}
    </div>
  )
}

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        '-mb-px flex items-center gap-1 border-b-2 px-3 py-2 text-sm transition',
        active ? 'border-accent-500 text-accent-700' : 'border-transparent text-canvas-500 hover:text-canvas-900',
      )}
    >
      {icon}
      {children}
    </button>
  )
}

function CategoryChip({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean
  count: number
  onClick: () => void
  children: React.ReactNode
}) {
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
      {children} <span className="ml-1 opacity-60">{count}</span>
    </button>
  )
}
