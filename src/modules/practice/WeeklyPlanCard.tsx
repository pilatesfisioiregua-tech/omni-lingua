import { useEffect, useState } from 'react'
import { CalendarDays, Save } from 'lucide-react'
import { getCurrentWeekPlan, saveWeekPlan } from './practiceDb'
import { SKILLS } from './curriculumData'

export function WeeklyPlanCard() {
  const [hours, setHours] = useState(3)
  const [notes, setNotes] = useState('')
  const [priorities, setPriorities] = useState<string[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    void (async () => {
      const existing = await getCurrentWeekPlan()
      if (existing) {
        setHours(existing.availableHours)
        setNotes(existing.notes)
        setPriorities(existing.priorities)
      }
    })()
  }, [])

  const togglePriority = (id: string) => {
    setPriorities((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
    setSaved(false)
  }

  const save = async () => {
    await saveWeekPlan({ availableHours: hours, notes, priorities })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-accent-500" />
        <h2 className="font-serif text-lg text-canvas-900">Plan de esta semana</h2>
      </div>
      <p className="mb-4 text-xs text-canvas-500">
        Declarar disponibilidad real semana a semana es el diferenciador clave vs Duolingo. El
        scheduler reorganiza prioridades en base a esto.
      </p>

      <div className="mb-3 space-y-1">
        <label className="text-xs font-medium text-canvas-700">Horas disponibles esta semana</label>
        <input
          type="range"
          min={0.5}
          max={20}
          step={0.5}
          value={hours}
          onChange={(e) => {
            setHours(Number(e.target.value))
            setSaved(false)
          }}
          className="w-full accent-accent-500"
        />
        <div className="font-serif text-2xl text-accent-700">{hours}h</div>
      </div>

      <div className="mb-3 space-y-1">
        <label className="text-xs font-medium text-canvas-700">Notas (opcional)</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value)
            setSaved(false)
          }}
          placeholder="Esta semana viaje a Londres · necesito speaking básico"
          className="w-full rounded-md border border-canvas-200 bg-canvas-50 px-3 py-2 text-sm"
        />
      </div>

      <div className="mb-3 space-y-1">
        <label className="text-xs font-medium text-canvas-700">Prioridades</label>
        <div className="flex max-h-32 flex-wrap gap-1 overflow-y-auto">
          {SKILLS.slice(0, 16).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => togglePriority(s.id)}
              className={
                'rounded-full border px-2 py-0.5 text-[10px] transition ' +
                (priorities.includes(s.id)
                  ? 'border-accent-500 bg-accent-500 text-white'
                  : 'border-canvas-300 bg-canvas-50 text-canvas-700 hover:border-accent-300')
              }
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
      >
        <Save className="h-3 w-3" /> {saved ? 'Guardado ✓' : 'Guardar plan semanal'}
      </button>
    </div>
  )
}
