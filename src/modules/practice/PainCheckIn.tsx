import { useState } from 'react'
import { HeartPulse } from 'lucide-react'
import { recordPain } from './practiceDb'

type Zones = { headache: number; frustration: number; boredom: number; motivation: number }

const ZONE_LABELS: Record<keyof Zones, string> = {
  headache: 'Dolor de cabeza / fatiga mental',
  frustration: 'Frustración',
  boredom: 'Aburrimiento',
  motivation: 'Motivación (más alto = más motivado)',
}

export function PainCheckIn() {
  const [zones, setZones] = useState<Zones>({ headache: 0, frustration: 0, boredom: 0, motivation: 3 })
  const [submitted, setSubmitted] = useState(false)

  const submit = async () => {
    await recordPain(zones)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <HeartPulse className="h-4 w-4 text-accent-500" />
        <h2 className="font-serif text-lg text-canvas-900">Check-in dolor cognitivo</h2>
      </div>
      <p className="mb-4 text-xs text-canvas-500">
        1-2 minutos · post-sesión. El sistema correlaciona estos datos con tipo de skill y duración
        para detectar patrones (Krashen affective filter + DeKeyser cognitive load).
      </p>

      <div className="space-y-3">
        {(Object.keys(ZONE_LABELS) as (keyof Zones)[]).map((k) => (
          <div key={k}>
            <label className="text-xs text-canvas-700">{ZONE_LABELS[k]}</label>
            <input
              type="range"
              min={0}
              max={4}
              value={zones[k]}
              onChange={(e) => setZones((z) => ({ ...z, [k]: Number(e.target.value) }))}
              className="w-full accent-accent-500"
            />
            <div className="text-[10px] text-canvas-500">{zones[k]} / 4</div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={submit}
        className="mt-3 inline-flex items-center gap-1 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
      >
        {submitted ? '✓ Registrado' : 'Registrar'}
      </button>
    </div>
  )
}
