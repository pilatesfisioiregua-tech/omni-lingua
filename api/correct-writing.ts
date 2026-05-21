/** Write→AI→Diff→Retry · Diferenciador #6 · F4 stub */

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  return new Response(
    JSON.stringify({
      corrected: '',
      diff: [],
      pedagogical_explanation: 'F4 implementará el loop con Claude · errores extraídos van a FSRS.',
      errors_for_fsrs: [],
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  )
}
