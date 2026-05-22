import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ScanLine, FileText } from 'lucide-react'
import { clsx } from 'clsx'
import { ContentIdentifier } from './ContentIdentifier'
import { TranscriptViewer } from './TranscriptViewer'

type Mode = 'identify' | 'transcript'

export function ContentId() {
  const [mode, setMode] = useState<Mode>('identify')
  const [transcript, setTranscript] = useState<string | null>(null)
  const [contentTitle, setContentTitle] = useState<string>('')

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-canvas-900">
        <ArrowLeft className="h-3 w-3" /> volver
      </Link>

      <header className="space-y-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-accent-300 bg-accent-100 px-3 py-1 text-xs text-accent-700">
          <ScanLine className="h-3 w-3" /> Fase 4.5 · Shazam de inglés
        </span>
        <h1 className="font-serif text-3xl text-canvas-900">Identifica + extrae vocab de contenido real</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-canvas-700">
          Captura 15s de audio (canción, podcast, escena). ACRCloud identifica el contenido,
          Whisper transcribe lo que falta. TranscriptViewer marca palabras i+1 (Sentence Mining ·
          Refold/MIA).
        </p>
      </header>

      <div className="flex gap-2 border-b border-canvas-200">
        <Tab active={mode === 'identify'} onClick={() => setMode('identify')} icon={<ScanLine className="h-3.5 w-3.5" />}>
          Identificar
        </Tab>
        <Tab active={mode === 'transcript'} onClick={() => setMode('transcript')} icon={<FileText className="h-3.5 w-3.5" />}>
          Transcript + Mining
        </Tab>
      </div>

      {mode === 'identify' && (
        <ContentIdentifier
          onIdentified={(title, t) => {
            setContentTitle(title)
            setTranscript(t)
            setMode('transcript')
          }}
        />
      )}
      {mode === 'transcript' && <TranscriptViewer transcript={transcript} title={contentTitle} />}
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
