/** LLM estima CEFR de un transcript · F4.5 stub */

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  return new Response(
    JSON.stringify({ cefr: 'A2', confidence: 'low', rationale: 'F4.5 stub · Claude Haiku CEFR estimator' }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  )
}
