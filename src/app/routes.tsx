import { lazy, Suspense, type ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Mic,
  BookOpen,
  Ear,
  Brain,
  ScanLine,
  MessagesSquare,
  Bot,
  Camera,
  Sparkles,
  Settings as SettingsIcon,
  Loader2,
} from 'lucide-react'

const Twin = lazy(() => import('../modules/twin/Twin').then((m) => ({ default: m.Twin })))
const Pronunciation = lazy(() =>
  import('../modules/pronunciation/Pronunciation').then((m) => ({ default: m.Pronunciation })),
)
const Vocabulary = lazy(() =>
  import('../modules/vocabulary/Vocabulary').then((m) => ({ default: m.Vocabulary })),
)
const Listening = lazy(() =>
  import('../modules/listening/Listening').then((m) => ({ default: m.Listening })),
)
const Practice = lazy(() =>
  import('../modules/practice/Practice').then((m) => ({ default: m.Practice })),
)
const ContentId = lazy(() =>
  import('../modules/content-id/ContentId').then((m) => ({ default: m.ContentId })),
)
const Conversation = lazy(() =>
  import('../modules/conversation/Conversation').then((m) => ({ default: m.Conversation })),
)
const Coach = lazy(() => import('../modules/coach/Coach').then((m) => ({ default: m.Coach })))
const Performance = lazy(() =>
  import('../modules/performance/Performance').then((m) => ({ default: m.Performance })),
)
const Settings = lazy(() =>
  import('../modules/settings/Settings').then((m) => ({ default: m.Settings })),
)

function withSuspense(Comp: ComponentType): ComponentType {
  const Wrapped = () => (
    <Suspense
      fallback={
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-canvas-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando módulo…
        </div>
      }
    >
      <Comp />
    </Suspense>
  )
  Wrapped.displayName = `Lazy(${Comp.displayName ?? 'Module'})`
  return Wrapped
}

export type Phase = '0' | '1' | '2' | '3' | '4' | '4.5' | '4.6' | '4.8' | '4.9' | '5'

export type RouteDef = {
  path: string
  label: string
  shortLabel: string
  icon: LucideIcon
  phase: Phase
  component: React.ComponentType
  group: 'foundation' | 'tools' | 'learn' | 'content' | 'lab' | 'system'
  tagline: string
}

export const ROUTES: RouteDef[] = [
  {
    path: '/twin',
    label: 'Language Twin',
    shortLabel: 'Twin',
    icon: Sparkles,
    phase: '0',
    component: withSuspense(Twin),
    group: 'foundation',
    tagline: 'Tu inglés modelado · vector único que alimenta todos los demás módulos',
  },
  {
    path: '/pronunciation',
    label: 'Pronunciación',
    shortLabel: 'Pronuncia',
    icon: Mic,
    phase: '1',
    component: withSuspense(Pronunciation),
    group: 'tools',
    tagline: 'Fonemas IPA · pitch · tongue twisters · GOP heatmap',
  },
  {
    path: '/vocabulary',
    label: 'Vocabulario',
    shortLabel: 'Vocab',
    icon: BookOpen,
    phase: '2',
    component: withSuspense(Vocabulary),
    group: 'tools',
    tagline: '500 palabras A1-A2 · 200 collocations · false friends ES↔EN',
  },
  {
    path: '/listening',
    label: 'Listening',
    shortLabel: 'Listening',
    icon: Ear,
    phase: '3',
    component: withSuspense(Listening),
    group: 'learn',
    tagline: 'Minimal pairs · shadowing · live transcriber',
  },
  {
    path: '/practice',
    label: 'Plan + Práctica',
    shortLabel: 'Plan',
    icon: Brain,
    phase: '4',
    component: withSuspense(Practice),
    group: 'learn',
    tagline: 'Curriculum adaptativo · FSRS · honest dashboard · weekly plan',
  },
  {
    path: '/content-id',
    label: 'Shazam de inglés',
    shortLabel: 'Shazam',
    icon: ScanLine,
    phase: '4.5',
    component: withSuspense(ContentId),
    group: 'content',
    tagline: 'Identifica canción/podcast · transcript clickable · sentence mining',
  },
  {
    path: '/conversation',
    label: 'Conversación con IA',
    shortLabel: 'Conversación',
    icon: MessagesSquare,
    phase: '4.6',
    component: withSuspense(Conversation),
    group: 'content',
    tagline: 'Voice-to-voice Claude · linguistic mirror · replay peores turnos',
  },
  {
    path: '/coach',
    label: 'Coach IA',
    shortLabel: 'Coach',
    icon: Bot,
    phase: '4.8',
    component: withSuspense(Coach),
    group: 'lab',
    tagline: 'Chat dedicado · daily story 200pal · tool use · 200 links curados',
  },
  {
    path: '/performance',
    label: 'Boca + Grabación',
    shortLabel: 'Boca',
    icon: Camera,
    phase: '4.9',
    component: withSuspense(Performance),
    group: 'lab',
    tagline: 'MediaPipe lips · GOP visual · autocrítica IA anti self-delusion',
  },
  {
    path: '/settings',
    label: 'Ajustes',
    shortLabel: 'Ajustes',
    icon: SettingsIcon,
    phase: '5',
    component: withSuspense(Settings),
    group: 'system',
    tagline: 'Theme · cronotipo (#10) · export JSON · subtitle companion (#8)',
  },
]

export const GROUP_LABELS: Record<RouteDef['group'], string> = {
  foundation: 'Fundación',
  tools: 'Herramientas',
  learn: 'Aprender',
  content: 'Contenido real',
  lab: 'Laboratorio',
  system: 'Sistema',
}
