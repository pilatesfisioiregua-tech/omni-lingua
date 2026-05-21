import { useEffect, useRef, useState } from 'react'
import { Mic, Square, AlertCircle } from 'lucide-react'
import { Recognizer, isAsrSupported } from '../../shared/speech/WebSpeechRecognition'

export function LiveTranscriber() {
  const [active, setActive] = useState(false)
  const [finals, setFinals] = useState<string[]>([])
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recRef = useRef<Recognizer | null>(null)

  useEffect(() => () => recRef.current?.abort(), [])

  const start = () => {
    if (!isAsrSupported()) {
      setError('Tu navegador no soporta SpeechRecognition. Prueba Chrome o Edge en desktop.')
      return
    }
    try {
      const rec = new Recognizer({ lang: 'en-US', continuous: true, interim: true })
      recRef.current = rec
      setFinals([])
      setInterim('')
      setError(null)
      rec.onResult((r) => {
        if (r.isFinal) {
          setFinals((prev) => [...prev, r.transcript.trim()])
          setInterim('')
        } else {
          setInterim(r.transcript)
        }
      })
      rec.onError((msg) => {
        setError('Error ASR: ' + msg)
        setActive(false)
      })
      rec.start()
      setActive(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'asr_error')
    }
  }

  const stop = () => {
    recRef.current?.stop()
    recRef.current = null
    setActive(false)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-6">
        <p className="mb-4 text-sm text-canvas-700">
          Habla en inglés y verás la transcripción en tiempo real. Si el reconocedor difiere de lo
          que crees haber dicho, ahí está tu error de producción real.
        </p>

        <div className="mb-4">
          {!active ? (
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
            >
              <Mic className="h-4 w-4" /> Empezar
            </button>
          ) : (
            <button
              type="button"
              onClick={stop}
              className="inline-flex items-center gap-2 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white"
            >
              <Square className="h-4 w-4" /> Parar
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-md border-l-2 border-danger bg-danger/5 px-3 py-2 text-xs text-canvas-700">
            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-danger" />
            <span>{error}</span>
          </div>
        )}

        <div className="min-h-[200px] rounded-lg bg-canvas-100 p-4 text-base leading-relaxed">
          {finals.length === 0 && !interim && (
            <span className="text-canvas-500">Lo que digas aparecerá aquí…</span>
          )}
          {finals.map((f, i) => (
            <p key={i} className="mb-2 text-canvas-900">
              {f}
            </p>
          ))}
          {interim && <p className="italic text-canvas-500">{interim}…</p>}
        </div>

        {finals.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setFinals([])
              setInterim('')
            }}
            className="mt-3 text-xs text-canvas-500 hover:text-canvas-900"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="rounded-lg border border-canvas-200 bg-canvas-50 p-4 text-xs text-canvas-500">
        💡 Si dices "I have 30 years" y la app transcribe correctamente esa frase, sabes que la
        pronunciaste bien pero el inglés es incorrecto. Para errores como ese tienes el módulo
        Conversación (F4.6) con Linguistic Mirror.
      </div>
    </div>
  )
}
