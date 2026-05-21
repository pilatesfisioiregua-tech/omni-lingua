import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Brain, Play, BookOpen } from 'lucide-react'
import { clsx } from 'clsx'
import { LESSONS, SKILLS, CATEGORY_LABEL, type Lesson } from './curriculumData'
import { getPrefs } from './practiceDb'
import { OnboardingWizard } from './OnboardingWizard'
import { LessonRunner } from './LessonRunner'
import { FrustrationModal } from './FrustrationModal'
import { Dashboard } from './Dashboard'
import { WeeklyPlanCard } from './WeeklyPlanCard'
import { PainCheckIn } from './PainCheckIn'

type View = 'loading' | 'onboarding' | 'home' | 'lesson'

export function Practice() {
  const [view, setView] = useState<View>('loading')
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [showFrustration, setShowFrustration] = useState(false)
  const [section, setSection] = useState<'dashboard' | 'lessons' | 'plan' | 'wellness'>('dashboard')

  useEffect(() => {
    void (async () => {
      const prefs = await getPrefs()
      setView(prefs?.onboarded ? 'home' : 'onboarding')
    })()
  }, [])

  if (view === 'loading') {
    return <div className="py-8 text-sm text-canvas-500">Cargando…</div>
  }

  if (view === 'onboarding') {
    return (
      <div className="space-y-6">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-canvas-900">
          <ArrowLeft className="h-3 w-3" /> volver
        </Link>
        <OnboardingWizard onComplete={() => setView('home')} />
      </div>
    )
  }

  if (view === 'lesson' && activeLesson) {
    return (
      <>
        <LessonRunner
          lesson={activeLesson}
          onExit={() => {
            setActiveLesson(null)
            setView('home')
          }}
          onFrustrated={() => setShowFrustration(true)}
        />
        {showFrustration && (
          <FrustrationModal
            lessonId={activeLesson.id}
            onClose={() => {
              setShowFrustration(false)
              setActiveLesson(null)
              setView('home')
            }}
          />
        )}
      </>
    )
  }

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-xs text-canvas-500 hover:text-canvas-900">
        <ArrowLeft className="h-3 w-3" /> volver
      </Link>

      <header className="space-y-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-accent-300 bg-accent-100 px-3 py-1 text-xs text-accent-700">
          <Brain className="h-3 w-3" /> Fase 4 · Plan adaptativo
        </span>
        <h1 className="font-serif text-3xl text-canvas-900">Plan + Práctica</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-canvas-700">
          Curriculum adaptativo · FSRS-5 spaced repetition · honest dashboard · weekly plan · ES↔EN
          pivot · Write→AI→Retry. 4 diferenciadores Omni-Lingua viven aquí.
        </p>
      </header>

      <div className="flex gap-2 border-b border-canvas-200">
        <Tab active={section === 'dashboard'} onClick={() => setSection('dashboard')}>Dashboard</Tab>
        <Tab active={section === 'lessons'} onClick={() => setSection('lessons')}>Lessons</Tab>
        <Tab active={section === 'plan'} onClick={() => setSection('plan')}>Plan semanal</Tab>
        <Tab active={section === 'wellness'} onClick={() => setSection('wellness')}>Bienestar</Tab>
      </div>

      {section === 'dashboard' && <Dashboard />}

      {section === 'lessons' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {LESSONS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  setActiveLesson(l)
                  setView('lesson')
                }}
                className="group rounded-xl border border-canvas-200 bg-canvas-50 p-4 text-left hover:border-accent-300"
              >
                <div className="mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-canvas-500 group-hover:text-accent-500" />
                  <span className="text-xs text-canvas-500">{l.durationMinutes} min</span>
                </div>
                <h3 className="font-serif text-lg text-canvas-900">{l.title}</h3>
                <div className="mt-1 flex flex-wrap gap-1">
                  {l.skillIds.map((sid) => {
                    const s = SKILLS.find((x) => x.id === sid)
                    return s ? (
                      <span key={sid} className="rounded bg-canvas-200 px-1.5 py-0.5 text-[10px] text-canvas-700">
                        {CATEGORY_LABEL[s.category]}
                      </span>
                    ) : null
                  })}
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs text-accent-700 group-hover:text-accent-900">
                  <Play className="h-3 w-3" /> Empezar
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {section === 'plan' && <WeeklyPlanCard />}

      {section === 'wellness' && <PainCheckIn />}
    </div>
  )
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        '-mb-px border-b-2 px-3 py-2 text-sm transition',
        active ? 'border-accent-500 text-accent-700' : 'border-transparent text-canvas-500 hover:text-canvas-900',
      )}
    >
      {children}
    </button>
  )
}
