import { env } from './_env.js'
/** Generative Comprehensible Input · mini-historia 200pal personalizada · Diferenciador #2 */
import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  const key = env('ANTHROPIC_API_KEY')
  if (!key) return demoFallback()

  type Body = { level?: string; vocabFocus?: string[]; themes?: string[] }
  let body: Body
  try { body = await req.json() } catch { body = {} }
  const level = body.level ?? 'A2'
  const vocabFocus = (body.vocabFocus ?? []).filter(Boolean).slice(0, 5)
  const themes = (body.themes ?? []).filter(Boolean).slice(0, 3)

  try {
    const client = new Anthropic({ apiKey: key })
    const system = 'Eres un escritor de mini-historias para learners de inglés. Reglas estrictas: (1) ~180-220 palabras inglesas · (2) registro CEFR exacto del nivel pedido · (3) tono cálido, no infantil · (4) primera persona o tercera persona omnisciente · (5) trama con principio + giro + final · (6) NO listas · NO preguntas al lector · NO romper la cuarta pared.'
    const userMsg = [
      `Nivel CEFR: ${level}`,
      vocabFocus.length ? `Vocab que el lector está aprendiendo (intenta usar 3-5 de estas palabras): ${vocabFocus.join(', ')}` : '',
      themes.length ? `Temas/inspiraciones (puedes ambientarla en alguno): ${themes.join(' | ')}` : '',
      'Devuelve SOLO la historia. Sin título. Sin meta-comentarios. Sin asteriscos.',
    ].filter(Boolean).join('\n')

    const out = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 700,
      system,
      messages: [{ role: 'user', content: userMsg }],
    })
    const text = out.content.filter((c) => c.type === 'text').map((c) => (c.type === 'text' ? c.text : '')).join('\n').trim()

    return new Response(JSON.stringify({ story: text, cefr: level, vocabUsed: vocabFocus }), {
      status: 200, headers: { 'content-type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'anthropic_error', detail: errMsg(e) }), {
      status: 500, headers: { 'content-type': 'application/json' },
    })
  }
}

function demoFallback(): Response {
  return new Response(JSON.stringify({
    story: 'Demo · sin ANTHROPIC_API_KEY no se generan historias reales.',
    cefr: 'A2', vocabUsed: [],
  }), { status: 200, headers: { 'content-type': 'application/json' } })
}
function errMsg(e: unknown): string { return e instanceof Error ? e.message : String(e) }
