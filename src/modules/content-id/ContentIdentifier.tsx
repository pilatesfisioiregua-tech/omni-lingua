import { useRef, useState } from 'react'
import { Mic, Square, Loader2, AlertCircle, Check } from 'lucide-react'

type Props = {
  onIdentified: (title: string, transcript: string) => void
}

type Phase = 'idle' | 'recording' | 'sending' | 'identifying' | 'transcribing' | 'done' | 'error'

export function ContentIdentifier({ onIdentified }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [seconds, setSeconds] = useState(0)
  const [result, setResult] = useState<{ title: string; transcript: string; source: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  const start = async () => {
    try {
      setError(null)
      setResult(null)
      setSeconds(0)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const rec = new MediaRecorder(stream)
      recorderRef.current = rec
      chunksRef.current = []
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data)
      rec.onstop = () => stream.getTracks().forEach((t) => t.stop())
      rec.start(1000)
      setPhase('recording')
      timerRef.current = window.setInterval(() => {
        setSeconds((s) => {
          if (s >= 15) {
            stop()
            return 15
          }
          return s + 1
        })
      }, 1000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'mic_error')
      setPhase('error')
    }
  }

  const stop = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    const rec = recorderRef.current
    if (!rec) return
    rec.stop()
    await new Promise((r) => setTimeout(r, 200))
    setPhase('sending')
    try {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const fd = new FormData()
      fd.append('audio', blob, 'sample.webm')

      setPhase('identifying')
      const idRes = await fetch('/api/identify-content', { method: 'POST', body: fd })
      const idData = await idRes.json().catch(() => ({}))
      let title = ''
      let transcript = ''
      let source = 'demo'

      if (idData.matched && idData.title) {
        title = idData.title
        transcript = idData.lyrics ?? ''
        source = 'acrcloud'
      }

      if (!transcript) {
        setPhase('transcribing')
        const trRes = await fetch('/api/transcribe', { method: 'POST', body: fd })
        const trData = await trRes.json().catch(() => ({}))
        transcript = trData.transcript ?? ''
        if (!title) title = trData.title ?? 'Audio capturado'
        if (trData.demo) source = 'demo'
      }

      if (!transcript) {
        transcript = 'Modo demo · sin Modal/ACRCloud configurado. Aquí va una transcripción de ejemplo: "Yesterday I went to the library to read a book about the history of music."'
        title = title || 'Audio capturado (demo)'
        source = 'demo-fallback'
      }

      setResult({ title, transcript, source })
      setPhase('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'fetch_error')
      setPhase('error')
    }
  }

  const open = () => result && onIdentified(result.title, result.transcript)

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-6">
        <p className="mb-4 text-sm text-canvas-700">
          Pon a sonar una canción, podcast o escena (en inglés) y captura 15 segundos.
        </p>

        <div className="mb-4 flex items-center gap-3">
          {phase === 'idle' || phase === 'done' || phase === 'error' ? (
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
            >
              <Mic className="h-4 w-4" /> Empezar captura
            </button>
          ) : phase === 'recording' ? (
            <>
              <button
                type="button"
                onClick={stop}
                className="inline-flex items-center gap-2 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white"
              >
                <Square className="h-4 w-4" /> Parar
              </button>
              <span className="font-mono text-sm text-canvas-700">{seconds}s / 15s</span>
              <div className="h-2 w-32 overflow-hidden rounded-full bg-canvas-200">
                <div className="h-2 bg-accent-500 transition-all" style={{ width: `${(seconds / 15) * 100}%` }} />
              </div>
            </>
          ) : (
            <div className="inline-flex items-center gap-2 text-sm text-canvas-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              {phase === 'sending' && 'Enviando…'}
              {phase === 'identifying' && 'Identificando con ACRCloud…'}
              {phase === 'transcribing' && 'Transcribiendo con Whisper…'}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-md border-l-2 border-danger bg-danger/5 px-3 py-2 text-xs text-canvas-700">
            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-danger" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="space-y-3 rounded-lg border border-success/30 bg-success/5 p-4">
            <div className="flex items-center gap-2 text-success">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Contenido identificado</span>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-canvas-500">Título</div>
              <div className="font-serif text-lg text-canvas-900">{result.title}</div>
              <div className="text-[10px] uppercase tracking-wider text-canvas-500">fuente: {result.source}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-canvas-500">Preview transcript</div>
              <div className="line-clamp-3 text-sm text-canvas-700">{result.transcript}</div>
            </div>
            <button
              type="button"
              onClick={open}
              className="inline-flex items-center gap-1 rounded-md bg-accent-500 px-3 py-1 text-xs text-white hover:bg-accent-700"
            >
              Abrir TranscriptViewer →
            </button>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-canvas-200 bg-canvas-50 p-4 text-xs text-canvas-500">
        💡 Privacy first · audio se procesa via ACRCloud (15s aislados) o Modal Whisper. NUNCA queda
        almacenado. Sin keys configuradas: modo demo con transcript de ejemplo.
      </div>
    </div>
  )
}
