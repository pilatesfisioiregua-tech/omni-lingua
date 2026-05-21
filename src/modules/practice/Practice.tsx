import { Placeholder } from '../_shared/Placeholder'

export function Practice() {
  return (
    <Placeholder
      title="Plan adaptativo + práctica guiada"
      phase="4"
      description="El módulo grande. Curriculum 40 skills + 25 lessons + 1 track A1→A2 (16 sem). FSRS-5 spaced repetition · scheduler interleaved · LessonRunner · modo frustración · dolor cognitivo monitor · honest dashboard anti-Duolingo."
      bullets={[
        'OnboardingWizard 5 pasos · disponibilidad + objetivo + nivel auto-detect + wishlist',
        'WeeklyPlanCard · declara "esta semana X horas" → Claude reorganiza prioridades',
        'CurriculumData · 40 skills · 25 lessons · 15 icon contents (canciones · TED · pelis)',
        'FSRS-5 · ts-fsrs · cada palabra/regla con due date',
        'Scheduler interleaved · warm-up → review → skill nuevo → contexto real → cool-down',
        'Honest Dashboard (#4) · "3 semanas sin progresar en present perfect"',
        'ES↔EN Structural Pivot (#5) · 50-80 contrastes del hispanohablante',
        'Write→AI→Diff→Retry (#6) · errores reales entran en FSRS',
        'Language Twin profundo (#1) · embedder + aggregator + context API',
      ]}
    />
  )
}
