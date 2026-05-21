import { Link } from 'react-router-dom'
import { ArrowLeft, Hammer } from 'lucide-react'

type Props = {
  title: string
  phase: string
  description: string
  bullets?: string[]
}

export function Placeholder({ title, phase, description, bullets = [] }: Props) {
  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-canvas-900"
      >
        <ArrowLeft className="h-3 w-3" /> volver
      </Link>

      <header className="space-y-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-canvas-300 bg-canvas-200 px-3 py-1 text-xs text-canvas-700">
          <Hammer className="h-3 w-3" /> Fase {phase} · próximamente
        </span>
        <h1 className="font-serif text-3xl text-canvas-900">{title}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-canvas-700">{description}</p>
      </header>

      {bullets.length > 0 && (
        <ul className="ml-1 space-y-2 border-l-2 border-accent-300 pl-4 text-sm text-canvas-700">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}

      <div className="rounded-lg border border-canvas-200 bg-canvas-50 p-4 text-xs text-canvas-500">
        Este módulo está scaffolded. El detalle de implementación está en el PROMPT
        canónico{' '}
        <code className="rounded bg-canvas-200 px-1 text-canvas-700">
          docs/proyectos/omni-lingua/PROMPT.md
        </code>{' '}
        y se materializará en su fase correspondiente.
      </div>
    </div>
  )
}
