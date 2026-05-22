import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Bot, BookOpen, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'
import { CoachChat } from './CoachChat'
import { DailyStory } from './DailyStory'
import { CuratedResources } from './CuratedResources'

type Mode = 'chat' | 'story' | 'resources'

export function Coach() {
  const [mode, setMode] = useState<Mode>('chat')

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-canvas-900">
        <ArrowLeft className="h-3 w-3" /> volver
      </Link>

      <header className="space-y-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-accent-300 bg-accent-100 px-3 py-1 text-xs text-accent-700">
          <Bot className="h-3 w-3" /> Fase 4.8 · Coach IA
        </span>
        <h1 className="font-serif text-3xl text-canvas-900">Coach IA dedicado</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-canvas-700">
          Chat Claude streaming · context completo (Twin + prefs + errores) · Daily Story
          personalizada (diferenciador #2) · 30 links curados con filtros topic+CEFR.
        </p>
      </header>

      <div className="flex gap-2 border-b border-canvas-200">
        <Tab active={mode === 'chat'} onClick={() => setMode('chat')} icon={<Bot className="h-3.5 w-3.5" />}>Chat</Tab>
        <Tab active={mode === 'story'} onClick={() => setMode('story')} icon={<Sparkles className="h-3.5 w-3.5" />}>Daily Story</Tab>
        <Tab active={mode === 'resources'} onClick={() => setMode('resources')} icon={<BookOpen className="h-3.5 w-3.5" />}>Recursos curados</Tab>
      </div>

      {mode === 'chat' && <CoachChat />}
      {mode === 'story' && <DailyStory />}
      {mode === 'resources' && <CuratedResources />}
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
