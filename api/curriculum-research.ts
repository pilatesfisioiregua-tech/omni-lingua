function env(name: string): string | undefined { const g = globalThis as { process?: { env: Record<string, string | undefined> } }; return g.process?.env?.[name] }
/** Cron mensual · Claude Sonnet busca updates curriculum · F4.7 */
import Anthropic from '@anthropic-ai/sdk'

export default async function handler(_req: Request): Promise<Response> {
  const key = env('ANTHROPIC_API_KEY')
  if (!key) {
    return json({ ok: true, proposed_changes: [], message: 'demo · sin API key' })
  }
  try {
    const client = new Anthropic({ apiKey: key })
    const system = 'Eres un investigador L2 acquisition. Tu output mensual son propuestas de mejora del curriculum de inglés A1-A2. Devuelves JSON: {"month": "YYYY-MM", "proposed_changes": [{"category": "lesson|skill|drill|reference", "rationale": "<por qué basado en research reciente>", "diff": "<qué añadir o cambiar>", "confidence": "high|medium|low", "source_type": "paper|practitioner|community"}], "summary": "<máx 3 frases castellano>"}. Como NO tienes web_search activo, basa tus propuestas en conocimiento general L2 SOTA (FSRS · Refold · Mizumoto · Reinders · Boers chunks · Krashen). Devuelve 3-5 propuestas máximo. Solo JSON.'
    const out = await client.messages.create({
      model: 'claude-sonnet-4-5-20251015',
      max_tokens: 1500,
      system,
      messages: [{ role: 'user', content: `Mes actual: ${new Date().toISOString().slice(0, 7)}. Genera propuestas.` }],
    })
    const raw = out.content.filter((c) => c.type === 'text').map((c) => (c.type === 'text' ? c.text : '')).join('').trim()
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    try {
      const parsed = JSON.parse(cleaned)
      return json({ ok: true, ...parsed })
    } catch {
      return json({ ok: true, raw, message: 'JSON parse error' })
    }
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'anthropic_error', detail: errMsg(e) }), {
      status: 500, headers: { 'content-type': 'application/json' },
    })
  }
}

function json(payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status: 200, headers: { 'content-type': 'application/json' } })
}
function errMsg(e: unknown): string { return e instanceof Error ? e.message : String(e) }
