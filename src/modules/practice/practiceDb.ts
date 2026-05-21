/**
 * Practice DB · skill mastery state + lesson history + sessions + onboarding + weekly plan + pain log.
 *
 * Usa ts-fsrs (FSRS-5) para programar repaso de skills/lessons.
 */

import Dexie, { type Table } from 'dexie'
import { fsrs, generatorParameters, createEmptyCard, Rating, type Card } from 'ts-fsrs'

export type Mastery = 'available' | 'learning' | 'practicing' | 'mastered'

export type SkillState = {
  skillId: string
  attempts: number
  avgRating: number
  lastRating: number | null
  mastery: Mastery
  fsrsCard: Card
  lastReviewTs: number | null
  dueAt: number | null
}

export type LessonHistory = {
  id?: number
  lessonId: string
  selfRate: number // 0..4
  durationS: number
  graduated: boolean
  ts: number
}

export type Session = {
  id?: number
  date: string // ISO YYYY-MM-DD
  startedAt: number
  endedAt: number | null
  durationS: number
  lessonIds: string[]
}

export type Prefs = {
  id: 'singleton'
  onboarded: boolean
  daysPerWeek: number
  minutesPerSession: number
  objective: string
  cefrSelfReport: string | null
  cefrAutoDetect: string | null
  wishlistContentIds: string[]
}

export type WeeklyPlan = {
  weekStart: string // ISO Monday
  availableHours: number
  notes: string
  priorities: string[] // skillIds
}

export type PainEntry = {
  id?: number
  ts: number
  zones: { headache: number; frustration: number; boredom: number; motivation: number } // each 0-4
}

export type FrustrationEvent = {
  id?: number
  ts: number
  lessonId: string | null
  resolution: 'mastered_jump' | 'easier' | 'see_progress' | 'pause' | 'close_no_penalty'
}

class PracticeDB extends Dexie {
  skills!: Table<SkillState, string>
  lessonHistory!: Table<LessonHistory, number>
  sessions!: Table<Session, number>
  prefs!: Table<Prefs, string>
  weeklyPlans!: Table<WeeklyPlan, string>
  painLog!: Table<PainEntry, number>
  frustration!: Table<FrustrationEvent, number>

  constructor() {
    super('omni-lingua-practice')
    this.version(1).stores({
      skills: 'skillId, mastery, dueAt, lastReviewTs',
      lessonHistory: '++id, lessonId, ts',
      sessions: '++id, date, startedAt',
      prefs: 'id',
      weeklyPlans: 'weekStart',
      painLog: '++id, ts',
      frustration: '++id, ts, lessonId',
    })
  }
}

export const practiceDb = new PracticeDB()

const fsrsInstance = fsrs(generatorParameters({ enable_fuzz: true }))

export function newSkillState(skillId: string): SkillState {
  return {
    skillId,
    attempts: 0,
    avgRating: 0,
    lastRating: null,
    mastery: 'available',
    fsrsCard: createEmptyCard(),
    lastReviewTs: null,
    dueAt: null,
  }
}

export async function getSkillState(skillId: string): Promise<SkillState> {
  const existing = await practiceDb.skills.get(skillId)
  return existing ?? newSkillState(skillId)
}

export async function rateSkill(skillId: string, rating: 0 | 1 | 2 | 3 | 4): Promise<void> {
  const s = await getSkillState(skillId)
  // map self-rate 0..4 → FSRS Rating
  // 0 (no idea) → Again
  // 1 → Again
  // 2 → Hard
  // 3 → Good
  // 4 → Easy
  const fsrsRating: Rating =
    rating <= 1 ? Rating.Again : rating === 2 ? Rating.Hard : rating === 3 ? Rating.Good : Rating.Easy
  const now = new Date()
  const result = fsrsInstance.repeat(s.fsrsCard, now)[fsrsRating]
  s.fsrsCard = result.card
  s.attempts += 1
  s.avgRating = (s.avgRating * (s.attempts - 1) + rating) / s.attempts
  s.lastRating = rating
  s.lastReviewTs = Date.now()
  s.dueAt = result.card.due.getTime()
  s.mastery =
    s.avgRating >= 3.5 && s.attempts >= 3
      ? 'mastered'
      : s.avgRating >= 2.5 && s.attempts >= 2
      ? 'practicing'
      : s.attempts >= 1
      ? 'learning'
      : 'available'
  await practiceDb.skills.put(s)
}

export async function getDueSkills(): Promise<SkillState[]> {
  const now = Date.now()
  return practiceDb.skills
    .where('dueAt')
    .belowOrEqual(now)
    .toArray()
}

export async function getPrefs(): Promise<Prefs | null> {
  return (await practiceDb.prefs.get('singleton')) ?? null
}

export async function savePrefs(p: Omit<Prefs, 'id'>): Promise<void> {
  await practiceDb.prefs.put({ id: 'singleton', ...p })
}

export async function recordLessonComplete(
  lessonId: string,
  selfRate: number,
  durationS: number,
  graduated: boolean,
): Promise<void> {
  await practiceDb.lessonHistory.add({ lessonId, selfRate, durationS, graduated, ts: Date.now() })
}

export async function recordPain(zones: PainEntry['zones']): Promise<void> {
  await practiceDb.painLog.add({ ts: Date.now(), zones })
}

export async function recordFrustration(
  lessonId: string | null,
  resolution: FrustrationEvent['resolution'],
): Promise<void> {
  await practiceDb.frustration.add({ ts: Date.now(), lessonId, resolution })
}

export async function getCurrentWeekPlan(): Promise<WeeklyPlan | null> {
  const monday = mondayIsoOfWeek(new Date())
  return (await practiceDb.weeklyPlans.get(monday)) ?? null
}

export async function saveWeekPlan(plan: Omit<WeeklyPlan, 'weekStart'>): Promise<void> {
  const monday = mondayIsoOfWeek(new Date())
  await practiceDb.weeklyPlans.put({ weekStart: monday, ...plan })
}

function mondayIsoOfWeek(d: Date): string {
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1) - day // sunday = 0
  const m = new Date(d)
  m.setDate(d.getDate() + diff)
  return m.toISOString().slice(0, 10)
}

export async function recentLessonHistory(days = 30): Promise<LessonHistory[]> {
  const cutoff = Date.now() - days * 86400000
  return practiceDb.lessonHistory.where('ts').above(cutoff).toArray()
}

export async function recentPain(days = 7): Promise<PainEntry[]> {
  const cutoff = Date.now() - days * 86400000
  return practiceDb.painLog.where('ts').above(cutoff).toArray()
}

export async function streakDays(): Promise<number> {
  const sessions = await practiceDb.sessions.toArray()
  if (sessions.length === 0) return 0
  const dates = new Set(sessions.map((s) => s.date))
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    if (dates.has(iso)) streak += 1
    else if (i > 0) break
  }
  return streak
}
