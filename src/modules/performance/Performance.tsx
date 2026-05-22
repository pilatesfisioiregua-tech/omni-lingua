import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Camera, Activity, Mic } from 'lucide-react'
import { clsx } from 'clsx'
import { MouthAnalyzer } from './MouthAnalyzer'
import { PhoneticMap } from './PhoneticMap'
import { RecordingArchive } from './RecordingArchive'

type Mode = 'mouth' | 'map' | 'archive'

export function Performance() {
  const [mode, setMode] = useState<Mode>('map')
  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-canvas-900">
        <ArrowLeft className="h-3 w-3" /> volver
      </Link>

      <header className="space-y-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-accent-300 bg-accent-100 px-3 py-1 text-xs text-accent-700">
          <Camera className="h-3 w-3" /> Fase 4.9 · Performance
        </span>
        <h1 className="font-serif text-3xl text-canvas-900">Boca, mapa fonético y grabación</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-canvas-700">
          MediaPipe Face Landmarker analiza posición de labios en tiempo real · Phonetic Distance
          Map heatmap (diferenciador #3) · Recording archive con autocrítica anti self-delusion.
        </p>
      </header>

      <div className="flex gap-2 border-b border-canvas-200">
        <Tab active={mode === 'map'} onClick={() => setMode('map')} icon={<Activity className="h-3.5 w-3.5" />}>
          Phonetic Map
        </Tab>
        <Tab active={mode === 'mouth'} onClick={() => setMode('mouth')} icon={<Camera className="h-3.5 w-3.5" />}>
          Boca + labios
        </Tab>
        <Tab active={mode === 'archive'} onClick={() => setMode('archive')} icon={<Mic className="h-3.5 w-3.5" />}>
          Grabaciones
        </Tab>
      </div>

      {mode === 'map' && <PhoneticMap />}
      {mode === 'mouth' && <MouthAnalyzer />}
      {mode === 'archive' && <RecordingArchive />}
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
