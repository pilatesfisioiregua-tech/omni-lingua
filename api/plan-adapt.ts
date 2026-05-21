/** WeeklyPlanCard · Claude reorganiza prioridades semanales · F4 stub */

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  return new Response(
    JSON.stringify({
      adapted_plan: [],
      rationale:
        'plan-adapt stub · F4 implementará la reorganización de prioridades semanal con Claude.',
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  )
}
