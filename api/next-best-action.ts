function env(name: string): string | undefined { const g = globalThis as { process?: { env: Record<string, string | undefined> } }; return g.process?.env?.[name] }
/** Cross-skill recommendation engine · sugiere acción óptima basada en Twin + estado */
import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  const key = env('ANTHROPIC_API_KEY')
  if (!key) return json(demoFallback())

  type Body = { twin?: unknown; objective?: string; minutesAvailable?: number; recentSkills?: string[] }
  let body: Body
  try { body = await req.json() } catch { body = {} }

  try {
    const client = new Anthropic({ apiKey: key })
    const system = 'Eres un recomendador de "next best action" para learners de inglés A1-A2. Recibes estado del Twin (errores · fonemas débiles · vocab · interferencias) + objetivo + minutos disponibles + skills recientes. Devuelves JSON: {"recommendation": "<frase imperativa CASTELLANO con ruta sugerida · max 25 palabras>", "route": "/pronunciation|/vocabulary|/listening|/practice|/content-id|/conversation|/coach|/performance", "skill_tags": ["..."], "rationale": "<por qué · max 2 frases castellano>", "minutes": N, "priority": "honest|wins|fun"}. Reglas: si hay fonema <40% accuracy, prioriza pronunciation. Si hay errores ES↔EN recientes, prioriza practice/es_en_drill. Si vocab activo <50, vocabulary. Si pain alto reciente, sugerir tab honest. Si nada, conversation. NO repitas ruta de recentSkills si es la última. Solo JSON.'

    const out = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system,
      messages: [{ role: 'user', content: JSON.stringify(body) }],
    })
    const raw = out.content.filter((c) => c.type === 'text').map((c) => (c.type === 'text' ? c.text : '')).join('').trim()
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    try {
      return json(JSON.parse(cleaned))
    } catch {
      return json(demoFallback())
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: 'anthropic_error', detail: errMsg(e) }), {
      status: 500, headers: { 'content-type': 'application/json' },
    })
  }
}

function demoFallback() {
  return {
    recommendation: 'Empieza por Pronunciación · 5 fonemas IPA con feedback grabado en 8 min.',
    route: '/pronunciation',
    skill_tags: ['ph_th', 'ph_schwa'],
    rationale: 'Los fonemas son la base · sin esto el resto se construye torcido. Es el ROI más alto al principio.',
    minutes: 8,
    priority: 'honest',
  }
}

function json(payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status: 200, headers: { 'content-type': 'application/json' } })
}
function errMsg(e: unknown): string { return e instanceof Error ? e.message : String(e) }
