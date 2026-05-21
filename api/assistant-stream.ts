/**
 * Assistant sidebar endpoint · Anthropic streaming (modo demo si falta key).
 *
 * F4.8 lo expandirá con tool use + Twin context inyectado.
 */

export const config = { runtime: 'edge' }

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    })
  }

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    return new Response(
      JSON.stringify({
        reply:
          'Modo demo · sin ANTHROPIC_API_KEY en Vercel. Configura la variable de entorno para habilitar el asistente real.',
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    )
  }

  try {
    const body = (await req.json()) as {
      messages: { role: 'user' | 'assistant'; content: string }[]
      route?: string
    }

    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic({ apiKey: key })

    const completion = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: `Eres el asistente de Omni-Lingua, app personal para aprender inglés. Responde breve (máx 4 frases) en castellano salvo que el usuario escriba en inglés. Ruta actual del usuario: ${body.route ?? '/'}.`,
      messages: body.messages,
    })

    const text = completion.content
      .filter((c) => c.type === 'text')
      .map((c) => (c.type === 'text' ? c.text : ''))
      .join('\n')

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return new Response(JSON.stringify({ error: 'anthropic_error', detail: msg }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}
