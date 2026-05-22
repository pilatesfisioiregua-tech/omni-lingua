import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ROUTES, GROUP_LABELS, type RouteDef } from './routes'

const groups = (['foundation', 'tools', 'learn', 'content', 'lab', 'system'] as const).map((group) => ({
  group,
  label: GROUP_LABELS[group],
  routes: ROUTES.filter((r: RouteDef) => r.group === group),
}))

export function Home() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-1 rounded-full border border-accent-300 bg-accent-100 px-3 py-1 text-xs text-accent-700">
          <Sparkles className="h-3 w-3" /> Fase 0 · scaffold inicial
        </div>
        <h1 className="font-serif text-4xl text-canvas-900 md:text-5xl">
          Aprende inglés con tu propio <span className="text-accent-700">exocortex</span>.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-canvas-700">
          Omni-Lingua no es otro curso online. Es una extensión cognitiva que comprime la varianza
          de tu aprendizaje y se adapta cada semana a tu disponibilidad real. Honesto sobre
          dificultad. Producción activa, no consumo pasivo.
        </p>
      </header>

      <section className="rounded-2xl border border-accent-300 bg-accent-100/60 p-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-accent-900">
          <Sparkles className="h-4 w-4" /> Language Twin · módulo fundacional
        </div>
        <p className="text-sm text-canvas-700">
          Aún sin datos. Cuando empieces a usar los módulos, el sistema construirá un vector único
          de tu inglés (errores recurrentes · vocab activo medido · pronunciación · interferencias
          del español) que alimentará al Coach, al Conversation Partner y al Scheduler.
        </p>
        <Link
          to="/twin"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent-700 hover:text-accent-900"
        >
          Ver detalle <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>

      {groups
        .filter((g) => g.group !== 'foundation')
        .map(({ group, label, routes }) => (
          <section key={group} className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-canvas-500">
              {label}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {routes.map((r) => {
                const Icon = r.icon
                return (
                  <Link
                    key={r.path}
                    to={r.path}
                    className="group flex flex-col gap-2 rounded-xl border border-canvas-200 bg-canvas-50 p-4 transition hover:border-accent-300 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-canvas-200 p-1.5 text-canvas-700 group-hover:bg-accent-100 group-hover:text-accent-700">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="font-medium text-canvas-900">{r.label}</span>
                      </div>
                      <span className="rounded bg-canvas-200 px-1.5 py-0.5 font-mono text-[10px] text-canvas-700">
                        F{r.phase}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-canvas-700">{r.tagline}</p>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}

      <footer className="border-t border-canvas-200 pt-6 text-xs text-canvas-500">
        Modo demo activo · sin API keys la app funciona al 70%. Para activar Coach, Daily Story y
        Conversation Partner copia <code className="rounded bg-canvas-200 px-1">.env.example</code>
        {' a '}
        <code className="rounded bg-canvas-200 px-1">.env.local</code> y rellena los valores.
      </footer>
    </div>
  )
}
