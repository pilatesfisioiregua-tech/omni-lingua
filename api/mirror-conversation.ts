import { env } from './_env'
/** Linguistic Mirror · Diferenciador #7 · detecta gap intención↔producción */
import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  const key = env('ANTHROPIC_API_KEY')
  if (!key) return json({ mirror_detected: false, intended: null, produced: null, gap_explanation: 'demo' })

  type Body = { produced?: string; scenario?: string; level?: string }
  let body: Body
  try { body = await req.json() } catch { body = {} }
  const produced = (body.produced ?? '').trim()
  if (!produced) return json({ mirror_detected: false })

  try {
    const client = new Anthropic({ apiKey: key })
    const system = 'Eres un detector de interferencia lingüística español → inglés (Dijkstra BIA+). Cuando un hispanohablante produce una frase en inglés, detecta si hay traducción literal del español, false friends, estructuras prestadas o vocab no natural. Si NO hay error obvio, responde con mirror_detected:false. Si hay error, devuelve JSON estricto con: {"mirror_detected": true, "intended": "<la frase correcta natural en inglés>", "produced": "<lo que dijo el usuario>", "gap_explanation": "<1 frase castellano explicando el error>"}. Si todo bien: {"mirror_detected": false}. Solo JSON · sin markdown · sin comentarios.'
    const out = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 250,
      system,
      messages: [{ role: 'user', content: `Frase producida (nivel ${body.level ?? 'A2'} · escenario ${body.scenario ?? 'general'}): "${produced}"` }],
    })
    const text = out.content.filter((c) => c.type === 'text').map((c) => (c.type === 'text' ? c.text : '')).join('').trim()
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    try {
      const parsed = JSON.parse(cleaned)
      return json(parsed)
    } catch {
      return json({ mirror_detected: false, raw: text })
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
