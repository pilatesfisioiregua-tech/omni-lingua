import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Moon, Sun, Download, Clock, Settings as SettingsIcon } from 'lucide-react'
import { clsx } from 'clsx'
import { getTheme, setTheme, type Theme } from '../../shared/theme/themeStore'
import { practiceDb } from '../practice/practiceDb'
import { twinDb } from '../../shared/twin/twinStore'
import { vocabDb } from '../vocabulary/vocabularyDb'

type Cronotype = 'morning' | 'afternoon' | 'evening' | 'unknown'
const CRONOTYPE_KEY = 'omni-lingua-cronotype'

export function Settings() {
  const [theme, setThemeState] = useState<Theme>(getTheme())
  const [cronotype, setCronotype] = useState<Cronotype>((localStorage.getItem(CRONOTYPE_KEY) as Cronotype) ?? 'unknown')
  const [exporting, setExporting] = useState(false)

  const toggleTheme = (t: Theme) => {
    setTheme(t)
    setThemeState(t)
  }

  useEffect(() => {
    localStorage.setItem(CRONOTYPE_KEY, cronotype)
  }, [cronotype])

  const exportAll = async () => {
    setExporting(true)
    try {
      const [prefs, lessons, sessions, weekPlans, painLog, frustration, skills, twin, vocab] = await Promise.all([
        practiceDb.prefs.toArray(),
        practiceDb.lessonHistory.toArray(),
        practiceDb.sessions.toArray(),
        practiceDb.weeklyPlans.toArray(),
        practiceDb.painLog.toArray(),
        practiceDb.frustration.toArray(),
        practiceDb.skills.toArray(),
        twinDb.snapshots.toArray(),
        vocabDb.cards.toArray(),
      ])
      const payload = {
        exportedAt: new Date().toISOString(),
        version: 1,
        cronotype,
        prefs,
        lessons,
        sessions,
        weekPlans,
        painLog,
        frustration,
        skills,
        twinSnapshots: twin,
        vocabCards: vocab,
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `omni-lingua-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-canvas-900">
        <ArrowLeft className="h-3 w-3" /> volver
      </Link>

      <header className="space-y-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-accent-300 bg-accent-100 px-3 py-1 text-xs text-accent-700">
          <SettingsIcon className="h-3 w-3" /> Fase 5 · Ajustes
        </span>
        <h1 className="font-serif text-3xl text-canvas-900">Ajustes y polish</h1>
      </header>

      <section className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
        <h2 className="mb-3 font-serif text-lg text-canvas-900">Tema</h2>
        <div className="flex gap-2">
          <Btn active={theme === 'light'} onClick={() => toggleTheme('light')} icon={<Sun className="h-4 w-4" />}>
            Cream (light)
          </Btn>
          <Btn active={theme === 'dark'} onClick={() => toggleTheme('dark')} icon={<Moon className="h-4 w-4" />}>
            Dark con tinte coral
          </Btn>
        </div>
      </section>

      <section className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-accent-500" />
          <h2 className="font-serif text-lg text-canvas-900">Cronotipo · Diferenciador #10</h2>
        </div>
        <p className="mb-4 text-xs text-canvas-500">
          ¿Cuándo te sientes más despierto cognitivamente? El scheduler programa grammar/listening
          en tus horas pico y vocab/repaso en horas valle (Diekelmann · Mizumoto 2024 chrono-SRS).
        </p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <CronotypeBtn active={cronotype === 'morning'} onClick={() => setCronotype('morning')}>
            🌅 Mañana
          </CronotypeBtn>
          <CronotypeBtn active={cronotype === 'afternoon'} onClick={() => setCronotype('afternoon')}>
            ☀️ Tarde
          </CronotypeBtn>
          <CronotypeBtn active={cronotype === 'evening'} onClick={() => setCronotype('evening')}>
            🌙 Noche
          </CronotypeBtn>
          <CronotypeBtn active={cronotype === 'unknown'} onClick={() => setCronotype('unknown')}>
            🤷 Aún no sé
          </CronotypeBtn>
        </div>
      </section>

      <section className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
        <h2 className="mb-3 font-serif text-lg text-canvas-900">Export · backup JSON</h2>
        <p className="mb-4 text-xs text-canvas-500">
          Descarga toda tu data local (prefs · twin · lessons · vocab · grabaciones excluidas) como
          JSON. Útil para migrar dispositivos o conservar el progreso.
        </p>
        <button
          type="button"
          onClick={exportAll}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-40"
        >
          <Download className="h-4 w-4" />
          {exporting ? 'Exportando…' : 'Exportar backup'}
        </button>
      </section>

      <section className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
        <h2 className="mb-2 font-serif text-lg text-canvas-900">Subtitle Companion · Diferenciador #8</h2>
        <p className="text-xs text-canvas-500">
          Extensión Chrome opt-in pendiente · captura subtítulos de Netflix/YouTube, marca palabras
          i+1 y permite añadir a deck con 1 click. Repo separado: <code className="rounded bg-canvas-200 px-1">omni-lingua-chrome</code>. Sin coste extra · 3-4 días desarrollo.
        </p>
      </section>
    </div>
  )
}

function Btn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition',
        active ? 'border-accent-500 bg-accent-100 text-accent-900' : 'border-canvas-300 bg-canvas-50 text-canvas-700 hover:border-accent-300',
      )}
    >
      {icon}
      {children}
    </button>
  )
}

function CronotypeBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-lg border bg-canvas-50 p-3 text-sm transition',
        active ? 'border-accent-500 bg-accent-100/50' : 'border-canvas-200 hover:border-accent-300',
      )}
    >
      {children}
    </button>
  )
}
