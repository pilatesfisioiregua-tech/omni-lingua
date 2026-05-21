import { recordFrustration } from './practiceDb'

type Props = {
  lessonId: string | null
  onClose: () => void
}

const OPTIONS = [
  { id: 'mastered_jump', label: '🚀 Salta a algo dominado', description: 'Repaso rápido de skill ya mastered para recuperar momentum' },
  { id: 'easier', label: '⬇️ Baja dificultad', description: 'Cambiar a una lesson más sencilla del mismo skill' },
  { id: 'see_progress', label: '📊 Ver mi progreso', description: 'Recordatorio visual de lo que ya has logrado' },
  { id: 'pause', label: '⏸️ Pausa 15 min', description: 'Tomar aire · cerebro cansado · vuelves más fresco' },
  { id: 'close_no_penalty', label: '✋ Cerrar sin penalizar streak', description: 'Hoy no es el día. Sin castigo ni shaming.' },
] as const

export function FrustrationModal({ lessonId, onClose }: Props) {
  const choose = async (id: (typeof OPTIONS)[number]['id']) => {
    await recordFrustration(lessonId, id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-canvas-200 bg-canvas-50 p-6 shadow-2xl">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl text-canvas-900">Te entiendo.</h2>
          <p className="text-sm text-canvas-700">
            La frustración es una señal, no un fracaso. Aquí tienes 5 caminos. Ninguno penaliza tu streak.
          </p>
        </div>

        <div className="space-y-2">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => choose(o.id)}
              className="w-full rounded-lg border border-canvas-200 bg-canvas-50 p-3 text-left hover:border-accent-300 hover:bg-accent-100/30"
            >
              <div className="text-sm font-medium text-canvas-900">{o.label}</div>
              <div className="text-xs text-canvas-500">{o.description}</div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-xs text-canvas-500 hover:text-canvas-900"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
