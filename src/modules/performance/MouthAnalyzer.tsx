import { useEffect, useRef, useState } from 'react'
import { Camera, CameraOff, AlertCircle, Info } from 'lucide-react'

type LipMetrics = {
  open: number // 0-1
  width: number // 0-1
  symmetry: number // 0-1
}

const TIPS_PHONEME: Record<string, string> = {
  'θ': 'Saca la lengua entre los dientes. Debe verse un poco. Sin vibración.',
  'ð': 'Igual que /θ/ pero con vibración garganta. Toca tu cuello para sentir.',
  'r': 'Lengua curvada hacia atrás (retroflexa). NO vibrar como en español.',
  'v': 'Dientes superiores tocan labio inferior. Vibración.',
  'ɪ': 'Labios menos tensos que /iː/. Menos sonrisa.',
  'iː': 'Sonríe ligeramente. Vocal larga y tensa.',
  'æ': 'Boca abierta · vibrante · entre /a/ y /e/.',
  'ʊ': 'Labios menos redondeados que /uː/.',
  'ə': 'Boca relajada total · neutro · "uh".',
}

export function MouthAnalyzer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [target, setTarget] = useState<string>('θ')
  const [metrics, setMetrics] = useState<LipMetrics | null>(null)
  const rafRef = useRef<number | null>(null)
  const landmarkerRef = useRef<unknown>(null)

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const stream = videoRef.current?.srcObject as MediaStream | null
    stream?.getTracks().forEach((t) => t.stop())
  }, [])

  const start = async () => {
    setError(null)
    try {
      // Lazy load MediaPipe
      const { FilesetResolver, FaceLandmarker } = await import('@mediapipe/tasks-vision')
      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm',
      )
      const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
      })
      landmarkerRef.current = faceLandmarker

      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640 } })
      const video = videoRef.current
      if (!video) return
      video.srcObject = stream
      await video.play()
      setStreaming(true)

      const loop = () => {
        if (!videoRef.current || !landmarkerRef.current) return
        const ts = performance.now()
        try {
          const res = (landmarkerRef.current as { detectForVideo: (v: HTMLVideoElement, ts: number) => { faceLandmarks: { x: number; y: number }[][] } })
            .detectForVideo(videoRef.current, ts)
          if (res.faceLandmarks && res.faceLandmarks[0]) {
            const m = computeLipMetrics(res.faceLandmarks[0])
            setMetrics(m)
            drawOverlay(res.faceLandmarks[0])
          }
        } catch {
          // ignore frame errors
        }
        rafRef.current = requestAnimationFrame(loop)
      }
      loop()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'mouth_analyzer_error')
      setStreaming(false)
    }
  }

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    const stream = videoRef.current?.srcObject as MediaStream | null
    stream?.getTracks().forEach((t) => t.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    setStreaming(false)
    setMetrics(null)
  }

  const drawOverlay = (lm: { x: number; y: number }[]) => {
    const c = canvasRef.current
    const v = videoRef.current
    if (!c || !v) return
    c.width = v.videoWidth
    c.height = v.videoHeight
    const ctx = c.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, c.width, c.height)
    // Lip landmarks indexes en MediaPipe FaceMesh (outer + inner lips)
    const lipIdx = [
      // outer
      61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95,
      // inner
      78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308,
    ]
    ctx.fillStyle = '#CC785C'
    for (const i of lipIdx) {
      const p = lm[i]
      if (p) ctx.fillRect(p.x * c.width, p.y * c.height, 2, 2)
    }
  }

  const guidance = (() => {
    if (!metrics) return null
    if (target === 'θ' || target === 'ð') {
      if (metrics.open < 0.15) return '⚠️ Abre un poco más la boca · lengua debe verse'
      if (metrics.open > 0.4) return '⚠️ Boca demasiado abierta · cierra ligeramente'
      return '✓ Apertura adecuada para /θ/-/ð/'
    }
    if (target === 'iː') {
      if (metrics.width < 0.5) return '⚠️ Sonríe más · labios horizontales'
      return '✓ Labios horizontales OK'
    }
    if (target === 'ʊ' || target === 'uː') {
      if (metrics.width > 0.4) return '⚠️ Redondea labios · menos sonrisa'
      return '✓ Labios redondeados OK'
    }
    return null
  })()

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg text-canvas-900">Análisis de labios · MediaPipe</h2>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="rounded-md border border-canvas-300 bg-canvas-50 px-2 py-1 text-xs"
          >
            <option value="θ">/θ/ think</option>
            <option value="ð">/ð/ this</option>
            <option value="r">/r/ red</option>
            <option value="v">/v/ very</option>
            <option value="ɪ">/ɪ/ ship</option>
            <option value="iː">/iː/ sheep</option>
            <option value="æ">/æ/ cat</option>
            <option value="ʊ">/ʊ/ book</option>
            <option value="ə">/ə/ schwa</option>
          </select>
        </div>

        <div className="mb-3 rounded-md border-l-2 border-accent-500 bg-accent-100/30 px-3 py-2 text-xs text-canvas-700">
          <Info className="mb-1 inline h-3 w-3" /> <strong>{target}:</strong> {TIPS_PHONEME[target]}
        </div>

        <div className="relative aspect-video overflow-hidden rounded-lg bg-canvas-900">
          <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
          <canvas ref={canvasRef} className="absolute left-0 top-0 h-full w-full" />
        </div>

        <div className="mt-3 flex items-center gap-3">
          {!streaming ? (
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
            >
              <Camera className="h-4 w-4" /> Activar cámara
            </button>
          ) : (
            <button
              type="button"
              onClick={stop}
              className="inline-flex items-center gap-2 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white"
            >
              <CameraOff className="h-4 w-4" /> Parar
            </button>
          )}
          {guidance && (
            <span className={'text-sm ' + (guidance.startsWith('✓') ? 'text-success' : 'text-warning')}>
              {guidance}
            </span>
          )}
        </div>

        {metrics && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
            <div className="rounded bg-canvas-100 p-2">
              <div className="text-canvas-500">Apertura</div>
              <div className="font-mono text-canvas-900">{(metrics.open * 100).toFixed(0)}%</div>
            </div>
            <div className="rounded bg-canvas-100 p-2">
              <div className="text-canvas-500">Anchura labios</div>
              <div className="font-mono text-canvas-900">{(metrics.width * 100).toFixed(0)}%</div>
            </div>
            <div className="rounded bg-canvas-100 p-2">
              <div className="text-canvas-500">Simetría</div>
              <div className="font-mono text-canvas-900">{(metrics.symmetry * 100).toFixed(0)}%</div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-md border-l-2 border-danger bg-danger/5 px-3 py-2 text-xs text-canvas-700">
            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-danger" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-canvas-200 bg-canvas-50 p-4 text-xs text-canvas-500">
        🧠 Anclaje: Macedonia 2014 embodied cognition · gesto y articulación facilitan retención
        fonológica. Procesamiento 100% cliente · video NUNCA al backend.
      </div>
    </div>
  )
}

function computeLipMetrics(lm: { x: number; y: number }[]): LipMetrics {
  // MediaPipe Face Landmarker · puntos clave labios
  const upperOuter = lm[13] // upper lip outer
  const lowerOuter = lm[14] // lower lip outer
  const leftCorner = lm[61]
  const rightCorner = lm[291]
  const noseTip = lm[1]
  if (!upperOuter || !lowerOuter || !leftCorner || !rightCorner || !noseTip) {
    return { open: 0, width: 0, symmetry: 0 }
  }
  const open = Math.min(1, Math.abs(lowerOuter.y - upperOuter.y) * 10)
  const width = Math.min(1, Math.abs(rightCorner.x - leftCorner.x) * 3)
  const midX = (leftCorner.x + rightCorner.x) / 2
  const symmetry = 1 - Math.min(1, Math.abs(midX - noseTip.x) * 10)
  return { open, width, symmetry }
}
