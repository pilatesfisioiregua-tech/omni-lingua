import process from 'node:process'
/** WeeklyPlanCard · Claude reorganiza prioridades semanales · F4 */
import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return json({ adapted_plan: [], rationale: 'demo · sin API key' })

  type Body = { hoursAvailable?: number; notes?: string; currentPriorities?: string[]; twin?: unknown; objective?: string }
  let body: Body
  try { body = await req.json() } catch { body = {} }
  const { hoursAvailable = 3, notes = '', currentPriorities = [], twin, objective = 'conversational' } = body

  try {
    const client = new Anthropic({ apiKey: key })
    const system = 'Eres un planificador semanal de aprendizaje de inglés. Recibes: horas disponibles, prioridades actuales del usuario, estado del Twin (errores, vocab, fonemas débiles), objetivo. Devuelves JSON: {"adapted_plan": [{"day": "Lun|Mar|...", "activity": "<frase corta accion>", "minutes": N, "skillId": "<ID|null>"}], "rationale": "<máx 4 frases castellano explicando por qué este orden>"}. Reglas: respeta hours total · distribuye en días · interleaved (no solo grammar 5 días) · prioriza errores Twin recientes · termina con sesión "easy" para no quemar. Solo JSON.'
    const userMsg = JSON.stringify({ hoursAvailable, notes, currentPriorities, twin, objective })

    const out = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 900,
      system,
      messages: [{ role: 'user', content: userMsg }],
    })
    const raw = out.content.filter((c) => c.type === 'text').map((c) => (c.type === 'text' ? c.text : '')).join('').trim()
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    try {
      return json(JSON.parse(cleaned))
    } catch {
      return json({ adapted_plan: [], rationale: raw })
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: 'anthropic_error', detail: errMsg(e) }), {
      status: 500, headers: { 'content-type': 'application/json' },
    })
  }
}

function json(payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status: 200, headers: { 'content-type': 'application/json' } })
}
function errMsg(e: unknown): string { return e instanceof Error ? e.message : String(e) }
