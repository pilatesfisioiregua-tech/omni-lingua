import { env } from './_env'
/** LLM estima CEFR de un transcript · F4.5 */
import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  const key = env('ANTHROPIC_API_KEY')
  if (!key) return json({ cefr: 'A2', confidence: 'low', rationale: 'demo · sin API key' })

  type Body = { transcript?: string; title?: string }
  let body: Body
  try { body = await req.json() } catch { body = {} }
  const transcript = (body.transcript ?? '').trim()
  if (!transcript) return json({ cefr: null, confidence: 'low', rationale: 'transcript vacío' })

  try {
    const client = new Anthropic({ apiKey: key })
    const system = 'Eres un evaluador CEFR. Recibes un transcript en inglés y devuelves JSON estricto: {"cefr": "A1|A2|B1|B2|C1|C2", "confidence": "high|medium|low", "rationale": "<máx 2 frases en castellano>"}. Criterios: vocab frecuencia, sintaxis (subordinadas, condicionales, modal verbs), idioms, registro. Solo JSON.'
    const out = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system,
      messages: [{ role: 'user', content: `Título: ${body.title ?? '—'}\n\nTranscript:\n${transcript.slice(0, 2000)}` }],
    })
    const raw = out.content.filter((c) => c.type === 'text').map((c) => (c.type === 'text' ? c.text : '')).join('').trim()
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    try {
      return json(JSON.parse(cleaned))
    } catch {
      return json({ cefr: 'A2', confidence: 'low', rationale: raw })
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
