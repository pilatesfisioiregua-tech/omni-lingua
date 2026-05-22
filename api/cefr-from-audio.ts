function env(name: string): string | undefined { const g = globalThis as { process?: { env: Record<string, string | undefined> } }; return g.process?.env?.[name] }
/** CEFR auto-detect desde 1 grabación 30s · usado en Onboarding paso 4 */
import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  const key = env('ANTHROPIC_API_KEY')
  if (!key) return json({ cefr: 'A1', confidence: 'low', rationale: 'demo · sin API key', fluency: 0, accent: 0 })

  type Body = { transcript?: string }
  let body: Body
  try { body = await req.json() } catch { body = {} }
  const transcript = (body.transcript ?? '').trim()
  if (!transcript) return json({ cefr: 'A0', confidence: 'low', rationale: 'no se detectó habla', fluency: 0, accent: 0 })

  try {
    const client = new Anthropic({ apiKey: key })
    const system = 'Eres un evaluador CEFR speaking. Recibes el transcript de un hispanohablante presentándose en inglés 30s. Devuelves JSON estricto: {"cefr": "A0|A1|A2|B1|B2|C1", "confidence": "high|medium|low", "fluency": 0-100, "accent_clarity": 0-100, "rationale": "<máx 3 frases castellano: qué bien hace · qué mejorar · prioridad #1>"}. Criterios: vocab amplitud, complejidad sintáctica, errores ES→EN obvios (have vs be, do vs make), fluidez (longitud frases, pausas implícitas por puntuación). Si transcript <15 palabras → cefr más bajo. Solo JSON.'
    const out = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system,
      messages: [{ role: 'user', content: `Transcript (Web Speech ASR):\n"${transcript}"` }],
    })
    const raw = out.content.filter((c) => c.type === 'text').map((c) => (c.type === 'text' ? c.text : '')).join('').trim()
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    try {
      return json(JSON.parse(cleaned))
    } catch {
      return json({ cefr: 'A2', confidence: 'low', rationale: raw, fluency: 50, accent_clarity: 50 })
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
