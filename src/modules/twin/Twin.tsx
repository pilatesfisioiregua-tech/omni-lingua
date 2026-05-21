import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Database, Brain, Mic, BookOpen, Languages } from 'lucide-react'
import { getTwinContext, type TwinContext } from '../../shared/twin/twinContext'

export function Twin() {
  const [ctx, setCtx] = useState<TwinContext | null>(null)

  useEffect(() => {
    void getTwinContext().then(setCtx)
  }, [])

  if (!ctx) {
    return <div className="py-8 text-sm text-canvas-500">Cargando Twin…</div>
  }

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-canvas-900"
      >
        <ArrowLeft className="h-3 w-3" /> volver
      </Link>

      <header className="space-y-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-accent-300 bg-accent-100 px-3 py-1 text-xs text-accent-700">
          <Sparkles className="h-3 w-3" /> Diferenciador #1 · módulo fundacional
        </span>
        <h1 className="font-serif text-3xl text-canvas-900">Language Twin</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-canvas-700">
          Tu inglés modelado en un vector único: errores recurrentes, vocabulario activo medido
          (no expuesto), accuracy por fonema e interferencias del español. Alimenta al Coach, al
          Conversation Partner y al Scheduler como contexto primario. Privacy first · vive en tu
          navegador, nunca al backend.
        </p>
      </header>

      {!ctx.hasData && (
        <div className="rounded-xl border border-canvas-200 bg-canvas-50 p-5 text-sm text-canvas-700">
          <div className="mb-2 flex items-center gap-2 font-medium text-canvas-900">
            <Database className="h-4 w-4 text-canvas-500" /> Sin datos aún
          </div>
          <p>
            Cuando empieces a usar Pronunciación, Vocabulario o Listening, el Twin se irá
            construyendo automáticamente. Cada interacción refina el modelo: 5-10 sesiones bastan
            para tener un perfil útil.
          </p>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card
          icon={<Brain className="h-4 w-4" />}
          title="CEFR efectivo"
          value={ctx.effectiveCefr ?? '—'}
          hint="medido por uso, no aspiracional"
        />
        <Card
          icon={<BookOpen className="h-4 w-4" />}
          title="Vocab activo medido"
          value={ctx.activeVocabCount.toString()}
          hint="palabras que has PRODUCIDO al menos 1 vez"
        />
        <Card
          icon={<Mic className="h-4 w-4" />}
          title="Fonemas débiles"
          value={ctx.weakPhonemes.length.toString()}
          hint="alimenta Phonetic Distance Map (Fase 4.9)"
        />
        <Card
          icon={<Languages className="h-4 w-4" />}
          title="Interferencias ES"
          value={ctx.topInterferencesES.length.toString()}
          hint="patrones del español que se cuelan en tu inglés"
        />
      </section>

      <section className="rounded-xl border border-canvas-200 bg-canvas-50 p-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-canvas-500">
          Anclaje científico
        </h2>
        <ul className="space-y-1.5 text-sm text-canvas-700">
          <li>· User Modeling for SLA · Mizumoto 2024</li>
          <li>· Bilingual Interactive Activation Plus (BIA+) · Dijkstra 2018</li>
          <li>· Goodness of Pronunciation · Witt 2000 · wav2vec2 era Lin 2023</li>
          <li>· Contrastive analysis renaissance · Cummins 1979</li>
        </ul>
      </section>
    </div>
  )
}

function Card({
  icon,
  title,
  value,
  hint,
}: {
  icon: React.ReactNode
  title: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-xl border border-canvas-200 bg-canvas-50 p-4">
      <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-canvas-500">
        {icon} {title}
      </div>
      <div className="font-serif text-3xl text-canvas-900">{value}</div>
      <div className="mt-1 text-[11px] text-canvas-500">{hint}</div>
    </div>
  )
}
