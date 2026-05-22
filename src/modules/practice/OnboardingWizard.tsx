import { useRef, useState } from 'react'
import { ChevronRight, ChevronLeft, Sparkles, Mic, Square, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { ICON_CONTENTS } from './curriculumData'
import { savePrefs } from './practiceDb'
import { Recognizer, isAsrSupported } from '../../shared/speech/WebSpeechRecognition'

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
  const [recordingMode, setRecordingMode] = useState<'self' | 'audio'>('self')
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [audioResult, setAudioResult] = useState<{
    cefr: string
    rationale: string
    fluency?: number
    accent_clarity?: number
  } | null>(null)
  const recRef = useRef<Recognizer | null>(null)

  const next = () => setStep((s) => s + 1)
  const prev = () => setStep((s) => Math.max(0, s - 1))

  const startRecord = () => {
    if (!isAsrSupported()) return
    try {
      const rec = new Recognizer({ lang: 'en-US', continuous: true, interim: true })
      recRef.current = rec
      setTranscript('')
      setAudioResult(null)
      setRecording(true)
      let acc = ''
      rec.onResult((r) => {
        if (r.isFinal) {
          acc += (acc ? ' ' : '') + r.transcript.trim()
          setTranscript(acc)
        } else {
          setTranscript(acc + (acc ? ' ' : '') + r.transcript)
        }
      })
      rec.onError(() => setRecording(false))
      rec.start()
    } catch {
      setRecording(false)
    }
  }

  const stopRecord = async () => {
    recRef.current?.stop()
    setRecording(false)
    if (!transcript.trim()) return
    setAnalyzing(true)
    try {
      const res = await fetch('/api/cefr-from-audio', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ transcript }),
      })
      const data = await res.json()
      setAudioResult(data)
    } finally {
      setAnalyzing(false)
    }
  }

  const finish = async () => {
    await savePrefs({
      onboarded: true,
      daysPerWeek: days,
      minutesPerSession: minutes,
      objective,
      cefrSelfReport: cefrSelf,
      cefrAutoDetect: audioResult?.cefr ?? null,
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
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-canvas-900">¿Cómo está tu inglés ahora?</h2>

            <div className="flex gap-2 border-b border-canvas-200">
              <button
                type="button"
                onClick={() => setRecordingMode('audio')}
                className={clsx(
                  '-mb-px border-b-2 px-3 py-2 text-sm',
                  recordingMode === 'audio'
                    ? 'border-accent-500 text-accent-700'
                    : 'border-transparent text-canvas-500',
                )}
              >
                🎤 Habla 30s (recomendado)
              </button>
              <button
                type="button"
                onClick={() => setRecordingMode('self')}
                className={clsx(
                  '-mb-px border-b-2 px-3 py-2 text-sm',
                  recordingMode === 'self'
                    ? 'border-accent-500 text-accent-700'
                    : 'border-transparent text-canvas-500',
                )}
              >
                Auto-reportar
              </button>
            </div>

            {recordingMode === 'audio' ? (
              <div className="space-y-3">
                <p className="text-xs text-canvas-500">
                  Pulsa "Grabar" y preséntate en inglés durante 30 segundos: nombre, de dónde eres,
                  qué haces, por qué quieres mejorar tu inglés. Claude evalúa tu CEFR real (mucho
                  más preciso que el self-report).
                </p>
                <div className="flex items-center gap-3">
                  {!recording ? (
                    <button
                      type="button"
                      onClick={startRecord}
                      disabled={!isAsrSupported() || analyzing}
                      className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-40"
                    >
                      <Mic className="h-4 w-4" />
                      {analyzing ? 'Analizando…' : 'Grabar 30s'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void stopRecord()}
                      className="inline-flex items-center gap-2 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white"
                    >
                      <Square className="h-4 w-4" /> Parar + evaluar
                    </button>
                  )}
                  {analyzing && <Loader2 className="h-4 w-4 animate-spin text-canvas-500" />}
                </div>
                {transcript && (
                  <div className="rounded-lg bg-canvas-100 p-3 text-sm text-canvas-900">
                    <div className="text-[10px] uppercase tracking-wider text-canvas-500">Tu transcript</div>
                    {transcript}
                  </div>
                )}
                {audioResult && (
                  <div className="rounded-xl border border-accent-500 bg-accent-100/50 p-4">
                    <div className="mb-1 text-[10px] uppercase tracking-wider text-accent-700">
                      Evaluación Claude
                    </div>
                    <div className="font-serif text-3xl text-accent-700">{audioResult.cefr}</div>
                    {(audioResult.fluency !== undefined || audioResult.accent_clarity !== undefined) && (
                      <div className="mt-1 flex gap-3 text-xs text-canvas-700">
                        {audioResult.fluency !== undefined && <span>Fluidez: {audioResult.fluency}/100</span>}
                        {audioResult.accent_clarity !== undefined && <span>Claridad acento: {audioResult.accent_clarity}/100</span>}
                      </div>
                    )}
                    <p className="mt-2 text-xs italic text-canvas-700">{audioResult.rationale}</p>
                    <div className="mt-2 text-[10px] text-canvas-500">
                      Este será tu nivel inicial · el sistema lo refinará usándote.
                    </div>
                  </div>
                )}
                {!isAsrSupported() && (
                  <p className="text-xs text-warning">
                    Tu navegador no soporta Web Speech. Usa Chrome/Edge desktop o cambia a auto-reportar.
                  </p>
                )}
              </div>
            ) : (
              <>
                <p className="text-xs text-canvas-500">
                  Tu auto-percepción. El sistema medirá tu nivel real con el uso.
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
              </>
            )}
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
