/** Write→AI→Diff→Retry · Diferenciador #6 · corrige + explica + extrae errores */
import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return json({ corrected: '', diff: [], pedagogical_explanation: 'demo', errors_for_fsrs: [] })

  type Body = { text?: string; level?: string }
  let body: Body
  try { body = await req.json() } catch { body = {} }
  const text = (body.text ?? '').trim()
  if (!text) return json({ corrected: '', diff: [], pedagogical_explanation: '', errors_for_fsrs: [] })

  try {
    const client = new Anthropic({ apiKey: key })
    const system = 'Eres un corrector de escritura inglesa para hispanohablantes. Recibes un párrafo y devuelves JSON estricto con: {"corrected": "<versión corregida natural>", "diff": [{"original": "...", "fix": "...", "type": "grammar|vocabulary|spelling|article|preposition|word_order"}], "pedagogical_explanation": "<máx 3 frases en castellano explicando los errores PRINCIPALES>", "errors_for_fsrs": [{"tag": "<nombre regla>", "produced": "...", "target": "..."}]}. Solo JSON · sin markdown.'
    const out = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 900,
      system,
      messages: [{ role: 'user', content: `Nivel objetivo: ${body.level ?? 'A2'}.\n\nTexto del estudiante:\n${text}` }],
    })
    const raw = out.content.filter((c) => c.type === 'text').map((c) => (c.type === 'text' ? c.text : '')).join('').trim()
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    try {
      const parsed = JSON.parse(cleaned)
      return json(parsed)
    } catch {
      return json({ corrected: text, diff: [], pedagogical_explanation: raw, errors_for_fsrs: [] })
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
