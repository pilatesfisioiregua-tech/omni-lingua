import { useEffect, useState } from 'react'
import { TrendingUp, AlertTriangle, Activity, Calendar, Target } from 'lucide-react'
import { practiceDb, recentLessonHistory, recentPain, streakDays, type Prefs, getPrefs, type WeeklyPlan, getCurrentWeekPlan } from './practiceDb'
import { getTwinContext, type TwinContext } from '../../shared/twin/twinContext'
import { SKILLS } from './curriculumData'

type Insight = { tag: 'honest' | 'win'; text: string }

export function Dashboard() {
  const [streak, setStreak] = useState(0)
  const [twin, setTwin] = useState<TwinContext | null>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [skillCounts, setSkillCounts] = useState({ mastered: 0, practicing: 0, learning: 0 })
  const [prefs, setPrefs] = useState<Prefs | null>(null)
  const [plan, setPlan] = useState<WeeklyPlan | null>(null)

  useEffect(() => {
    void (async () => {
      setStreak(await streakDays())
      setTwin(await getTwinContext())
      setPrefs(await getPrefs())
      setPlan(await getCurrentWeekPlan())

      const skills = await practiceDb.skills.toArray()
      setSkillCounts({
        mastered: skills.filter((s) => s.mastery === 'mastered').length,
        practicing: skills.filter((s) => s.mastery === 'practicing').length,
        learning: skills.filter((s) => s.mastery === 'learning').length,
      })

      // Honest Dashboard insights (diferenciador #4)
      const newInsights = await computeHonestInsights()
      setInsights(newInsights)
    })()
  }, [])

  const totalSkills = SKILLS.length

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon={<Calendar className="h-4 w-4" />} label="Streak" value={`${streak} días`} />
        <Stat icon={<Target className="h-4 w-4" />} label="CEFR efectivo" value={twin?.effectiveCefr ?? '—'} hint={prefs?.cefrSelfReport ? `vs self-report ${prefs.cefrSelfReport}` : undefined} />
        <Stat icon={<TrendingUp className="h-4 w-4" />} label="Mastered" value={`${skillCounts.mastered}/${totalSkills}`} />
        <Stat icon={<Activity className="h-4 w-4" />} label="Vocab activo" value={twin?.activeVocabCount.toString() ?? '0'} hint="producidas, no expuestas" />
      </section>

      {/* Honest Dashboard · diferenciador #4 */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-canvas-500">
          Honest dashboard · diferenciador #4
        </h2>
        {insights.length === 0 ? (
          <div className="rounded-lg border border-canvas-200 bg-canvas-50 p-4 text-xs text-canvas-500">
            Aún no hay datos suficientes para detectar patrones honest. Vuelve después de 5-10 sesiones.
          </div>
        ) : (
          <div className="space-y-2">
            {insights.map((i, idx) => (
              <div
                key={idx}
                className={
                  'flex items-start gap-2 rounded-lg border-l-2 px-3 py-2 text-sm ' +
                  (i.tag === 'honest'
                    ? 'border-warning bg-warning/5 text-canvas-700'
                    : 'border-success bg-success/5 text-canvas-700')
                }
              >
                {i.tag === 'honest' ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                ) : (
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                )}
                <span>{i.text}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Weekly plan summary */}
      {plan && (
        <section className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-canvas-500">
            Plan semanal · semana del {plan.weekStart}
          </h2>
          <p className="text-sm text-canvas-700">
            Disponibles: <strong className="text-canvas-900">{plan.availableHours}h</strong>
          </p>
          {plan.notes && <p className="mt-1 text-xs text-canvas-500">{plan.notes}</p>}
          {plan.priorities.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-canvas-700">
              {plan.priorities.map((p) => (
                <li key={p}>· {SKILLS.find((s) => s.id === p)?.title ?? p}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {twin?.weakPhonemes && twin.weakPhonemes.length > 0 && (
        <section className="rounded-2xl border border-canvas-200 bg-canvas-50 p-5">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-canvas-500">
            Fonemas más débiles · alimentan Phonetic Distance Map (#3)
          </h2>
          <div className="space-y-2">
            {twin.weakPhonemes.map((p) => (
              <div key={p.phoneme} className="flex items-center gap-3">
                <span className="w-16 font-mono text-accent-700">{p.phoneme}</span>
                <div className="h-2 flex-1 rounded-full bg-canvas-200">
                  <div
                    className="h-2 rounded-full bg-accent-500"
                    style={{ width: `${Math.round(p.gop * 100)}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs text-canvas-700">{(p.gop * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Stat({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-canvas-200 bg-canvas-50 p-3">
      <div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-wider text-canvas-500">
        {icon} {label}
      </div>
      <div className="font-serif text-2xl text-canvas-900">{value}</div>
      {hint && <div className="text-[10px] text-canvas-500">{hint}</div>}
    </div>
  )
}

async function computeHonestInsights(): Promise<Insight[]> {
  const out: Insight[] = []
  const history = await recentLessonHistory(21)
  const pain = await recentPain(7)
  const twin = await getTwinContext()
  const prefs = await getPrefs()

  // Self-report vs effective CEFR
  if (prefs?.cefrSelfReport && twin.effectiveCefr) {
    const order = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    const self = order.indexOf(prefs.cefrSelfReport)
    const eff = order.indexOf(twin.effectiveCefr)
    if (self - eff >= 2) {
      out.push({
        tag: 'honest',
        text: `Tu auto-percepción es ${prefs.cefrSelfReport} pero el sistema mide ${twin.effectiveCefr} basándose en vocab activo producido. Está bien — el plan se ajustará.`,
      })
    } else if (eff - self >= 1) {
      out.push({
        tag: 'win',
        text: `Tu nivel real medido (${twin.effectiveCefr}) está POR ENCIMA de tu auto-percepción (${prefs.cefrSelfReport}). Has progresado más de lo que crees.`,
      })
    }
  }

  // Stuck skill detection · lesson rate <2 repetido
  const lowRated = history.filter((h) => h.selfRate <= 1)
  if (lowRated.length >= 3) {
    const byLesson = new Map<string, number>()
    for (const h of lowRated) byLesson.set(h.lessonId, (byLesson.get(h.lessonId) ?? 0) + 1)
    const stuck = [...byLesson.entries()].find(([, c]) => c >= 3)
    if (stuck) {
      out.push({
        tag: 'honest',
        text: `Llevas 3+ intentos con self-rate ≤1 en "${stuck[0]}". Probemos un enfoque distinto: micro-pasos + más contexto.`,
      })
    }
  }

  // Pain pattern
  if (pain.length >= 3) {
    const avgHeadache = pain.reduce((a, b) => a + b.zones.headache, 0) / pain.length
    if (avgHeadache > 2.5) {
      out.push({
        tag: 'honest',
        text: `Has reportado dolor de cabeza ${pain.length} veces esta semana (media ${avgHeadache.toFixed(1)}/4). Considera sesiones más cortas o más pausas.`,
      })
    }
  }

  // Vocab activo growth
  if (twin.activeVocabCount > 0 && twin.activeVocabCount < 50) {
    out.push({
      tag: 'honest',
      text: `Has producido ${twin.activeVocabCount} palabras únicas. La media de "vocab visto" en deck no es lo mismo que vocab activo — el sistema solo cuenta lo que has dicho/escrito tú.`,
    })
  }

  // Streak win
  const streak = await streakDays()
  if (streak >= 7) {
    out.push({ tag: 'win', text: `Llevas ${streak} días seguidos practicando. Excelente hábito sostenido.` })
  }

  return out.slice(0, 5)
}
