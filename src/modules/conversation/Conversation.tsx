import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MessagesSquare } from 'lucide-react'
import { clsx } from 'clsx'
import { SCENARIOS, PERSONAS, LEVELS, type Scenario, type Persona, type Level } from './conversationData'
import { ConversationPartner } from './ConversationPartner'
import { ConversationReplay } from './ConversationReplay'
import type { ConversationSession } from './conversationDb'

type View = 'setup' | 'active' | 'replay'

export function Conversation() {
  const [view, setView] = useState<View>('setup')
  const [scenario, setScenario] = useState<Scenario>(SCENARIOS[0])
  const [persona, setPersona] = useState<Persona>(PERSONAS[0])
  const [level, setLevel] = useState<Level>('A2')
  const [lastSession, setLastSession] = useState<ConversationSession | null>(null)

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-canvas-900">
        <ArrowLeft className="h-3 w-3" /> volver
      </Link>

      <header className="space-y-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-accent-300 bg-accent-100 px-3 py-1 text-xs text-accent-700">
          <MessagesSquare className="h-3 w-3" /> Fase 4.6 · Conversación con IA
        </span>
        <h1 className="font-serif text-3xl text-canvas-900">Conversa con Claude voz-a-voz</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-canvas-700">
          Escenarios reales · personas adaptables · 4 niveles CEFR · Linguistic Mirror inline
          (diferenciador #7) · Replay de tus 3 peores turnos (diferenciador #9).
        </p>
      </header>

      {view === 'setup' && (
        <div className="space-y-5">
          <Setup
            scenario={scenario}
            setScenario={setScenario}
            persona={persona}
            setPersona={setPersona}
            level={level}
            setLevel={setLevel}
          />
          <button
            type="button"
            onClick={() => setView('active')}
            className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
          >
            Empezar conversación →
          </button>
        </div>
      )}

      {view === 'active' && (
        <ConversationPartner
          scenario={scenario}
          persona={persona}
          level={level}
          onEnd={(session) => {
            setLastSession(session)
            setView('replay')
          }}
        />
      )}

      {view === 'replay' && lastSession && (
        <ConversationReplay session={lastSession} onClose={() => setView('setup')} />
      )}
    </div>
  )
}

function Setup({
  scenario,
  setScenario,
  persona,
  setPersona,
  level,
  setLevel,
}: {
  scenario: Scenario
  setScenario: (s: Scenario) => void
  persona: Persona
  setPersona: (p: Persona) => void
  level: Level
  setLevel: (l: Level) => void
}) {
  return (
    <div className="space-y-5">
      <Section title="Escenario">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setScenario(s)}
              className={clsx(
                'rounded-xl border bg-canvas-50 p-3 text-left transition',
                scenario.id === s.id
                  ? 'border-accent-500 bg-accent-100/50'
                  : 'border-canvas-200 hover:border-accent-300',
              )}
            >
              <div className="text-2xl">{s.emoji}</div>
              <div className="font-medium text-canvas-900">{s.label}</div>
              <div className="text-[11px] text-canvas-500">{s.description}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Persona del partner">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPersona(p)}
              className={clsx(
                'rounded-xl border bg-canvas-50 p-3 text-left transition',
                persona.id === p.id
                  ? 'border-accent-500 bg-accent-100/50'
                  : 'border-canvas-200 hover:border-accent-300',
              )}
            >
              <div className="font-medium text-canvas-900">{p.label}</div>
              <div className="text-[11px] text-canvas-500">{p.description}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Nivel CEFR">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLevel(l.id)}
              className={clsx(
                'rounded-xl border bg-canvas-50 p-3 text-left transition',
                level === l.id ? 'border-accent-500 bg-accent-100/50' : 'border-canvas-200 hover:border-accent-300',
              )}
            >
              <div className="font-mono font-semibold text-accent-700">{l.id}</div>
              <div className="text-[11px] text-canvas-500">{l.description}</div>
            </button>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-canvas-500">{title}</h2>
      {children}
    </div>
  )
}
