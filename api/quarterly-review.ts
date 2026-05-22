import { env } from './_env.js'
/** Quarterly Review · cada 30 días Claude analiza tu progreso global y emite review tipo coach humano */
import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  const key = env('ANTHROPIC_API_KEY')
  if (!key) return json(demoFallback())

  type Body = {
    twin?: unknown
    lessonHistorySummary?: { total: number; avgRate: number; graduated: number; mostRated?: string }
    painSummary?: { headache: number; frustration: number; boredom: number; motivation: number }
    streakDays?: number
    daysSinceOnboarding?: number
    objective?: string
  }
  let body: Body
  try { body = await req.json() } catch { body = {} }

  try {
    const client = new Anthropic({ apiKey: key })
    const system = 'Eres un coach humano experimentado escribiendo review trimestral de un learner de inglés. Recibes Twin + lesson history + pain log + streak + objetivo. Devuelves JSON: {"strengths": ["..."], "weaknesses": ["..."], "next_30_days": "<sugerencia accionable max 3 frases castellano>", "honest_truth": "<la verdad incómoda pero útil · 1-2 frases · max 30 palabras>", "celebration": "<algo real que celebrar · 1 frase>"}. Reglas: máximo 3 strengths · max 3 weaknesses · honest_truth NO debe ser comforting fluff sino real. Solo JSON · castellano.'
    const out = await client.messages.create({
      model: 'claude-sonnet-4-5-20251015',
      max_tokens: 1200,
      system,
      messages: [{ role: 'user', content: JSON.stringify(body, null, 2) }],
    })
    const raw = out.content.filter((c) => c.type === 'text').map((c) => (c.type === 'text' ? c.text : '')).join('').trim()
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    try {
      return json(JSON.parse(cleaned))
    } catch {
      return json({ raw, error: 'JSON parse error' })
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: 'anthropic_error', detail: errMsg(e) }), {
      status: 500, headers: { 'content-type': 'application/json' },
    })
  }
}

function demoFallback() {
  return {
    strengths: ['Buen ritmo de constancia'],
    weaknesses: ['Aún sin suficientes datos para análisis profundo'],
    next_30_days: 'Sigue usando la app · vuelve a este review tras 30 días con datos reales.',
    honest_truth: 'No hay magia · solo repetición espaciada + producción activa.',
    celebration: 'Empezaste. Eso ya es mucho.',
  }
}

function json(payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status: 200, headers: { 'content-type': 'application/json' } })
}
function errMsg(e: unknown): string { return e instanceof Error ? e.message : String(e) }
