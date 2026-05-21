import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Ear, Repeat2, Captions } from 'lucide-react'
import { clsx } from 'clsx'
import { ListeningTrainer } from './ListeningTrainer'
import { ShadowingDrill } from './ShadowingDrill'
import { LiveTranscriber } from './LiveTranscriber'

type Mode = 'pairs' | 'shadowing' | 'transcriber'

export function Listening() {
  const [mode, setMode] = useState<Mode>('pairs')
  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-canvas-900">
        <ArrowLeft className="h-3 w-3" /> volver
      </Link>

      <header className="space-y-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-accent-300 bg-accent-100 px-3 py-1 text-xs text-accent-700">
          <Ear className="h-3 w-3" /> Fase 3 · Listening + producción forzada
        </span>
        <h1 className="font-serif text-3xl text-canvas-900">Entrena oído y producción</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-canvas-700">
          Minimal pairs (Flege 1995) que rompen al hispanohablante · Shadowing (técnica Tanaka) ·
          Live transcriber. Comprehensible Output Hypothesis (Swain 1985) en acción: producir antes que consumir.
        </p>
      </header>

      <div className="flex gap-2 border-b border-canvas-200">
        <Tab active={mode === 'pairs'} onClick={() => setMode('pairs')} icon={<Ear className="h-3.5 w-3.5" />}>
          Minimal pairs
        </Tab>
        <Tab active={mode === 'shadowing'} onClick={() => setMode('shadowing')} icon={<Repeat2 className="h-3.5 w-3.5" />}>
          Shadowing
        </Tab>
        <Tab active={mode === 'transcriber'} onClick={() => setMode('transcriber')} icon={<Captions className="h-3.5 w-3.5" />}>
          Live transcriber
        </Tab>
      </div>

      {mode === 'pairs' && <ListeningTrainer />}
      {mode === 'shadowing' && <ShadowingDrill />}
      {mode === 'transcriber' && <LiveTranscriber />}
    </div>
  )
}

function Tab({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
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
