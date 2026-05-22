import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Share2, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react'
import { clsx } from 'clsx'
import { getLatestSnapshot } from '../../shared/twin/twinStore'
import { practiceDb, streakDays } from '../practice/practiceDb'

type Slide = {
  title: string
  big: string
  caption: string
  bg: string
  fg: string
}

export function Wrapped() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    void (async () => {
      const twin = await getTwin()
      const streak = await streakDays()
      const lessons = await practiceDb.lessonHistory.toArray()
      const grad = lessons.filter((l) => l.graduated).length

      const s: Slide[] = [
        {
          title: 'Tu inglés en gráfica',
          big: '🎁',
          caption: 'Un viaje por los datos de tu Language Twin.',
          bg: 'bg-gradient-to-br from-accent-300 to-accent-700',
          fg: 'text-white',
        },
        {
          title: 'Tu CEFR efectivo',
          big: twin.effectiveCefr ?? '—',
          caption:
            twin.effectiveCefr
              ? `Medido por tu uso real, no por aspiración.`
              : 'Necesitamos más datos · sigue usando la app.',
          bg: 'bg-canvas-900',
          fg: 'text-canvas-50',
        },
        {
          title: 'Vocab activo medido',
          big: `${twin.vocabActiveCount}`,
          caption: 'palabras que has producido al menos 1 vez · no las que viste.',
          bg: 'bg-gradient-to-br from-accent-100 to-accent-300',
          fg: 'text-canvas-900',
        },
        {
          title: 'Patrones únicos de tu inglés',
          big: `${twin.uniquePatterns}`,
          caption: 'errores · fonemas · interferencias del español · todos personales.',
          bg: 'bg-gradient-to-br from-canvas-700 to-canvas-900',
          fg: 'text-canvas-50',
        },
        {
          title: 'Streak',
          big: `${streak}`,
          caption: streak >= 7 ? 'días seguidos · constancia real.' : 'días seguidos · empezando.',
          bg: 'bg-gradient-to-br from-accent-500 to-accent-900',
          fg: 'text-white',
        },
        {
          title: 'Lecciones graduadas',
          big: `${grad}`,
          caption: lessons.length ? `de ${lessons.length} intentos · honest ratio.` : 'sin lecciones aún.',
          bg: 'bg-canvas-100',
          fg: 'text-canvas-900',
        },
        {
          title: 'Tu fonema más débil',
          big: twin.weakestPhoneme?.phoneme ?? '—',
          caption: twin.weakestPhoneme
            ? `${(twin.weakestPhoneme.gop * 100).toFixed(0)}% accuracy · prioridad ROI`
            : 'sin datos fonéticos aún.',
          bg: 'bg-gradient-to-br from-warning to-danger',
          fg: 'text-white',
        },
        {
          title: 'Interferencia ES→EN top',
          big: twin.topInterference?.tag.toUpperCase() ?? '—',
          caption: twin.topInterference
            ? `Detectada ${twin.topInterference.count} veces.`
            : 'sin interferencias detectadas todavía.',
          bg: 'bg-gradient-to-br from-canvas-900 to-accent-700',
          fg: 'text-white',
        },
        {
          title: 'El comienzo',
          big: '🚀',
          caption: 'Tu mejor inglés está adelante. Sigue así.',
          bg: 'bg-gradient-to-br from-accent-100 to-accent-500',
          fg: 'text-canvas-900',
        },
      ]
      setSlides(s)
    })()
  }, [])

  if (slides.length === 0) {
    return <div className="py-8 text-sm text-canvas-500">Generando tu Wrapped…</div>
  }

  const s = slides[idx]
  const next = () => setIdx(Math.min(idx + 1, slides.length - 1))
  const prev = () => setIdx(Math.max(idx - 1, 0))

  const share = async () => {
    const text = `Mi inglés en Omni-Lingua: ${slides[1].big} · ${slides[2].big} palabras activas · ${slides[3].big} patrones únicos.`
    if (navigator.share) {
      try { await navigator.share({ title: 'Mi inglés en gráfica', text }) } catch { /* user cancel */ }
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  return (
    <div className="space-y-4">
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-canvas-900">
        <ArrowLeft className="h-3 w-3" /> volver
      </Link>

      <header>
        <h1 className="font-serif text-3xl text-canvas-900">Tu inglés en gráfica</h1>
      </header>

      <div className="relative">
        <div className={clsx('aspect-[9/16] max-h-[70vh] overflow-hidden rounded-3xl', s.bg)}>
          <div className={clsx('flex h-full flex-col items-center justify-between p-8', s.fg)}>
            <div className="flex w-full items-center justify-between text-xs opacity-70">
              <span className="font-serif">Omni-Lingua · {new Date().getFullYear()}</span>
              <span>{idx + 1} / {slides.length}</span>
            </div>
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest opacity-80">{s.title}</div>
              <div className="mt-3 font-serif text-7xl leading-none">{s.big}</div>
              <p className="mt-4 max-w-xs text-base leading-snug opacity-90">{s.caption}</p>
            </div>
            <div className="flex w-full items-center justify-between">
              <button
                type="button"
                onClick={prev}
                disabled={idx === 0}
                className="rounded-full bg-black/20 p-2 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex flex-1 gap-1 px-3">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={clsx('h-1 flex-1 rounded-full', i <= idx ? 'bg-white' : 'bg-white/30')}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={next}
                disabled={idx === slides.length - 1}
                className="rounded-full bg-black/20 p-2 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
        >
          <Share2 className="h-4 w-4" /> Compartir
        </button>
      </div>

      <p className="text-center text-[10px] text-canvas-500">
        <Sparkles className="mr-1 inline h-3 w-3" /> Datos generados localmente desde tu Twin · no se
        envían fuera de tu dispositivo.
      </p>
    </div>
  )
}

async function getTwin() {
  const snap = await getLatestSnapshot()
  const weakest = snap.phonemeAccuracy.slice().sort((a, b) => a.gop - b.gop)[0]
  const topInter = snap.interferencesES.slice().sort((a, b) => b.count - a.count)[0]
  return {
    effectiveCefr: snap.effectiveCefr,
    vocabActiveCount: snap.vocabActive.filter((v) => v.producedCount > 0).length,
    uniquePatterns:
      snap.errorPatterns.length + snap.phonemeAccuracy.length + snap.interferencesES.length,
    weakestPhoneme: weakest ? { phoneme: weakest.phoneme, gop: weakest.gop } : null,
    topInterference: topInter ? { tag: topInter.tag, count: topInter.count } : null,
  }
}
