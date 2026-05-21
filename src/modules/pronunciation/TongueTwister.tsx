import { useEffect, useRef, useState } from 'react'
import { Play, Square, Minus, Plus } from 'lucide-react'
import * as Tone from 'tone'
import { speak } from '../../shared/audio/tts'

type Twister = {
  text: string
  ipa: string
  target: string // fonema dominante
  meaningEs: string
}

const TWISTERS: Twister[] = [
  {
    text: 'She sells seashells by the seashore.',
    ipa: '/ʃiː selz ˈsiː.ʃelz baɪ ðə ˈsiː.ʃɔːr/',
    target: '/ʃ/ vs /s/',
    meaningEs: 'Ella vende conchas marinas en la orilla.',
  },
  {
    text: 'Three thin thieves think things through.',
    ipa: '/θriː θɪn θiːvz θɪŋk θɪŋz θruː/',
    target: '/θ/',
    meaningEs: 'Tres ladrones delgados piensan las cosas a fondo.',
  },
  {
    text: 'Red lorry, yellow lorry.',
    ipa: '/red ˈlɒr.i ˈjel.oʊ ˈlɒr.i/',
    target: '/r/ + /l/',
    meaningEs: 'Camión rojo, camión amarillo.',
  },
  {
    text: 'How can a clam cram in a clean cream can?',
    ipa: '/haʊ kən ə klæm kræm ɪn ə kliːn kriːm kæn/',
    target: '/æ/ vs /iː/',
    meaningEs: 'Cómo puede una almeja meterse en una lata limpia de crema.',
  },
  {
    text: 'A big black bug bit a big black bear.',
    ipa: '/ə bɪɡ blæk bʌɡ bɪt ə bɪɡ blæk bɛər/',
    target: '/ɪ/ vs /æ/ vs /ʌ/',
    meaningEs: 'Un gran insecto negro mordió a un gran oso negro.',
  },
]

export function TongueTwister() {
  const [idx, setIdx] = useState(0)
  const [bpm, setBpm] = useState(80)
  const [playing, setPlaying] = useState(false)
  const [beat, setBeat] = useState(0)
  const beatRef = useRef(0)
  const synthRef = useRef<Tone.MembraneSynth | null>(null)
  const loopRef = useRef<Tone.Loop | null>(null)

  const current = TWISTERS[idx]

  useEffect(() => {
    return () => {
      if (loopRef.current) loopRef.current.dispose()
      if (synthRef.current) synthRef.current.dispose()
    }
  }, [])

  const start = async () => {
    await Tone.start()
    Tone.Transport.bpm.value = bpm
    if (!synthRef.current) synthRef.current = new Tone.MembraneSynth().toDestination()
    if (loopRef.current) loopRef.current.dispose()
    beatRef.current = 0
    setBeat(0)
    loopRef.current = new Tone.Loop((time) => {
      const b = beatRef.current % 4
      const note = b === 0 ? 'C3' : 'C2'
      synthRef.current?.triggerAttackRelease(note, '8n', time)
      setBeat(beatRef.current)
      beatRef.current += 1
    }, '4n').start(0)
    Tone.Transport.start()
    setPlaying(true)
  }

  const stop = () => {
    Tone.Transport.stop()
    if (loopRef.current) loopRef.current.dispose()
    loopRef.current = null
    beatRef.current = 0
    setBeat(0)
    setPlaying(false)
  }

  const adjBpm = (delta: number) => {
    const next = Math.max(40, Math.min(200, bpm + delta))
    setBpm(next)
    if (playing) Tone.Transport.bpm.value = next
  }

  const playReference = async () => {
    try {
      await speak(current.text, { lang: 'en-US', rate: 0.85 })
    } catch (e) {
      console.warn(e)
    }
  }

  const next = () => {
    if (playing) stop()
    setIdx((i) => (i + 1) % TWISTERS.length)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-canvas-200 bg-canvas-50 p-6">
        <div className="mb-3 flex items-center justify-between text-xs text-canvas-500">
          <span>
            {idx + 1} / {TWISTERS.length}
          </span>
          <span className="rounded bg-canvas-200 px-2 py-0.5 font-mono text-canvas-700">
            target: {current.target}
          </span>
        </div>

        <p className="mb-2 font-serif text-2xl leading-relaxed text-canvas-900">{current.text}</p>
        <p className="mb-1 text-sm font-mono text-canvas-500">{current.ipa}</p>
        <p className="mb-5 text-sm italic text-canvas-700">{current.meaningEs}</p>

        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={playReference}
            className="inline-flex items-center gap-1 rounded-md border border-canvas-300 bg-canvas-100 px-3 py-1 text-xs hover:border-accent-300 hover:bg-accent-100 hover:text-accent-700"
          >
            🔊 Escuchar referencia
          </button>
        </div>

        <div className="flex items-center gap-3 border-t border-canvas-200 pt-4">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => adjBpm(-5)}
              className="rounded-md border border-canvas-300 bg-canvas-100 p-1 hover:bg-canvas-200"
            >
              <Minus className="h-3 w-3" />
            </button>
            <div className="min-w-[80px] text-center font-mono text-lg text-canvas-900">{bpm} bpm</div>
            <button
              type="button"
              onClick={() => adjBpm(5)}
              className="rounded-md border border-canvas-300 bg-canvas-100 p-1 hover:bg-canvas-200"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {!playing ? (
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
            >
              <Play className="h-4 w-4" /> Empezar
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

          <button
            type="button"
            onClick={next}
            className="ml-auto inline-flex items-center gap-1 rounded-md border border-canvas-300 bg-canvas-100 px-3 py-1 text-xs hover:border-accent-300"
          >
            Siguiente →
          </button>
        </div>

        {playing && (
          <div className="mt-4 flex items-center gap-2">
            {[0, 1, 2, 3].map((b) => (
              <div
                key={b}
                className={
                  'h-3 w-3 rounded-full transition ' +
                  (b === beat % 4 ? 'scale-125 bg-accent-500' : 'bg-canvas-300')
                }
              />
            ))}
            <span className="ml-2 text-xs text-canvas-500">beat {(beat % 4) + 1} / 4</span>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-canvas-200 bg-canvas-50 p-4 text-xs text-canvas-500">
        💡 Tip: empieza a 60-70 bpm. Sube 5 bpm cuando puedas decirlo 3 veces seguidas sin
        trabarte. Las primeras veces lee, luego intenta de memoria.
      </div>
    </div>
  )
}
