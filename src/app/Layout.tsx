import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { clsx } from 'clsx'
import { Languages, Sparkles } from 'lucide-react'
import { ROUTES, GROUP_LABELS, type RouteDef } from './routes'
import { AssistantSidebar, AssistantToggleButton } from '../modules/assistant/AssistantSidebar'

const groups = (['foundation', 'tools', 'learn', 'content', 'lab', 'system'] as const).map((group) => ({
  group,
  label: GROUP_LABELS[group],
  routes: ROUTES.filter((r: RouteDef) => r.group === group),
}))

export function Layout() {
  const [assistantOpen, setAssistantOpen] = useState(false)
  return (
    <div className="flex h-full flex-col md:flex-row">
      <aside className="hidden w-64 shrink-0 border-r border-canvas-200 bg-canvas-50 md:flex md:flex-col">
        <div className="flex items-center gap-3 border-b border-canvas-200 px-5 py-4">
          <Languages className="h-6 w-6 text-accent-500" />
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-base font-semibold text-canvas-900">Omni-Lingua</span>
            <span className="text-xs text-canvas-500">Personal English companion</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map(({ group, label, routes }) => (
            <div key={group} className="mb-6">
              <h3 className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-canvas-500">
                {label}
              </h3>
              <ul className="space-y-1">
                {routes.map((route) => {
                  const Icon = route.icon
                  return (
                    <li key={route.path}>
                      <NavLink
                        to={route.path}
                        className={({ isActive }) =>
                          clsx(
                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition',
                            isActive
                              ? 'bg-accent-100 text-accent-900'
                              : 'text-canvas-700 hover:bg-canvas-200 hover:text-canvas-900',
                          )
                        }
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 truncate">{route.label}</span>
                        <span className="rounded bg-canvas-200 px-1.5 py-0.5 font-mono text-[10px] text-canvas-700">
                          F{route.phase}
                        </span>
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-canvas-200 px-4 py-3 text-[11px] text-canvas-500">
          OMNI-MIND ecosystem · v0.1
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-5 py-6 md:px-8 md:py-8">
          <div className="mb-3 flex justify-end md:hidden">
            <button
              type="button"
              onClick={() => setAssistantOpen(true)}
              className="flex items-center gap-1 rounded-md border border-accent-300 bg-accent-100 px-2.5 py-1 text-xs text-accent-700 hover:bg-accent-300"
            >
              <Sparkles className="h-3.5 w-3.5" /> Asistente
            </button>
          </div>
          <Outlet />
        </div>
      </main>

      <AssistantSidebar open={assistantOpen} onClose={() => setAssistantOpen(false)} />
      <AssistantToggleButton open={assistantOpen} onToggle={() => setAssistantOpen(true)} />

      <nav className="grid grid-cols-5 border-t border-canvas-200 bg-canvas-50 md:hidden">
        {ROUTES.slice(0, 5).map((route) => {
          const Icon = route.icon
          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center gap-1 py-2 text-[10px]',
                  isActive ? 'text-accent-700' : 'text-canvas-500',
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{route.shortLabel}</span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
