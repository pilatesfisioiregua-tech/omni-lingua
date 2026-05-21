import { useState } from 'react'
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'
import { ICON_CONTENTS } from './curriculumData'
import { savePrefs } from './practiceDb'

type Props = {
  onComplete: () => void
}

const OBJECTIVES = [
  { id: 'work', label: 'Trabajo', description: 'Reuniones, emails, presentaciones' },
  { id: 'travel', label: 'Viaje', description: 'Aeropuerto, hotel, pedir comida' },
  { id: 'movies', label: 'Películas/Series', description: 'Entender Netflix sin subs' },
  { id: 'exam', label: 'Examen oficial', description: 'B1/B2 Cambridge, IELTS' },
  { id: 'conversational', label: 'Conversar', description: 'Tener conversaciones naturales' },
]

const SELF_REPORT_CEFR = [
  { id: 'A0', label: 'Empiezo de cero', description: 'No sé nada o casi nada' },
  { id: 'A1', label: 'A1 · básico', description: 'Algunas palabras y frases sueltas' },
  { id: 'A2', label: 'A2 · elemental', description: 'Frases simples, presente y pasado básico' },
  { id: 'B1', label: 'B1 · intermedio', description: 'Conversación con esfuerzo' },
  { id: 'B2', label: 'B2 · intermedio alto', description: 'Conversación fluida con errores' },
]

export function OnboardingWizard({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [days, setDays] = useState(3)
  const [minutes, setMinutes] = useState(20)
  const [objective, setObjective] = useState('conversational')
  const [cefrSelf, setCefrSelf] = useState('A1')
  const [wishlist, setWishlist] = useState<string[]>([])

  const next = () => setStep((s) => s + 1)
  const prev = () => setStep((s) => Math.max(0, s - 1))

  const finish = async () => {
    await savePrefs({
      onboarded: true,
      daysPerWeek: days,
      minutesPerSession: minutes,
      objective,
      cefrSelfReport: cefrSelf,
      cefrAutoDetect: null,
      wishlistContentIds: wishlist,
    })
    onComplete()
  }

  const toggleWish = (id: string) => {
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]))
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <header className="space-y-2 text-center">
        <span className="inline-flex items-center gap-1 rounded-full border border-accent-300 bg-accent-100 px-3 py-1 text-xs text-accent-700">
          <Sparkles className="h-3 w-3" /> Onboarding · {step + 1} / 5
        </span>
        <h1 className="font-serif text-3xl text-canvas-900">Vamos a calibrar tu plan</h1>
        <p className="text-sm text-canvas-700">5 preguntas. El plan adaptativo se basa en lo que respondas.</p>
      </header>

      <Progress step={step} total={5} />

      <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-6">
        {step === 0 && (
          <div className="space-y-3">
            <h2 className="font-serif text-xl text-canvas-900">¿Cuántos días a la semana puedes practicar?</h2>
            <p className="text-xs text-canvas-500">Honesto. Mejor 3 días sostenibles que 7 que abandonas.</p>
            <input
              type="range"
              min={1}
              max={7}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full accent-accent-500"
            />
            <div className="font-serif text-3xl text-accent-700">{days} días/semana</div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <h2 className="font-serif text-xl text-canvas-900">¿Cuántos minutos por sesión?</h2>
            <p className="text-xs text-canvas-500">Empieza pequeño. 15-20 min sostenidos beats 60 min ocasionales.</p>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full accent-accent-500"
            />
            <div className="font-serif text-3xl text-accent-700">{minutes} min</div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <h2 className="font-serif text-xl text-canvas-900">¿Cuál es tu objetivo principal?</h2>
            <div className="space-y-2">
              {OBJECTIVES.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setObjective(o.id)}
                  className={clsx(
                    'flex w-full items-start gap-2 rounded-lg border bg-canvas-50 p-3 text-left transition',
                    objective === o.id
                      ? 'border-accent-500 bg-accent-100/50'
                      : 'border-canvas-200 hover:border-accent-300',
                  )}
                >
                  <div className="flex-1">
                    <div className="font-medium text-canvas-900">{o.label}</div>
                    <div className="text-xs text-canvas-500">{o.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h2 className="font-serif text-xl text-canvas-900">¿Cómo crees que está tu inglés ahora?</h2>
            <p className="text-xs text-canvas-500">
              Tu auto-percepción. El sistema medirá tu nivel real (Honest Dashboard) en las próximas
              semanas y te dirá si coincide.
            </p>
            <div className="space-y-2">
              {SELF_REPORT_CEFR.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCefrSelf(c.id)}
                  className={clsx(
                    'flex w-full items-center justify-between rounded-lg border bg-canvas-50 p-3 text-left transition',
                    cefrSelf === c.id ? 'border-accent-500 bg-accent-100/50' : 'border-canvas-200 hover:border-accent-300',
                  )}
                >
                  <div>
                    <div className="font-medium text-canvas-900">{c.label}</div>
                    <div className="text-xs text-canvas-500">{c.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <h2 className="font-serif text-xl text-canvas-900">Wishlist · 3-5 contenidos icónicos</h2>
            <p className="text-xs text-canvas-500">
              ¿Qué sueñas con entender? El sistema reordenará el curriculum para acercarte a esto.
            </p>
            <div className="grid max-h-96 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
              {ICON_CONTENTS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleWish(c.id)}
                  className={clsx(
                    'rounded-lg border bg-canvas-50 p-3 text-left text-xs transition',
                    wishlist.includes(c.id)
                      ? 'border-accent-500 bg-accent-100/50'
                      : 'border-canvas-200 hover:border-accent-300',
                  )}
                >
                  <div className="font-medium text-canvas-900">{c.title}</div>
                  {c.artist && <div className="text-canvas-500">{c.artist}</div>}
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-canvas-500">
                    {c.type} · target {c.cefrTarget}
                  </div>
                </button>
              ))}
            </div>
            <div className="text-xs text-canvas-500">{wishlist.length} seleccionados</div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-canvas-300 bg-canvas-50 px-3 py-1 text-xs hover:border-accent-300 disabled:opacity-40"
        >
          <ChevronLeft className="h-3 w-3" /> Atrás
        </button>
        {step < 4 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-1 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
          >
            Siguiente <ChevronRight className="h-3 w-3" />
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            disabled={wishlist.length === 0}
            className="inline-flex items-center gap-1 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-40"
          >
            Empezar →
          </button>
        )}
      </div>
    </div>
  )
}

function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={clsx('h-1 flex-1 rounded-full transition', i <= step ? 'bg-accent-500' : 'bg-canvas-200')}
        />
      ))}
    </div>
  )
}
