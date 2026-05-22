import { useEffect, useState } from 'react'
import { Activity, TrendingUp, TrendingDown } from 'lucide-react'
import { getLatestSnapshot } from '../../shared/twin/twinStore'
import { PHONEMES } from '../../shared/ipa/phonemes'
import type { PhonemeAccuracy } from '../../shared/twin/twinSchema'

export function PhoneticMap() {
  const [data, setData] = useState<PhonemeAccuracy[]>([])

  useEffect(() => {
    void getLatestSnapshot().then((s) => setData(s.phonemeAccuracy))
  }, [])

  const sorted = data.slice().sort((a, b) => a.gop - b.gop)
  const weakest = sorted.slice(0, 5)
  const strongest = sorted.slice(-5).reverse()

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-accent-500" />
          <h2 className="font-serif text-lg text-canvas-900">Phonetic Distance Map · Diferenciador #3</h2>
        </div>
        <p className="mb-4 text-xs text-canvas-500">
          Heatmap de tu accuracy por fonema (Goodness of Pronunciation · Witt 2000 · wav2vec2 Lin 2023).
          Dejas de trabajar fonemas que ya dominas · concentras esfuerzo donde el ROI es mayor.
        </p>

        {data.length === 0 ? (
          <div className="rounded-md border-l-2 border-warning bg-warning/5 px-3 py-2 text-xs text-canvas-700">
            Aún sin datos. Ve a <strong>Pronunciación</strong> y entrena 5-10 fonemas para que este
            mapa empiece a tener forma.
          </div>
        ) : (
          <div className="space-y-3">
            <Grid data={data} />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <List
                title="Fonemas más débiles · prioridad ROI"
                icon={<TrendingDown className="h-4 w-4 text-danger" />}
                items={weakest}
              />
              <List
                title="Fonemas dominados · no malgastes tiempo"
                icon={<TrendingUp className="h-4 w-4 text-success" />}
                items={strongest}
              />
            </div>
          </div>
        )}
      </div>

      {data.length > 0 && weakest.length > 0 && (
        <div className="rounded-lg border border-canvas-200 bg-canvas-50 p-4 text-xs text-canvas-700">
          🎯 <strong>Recomendación honest</strong>: prioriza{' '}
          <span className="font-mono text-accent-700">{weakest[0].phoneme}</span> en tu próxima
          sesión. Cuesta más pero el ROI es máximo porque está al{' '}
          {(weakest[0].gop * 100).toFixed(0)}% accuracy.
        </div>
      )}
    </div>
  )
}

function Grid({ data }: { data: PhonemeAccuracy[] }) {
  const byIpa = new Map(data.map((d) => [d.phoneme, d]))
  return (
    <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
      {PHONEMES.map((p) => {
        const acc = byIpa.get(p.ipa)
        const gop = acc?.gop
        const samples = acc?.samples ?? 0
        const color = gop === undefined
          ? 'bg-canvas-200 text-canvas-500'
          : gop >= 0.75
          ? 'bg-success/30 text-canvas-900'
          : gop >= 0.5
          ? 'bg-warning/30 text-canvas-900'
          : 'bg-danger/30 text-canvas-900'
        return (
          <div key={p.id} className={'rounded-lg p-2 ' + color}>
            <div className="font-mono text-base">{p.ipa}</div>
            <div className="text-[10px] uppercase tracking-wider opacity-70">
              {gop !== undefined ? `${(gop * 100).toFixed(0)}% · n=${samples}` : 'sin datos'}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function List({ title, icon, items }: { title: string; icon: React.ReactNode; items: PhonemeAccuracy[] }) {
  return (
    <div className="rounded-xl border border-canvas-200 bg-canvas-50 p-3">
      <div className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-canvas-500">
        {icon} {title}
      </div>
      <ul className="space-y-1 text-xs">
        {items.map((p) => (
          <li key={p.phoneme} className="flex items-center justify-between">
            <span className="font-mono text-accent-700">{p.phoneme}</span>
            <span className="text-canvas-700">
              {(p.gop * 100).toFixed(0)}% · n={p.samples}
            </span>
          </li>
        ))}
        {items.length === 0 && <li className="text-canvas-500">—</li>}
      </ul>
    </div>
  )
}
