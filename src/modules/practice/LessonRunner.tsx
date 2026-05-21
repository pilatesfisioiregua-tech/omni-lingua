import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Frown } from 'lucide-react'
import type { Lesson, LessonStep } from './curriculumData'
import { rateSkill, recordLessonComplete } from './practiceDb'
import { recordInterferenceES } from '../../shared/twin/twinAggregator'

type Props = {
  lesson: Lesson
  onExit: () => void
  onFrustrated: () => void
}

export function LessonRunner({ lesson, onExit, onFrustrated }: Props) {
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState(false)
  const [selfRate, setSelfRate] = useState<number | null>(null)
  const startedAtRef = useRef(Date.now())
  const step = lesson.steps[idx]

  const next = () => {
    if (idx < lesson.steps.length - 1) setIdx(idx + 1)
    else setDone(true)
  }
  const prev = () => idx > 0 && setIdx(idx - 1)

  useEffect(() => {
    startedAtRef.current = Date.now()
  }, [])

  const submit = async (rate: number) => {
    setSelfRate(rate)
    const duration = Math.round((Date.now() - startedAtRef.current) / 1000)
    const graduated = rate >= 3
    // Persistir
    for (const skillId of lesson.skillIds) {
      await rateSkill(skillId, Math.max(0, Math.min(4, rate)) as 0 | 1 | 2 | 3 | 4)
    }
    await recordLessonComplete(lesson.id, rate, duration, graduated)
  }

  if (done && selfRate !== null) {
    return (
      <div className="space-y-4 rounded-2xl border border-canvas-200 bg-canvas-50 p-6">
        <CheckCircle2 className="h-8 w-8 text-success" />
        <h2 className="font-serif text-2xl text-canvas-900">Lección completada</h2>
        <p className="text-sm text-canvas-700">
          Self-rate: {selfRate}/4 ·{' '}
          {selfRate >= 3 ? 'Graduada · entra a FSRS' : 'No graduada · vuelve a aparecer pronto.'}
        </p>
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-1 rounded-md bg-accent-500 px-4 py-2 text-sm text-white hover:bg-accent-700"
        >
          Volver al dashboard
        </button>
      </div>
    )
  }

  if (done) {
    return <SelfRate onSubmit={submit} />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onExit} className="text-xs text-canvas-500 hover:text-canvas-900">
          ← Salir
        </button>
        <span className="text-xs text-canvas-500">
          {idx + 1} / {lesson.steps.length}
        </span>
        <button
          type="button"
          onClick={onFrustrated}
          className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-danger"
        >
          <Frown className="h-3 w-3" /> estoy frustrado
        </button>
      </div>

      <header>
        <h1 className="font-serif text-2xl text-canvas-900">{lesson.title}</h1>
      </header>

      <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
        <StepRender step={step} />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          disabled={idx === 0}
          className="inline-flex items-center gap-1 rounded-md border border-canvas-300 bg-canvas-50 px-3 py-1 text-xs hover:border-accent-300 disabled:opacity-40"
        >
          <ArrowLeft className="h-3 w-3" /> Anterior
        </button>
        <button
          type="button"
          onClick={next}
          className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm text-white hover:bg-accent-700"
        >
          {idx === lesson.steps.length - 1 ? 'Terminar' : 'Siguiente'} <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

function StepRender({ step }: { step: LessonStep }) {
  if (step.type === 'intro') {
    return <Markdown text={step.markdown} />
  }
  if (step.type === 'demo') {
    return (
      <div className="space-y-3">
        <Markdown text={step.markdown} />
        <div className="rounded-lg bg-canvas-100 p-3">
          <div className="font-serif text-lg text-canvas-900">{step.example.en}</div>
          {step.example.ipa && <div className="font-mono text-xs text-canvas-500">{step.example.ipa}</div>}
          <div className="mt-1 text-sm italic text-canvas-700">{step.example.es}</div>
        </div>
      </div>
    )
  }
  if (step.type === 'guided') {
    return <GuidedStep prompt={step.prompt} expected={step.expected} />
  }
  if (step.type === 'application') {
    return (
      <div className="space-y-2">
        <p className="text-sm text-canvas-900">{step.prompt}</p>
        <p className="text-xs text-canvas-500">💡 {step.hint}</p>
        <textarea
          rows={3}
          placeholder="Escribe aquí tu intento…"
          className="w-full rounded-md border border-canvas-200 bg-canvas-50 px-3 py-2 text-sm text-canvas-900"
        />
      </div>
    )
  }
  if (step.type === 'self_rate') {
    return <p className="text-sm text-canvas-700">A continuación valorarás cómo te ha ido.</p>
  }
  if (step.type === 'writing') {
    return <WritingStep prompt={step.prompt} sampleAnswer={step.sampleAnswer} />
  }
  if (step.type === 'es_en_drill') {
    return <EsEnDrill pairs={step.pairs} />
  }
  return null
}

function Markdown({ text }: { text: string }) {
  // simple markdown · bold + lists + paragraphs
  const lines = text.split('\n')
  return (
    <div className="space-y-2 text-sm leading-relaxed text-canvas-700">
      {lines.map((line, i) => {
        if (line.startsWith('- ')) {
          return (
            <li key={i} className="ml-4 list-disc">
              <InlineMd text={line.slice(2)} />
            </li>
          )
        }
        if (line.trim() === '') return <div key={i} className="h-1" />
        return (
          <p key={i}>
            <InlineMd text={line} />
          </p>
        )
      })}
    </div>
  )
}

function InlineMd({ text }: { text: string }) {
  // bold **x**
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i} className="font-semibold text-canvas-900">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

function GuidedStep({ prompt, expected }: { prompt: string; expected: string }) {
  const [val, setVal] = useState('')
  const [reveal, setReveal] = useState(false)
  const ok = val.trim().toLowerCase() === expected.toLowerCase()
  return (
    <div className="space-y-3">
      <p className="text-sm text-canvas-900">{prompt}</p>
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Tu respuesta"
        className="w-48 rounded-md border border-canvas-200 bg-canvas-50 px-3 py-1 text-sm"
      />
      {val && (
        <div className="text-sm">
          {ok ? (
            <span className="text-success">✓ Correcto · {expected}</span>
          ) : (
            <span className="text-warning">Sigue intentando…</span>
          )}
        </div>
      )}
      {!ok && val && (
        <button
          type="button"
          onClick={() => setReveal(!reveal)}
          className="text-xs text-canvas-500 hover:text-canvas-900"
        >
          {reveal ? 'Ocultar' : 'Ver respuesta'}
        </button>
      )}
      {reveal && <div className="text-xs text-canvas-500">→ {expected}</div>}
    </div>
  )
}

function WritingStep({ prompt, sampleAnswer }: { prompt: string; sampleAnswer: string }) {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const wordCount = text.split(/\s+/).filter(Boolean).length
  return (
    <div className="space-y-3">
      <p className="text-sm text-canvas-900">{prompt}</p>
      <textarea
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe libremente…"
        className="w-full rounded-md border border-canvas-200 bg-canvas-50 px-3 py-2 text-sm text-canvas-900"
      />
      <div className="flex items-center justify-between text-xs text-canvas-500">
        <span>{wordCount} palabras</span>
        {!submitted ? (
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={text.length < 10}
            className="rounded-md bg-accent-500 px-3 py-1 text-white hover:bg-accent-700 disabled:opacity-40"
          >
            Enviar para feedback
          </button>
        ) : (
          <span className="text-success">✓ Enviado</span>
        )}
      </div>
      {submitted && (
        <div className="space-y-2 rounded-lg border border-canvas-200 bg-canvas-100 p-3 text-sm">
          <div className="text-xs uppercase tracking-wider text-canvas-500">
            Diferenciador #6 · Write→AI→Diff→Retry
          </div>
          <p className="text-canvas-700">
            En modo demo el feedback IA no está activo. Con ANTHROPIC_API_KEY el endpoint{' '}
            <code className="rounded bg-canvas-200 px-1">/api/correct-writing</code> devolverá un
            diff línea-por-línea con explicación pedagógica + extracción de errores para FSRS.
          </p>
          <details className="text-xs text-canvas-500">
            <summary className="cursor-pointer">Ver respuesta de ejemplo</summary>
            <p className="mt-2 italic">{sampleAnswer}</p>
          </details>
        </div>
      )}
    </div>
  )
}

function EsEnDrill({ pairs }: { pairs: { es: string; en: string; tag: string; warning?: string }[] }) {
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const p = pairs[idx]

  const next = async () => {
    await recordInterferenceES(p.tag, p.es, p.en, p.tag)
    setIdx((i) => (i + 1) % pairs.length)
    setRevealed(false)
  }

  return (
    <div className="space-y-3">
      <div className="text-xs uppercase tracking-wider text-canvas-500">
        ES→EN contrast · {idx + 1}/{pairs.length}
      </div>
      <div className="rounded-lg bg-canvas-100 p-3">
        <div className="text-xs text-canvas-500">En español</div>
        <div className="font-serif text-lg text-canvas-900">{p.es}</div>
      </div>
      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm text-white hover:bg-accent-700"
        >
          ¿Cómo lo dirías en inglés?
        </button>
      ) : (
        <>
          <div className="rounded-lg border border-success/30 bg-success/5 p-3">
            <div className="text-xs uppercase tracking-wider text-success">En inglés</div>
            <div className="font-serif text-lg text-canvas-900">{p.en}</div>
          </div>
          {p.warning && (
            <div className="rounded-md border-l-2 border-danger bg-danger/5 px-2 py-1 text-[11px] text-canvas-700">
              {p.warning}
            </div>
          )}
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-1 rounded-md border border-canvas-300 bg-canvas-50 px-3 py-1 text-xs hover:border-accent-300"
          >
            Siguiente →
          </button>
        </>
      )}
    </div>
  )
}

function SelfRate({ onSubmit }: { onSubmit: (r: number) => void }) {
  const opts = [
    { rate: 0, label: 'Ni idea', emoji: '😶' },
    { rate: 1, label: 'Mal', emoji: '😟' },
    { rate: 2, label: 'Regular', emoji: '😐' },
    { rate: 3, label: 'Bien', emoji: '🙂' },
    { rate: 4, label: 'Perfecto', emoji: '🤩' },
  ]
  return (
    <div className="space-y-4 rounded-2xl border border-canvas-200 bg-canvas-50 p-6">
      <h2 className="font-serif text-xl text-canvas-900">¿Cómo te ha ido?</h2>
      <p className="text-xs text-canvas-500">
        Honestidad &gt; aspiración. Tu rating modula el próximo intervalo FSRS.
      </p>
      <div className="grid grid-cols-5 gap-2">
        {opts.map((o) => (
          <button
            key={o.rate}
            type="button"
            onClick={() => onSubmit(o.rate)}
            className="flex flex-col items-center gap-1 rounded-lg border border-canvas-200 bg-canvas-50 p-3 text-xs hover:border-accent-300"
          >
            <span className="text-2xl">{o.emoji}</span>
            <span className="text-canvas-700">{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
