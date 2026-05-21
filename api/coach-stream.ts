/** Coach IA chat dedicado · F4.8 · stub demo */

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('method_not_allowed', { status: 405 })
  }
  return new Response(
    JSON.stringify({
      reply: 'Coach IA llega en Fase 4.8 · context completo del usuario + tool use + 200 links curados.',
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  )
}
