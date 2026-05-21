import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mic, Music, BookOpen } from 'lucide-react'
import { clsx } from 'clsx'
import { PhonemeTrainer } from './PhonemeTrainer'
import { TongueTwister } from './TongueTwister'
import { PHONEME_PRESETS } from '../../shared/ipa/phonemes'

type Mode = 'phonemes' | 'twister'

export function Pronunciation() {
  const [mode, setMode] = useState<Mode>('phonemes')
  const [presetId, setPresetId] = useState<string>(PHONEME_PRESETS[0].id)

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-canvas-900"
      >
        <ArrowLeft className="h-3 w-3" /> volver
      </Link>

      <header className="space-y-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-accent-300 bg-accent-100 px-3 py-1 text-xs text-accent-700">
          <Mic className="h-3 w-3" /> Fase 1 · Pronunciación
        </span>
        <h1 className="font-serif text-3xl text-canvas-900">Entrena tu pronunciación</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-canvas-700">
          Fonemas IPA con contraste explícito al español. Tongue twisters con metrónomo Tone.js.
          Cada intento alimenta tu Language Twin (datos GOP per phoneme) y el futuro Phonetic
          Distance Map.
        </p>
      </header>

      <div className="flex gap-2 border-b border-canvas-200">
        <ModeButton active={mode === 'phonemes'} onClick={() => setMode('phonemes')} icon={<BookOpen className="h-3.5 w-3.5" />}>
          Fonemas IPA
        </ModeButton>
        <ModeButton active={mode === 'twister'} onClick={() => setMode('twister')} icon={<Music className="h-3.5 w-3.5" />}>
          Tongue twisters
        </ModeButton>
      </div>

      {mode === 'phonemes' && (
        <>
          <div className="flex flex-wrap gap-2">
            {PHONEME_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPresetId(p.id)}
                className={clsx(
                  'rounded-full border px-3 py-1 text-xs transition',
                  presetId === p.id
                    ? 'border-accent-500 bg-accent-500 text-white'
                    : 'border-canvas-300 bg-canvas-50 text-canvas-700 hover:border-accent-300',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <PhonemeTrainer presetId={presetId} />
        </>
      )}

      {mode === 'twister' && <TongueTwister />}
    </div>
  )
}

function ModeButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        '-mb-px flex items-center gap-1 border-b-2 px-3 py-2 text-sm transition',
        active
          ? 'border-accent-500 text-accent-700'
          : 'border-transparent text-canvas-500 hover:text-canvas-900',
      )}
    >
      {icon}
      {children}
    </button>
  )
}
