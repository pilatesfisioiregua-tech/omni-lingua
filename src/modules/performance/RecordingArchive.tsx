import { useEffect, useRef, useState } from 'react'
import Dexie, { type Table } from 'dexie'
import { Mic, Square, Play, Trash2, Pencil } from 'lucide-react'

type Recording = {
  id?: number
  blob: Blob
  durationS: number
  ts: number
  selfNote: string
  aiCritique: string | null
}

class RecDB extends Dexie {
  recordings!: Table<Recording, number>
  constructor() {
    super('omni-lingua-recordings')
    this.version(1).stores({ recordings: '++id, ts' })
  }
}
const db = new RecDB()

export function RecordingArchive() {
  const [list, setList] = useState<Recording[]>([])
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  const refresh = async () => {
    const all = await db.recordings.orderBy('ts').reverse().toArray()
    setList(all)
  }

  useEffect(() => {
    void refresh()
  }, [])

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const rec = new MediaRecorder(stream)
      recorderRef.current = rec
      chunksRef.current = []
      setSeconds(0)
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data)
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await db.recordings.add({
          blob,
          durationS: seconds,
          ts: Date.now(),
          selfNote: '',
          aiCritique: null,
        })
        await refresh()
      }
      rec.start()
      setRecording(true)
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    } catch {
      // ignore
    }
  }

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    recorderRef.current?.stop()
    setRecording(false)
  }

  const playRec = (r: Recording) => {
    const url = URL.createObjectURL(r.blob)
    const audio = new Audio(url)
    void audio.play()
  }

  const remove = async (id: number) => {
    if (!confirm('¿Eliminar esta grabación?')) return
    await db.recordings.delete(id)
    await refresh()
  }

  const editNote = async (r: Recording) => {
    const note = prompt('Tu autocrítica antes de ver feedback IA:', r.selfNote)
    if (note === null) return
    await db.recordings.update(r.id!, { selfNote: note })
    await refresh()
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
        <h2 className="mb-3 font-serif text-lg text-canvas-900">Grabación + autocrítica</h2>
        <p className="mb-4 text-xs text-canvas-500">
          Anti self-delusion: <strong>primero te auto-evalúas</strong>, luego ves feedback IA. La
          diferencia entre tu auto-percepción y la realidad es donde más aprendes.
        </p>

        <div className="flex items-center gap-3">
          {!recording ? (
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
            >
              <Mic className="h-4 w-4" /> Grabar
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={stop}
                className="inline-flex items-center gap-2 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white"
              >
                <Square className="h-4 w-4" /> Parar
              </button>
              <span className="font-mono text-sm text-canvas-700">{seconds}s</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-canvas-500">
          Tus grabaciones ({list.length})
        </h3>
        {list.length === 0 && (
          <div className="text-xs text-canvas-500">Aún no hay grabaciones.</div>
        )}
        {list.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-lg border border-canvas-200 bg-canvas-50 p-3">
            <button
              type="button"
              onClick={() => playRec(r)}
              className="rounded-full bg-accent-500 p-2 text-white hover:bg-accent-700"
              aria-label="play"
            >
              <Play className="h-4 w-4" />
            </button>
            <div className="flex-1">
              <div className="text-sm text-canvas-900">{new Date(r.ts).toLocaleString()}</div>
              <div className="text-xs text-canvas-500">{r.durationS}s</div>
              {r.selfNote && <div className="mt-1 text-xs italic text-canvas-700">"{r.selfNote}"</div>}
            </div>
            <button
              type="button"
              onClick={() => editNote(r)}
              className="rounded-md border border-canvas-300 bg-canvas-100 p-1 hover:border-accent-300"
              aria-label="note"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => r.id && remove(r.id)}
              className="rounded-md border border-canvas-300 bg-canvas-100 p-1 hover:border-danger"
              aria-label="delete"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-canvas-200 bg-canvas-50 p-4 text-xs text-canvas-500">
        🔒 Grabaciones en IndexedDB local · nunca van al backend. Para feedback IA con Claude
        sería opt-in con confirmación explícita.
      </div>
    </div>
  )
}
