/** Linguistic Mirror · Diferenciador #7 · transferencia conceptual BPF E5-E7 · F4.6 stub */
export const config = { runtime: 'edge' }

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  return new Response(
    JSON.stringify({
      mirror_detected: false,
      intended: null,
      produced: null,
      gap_explanation: 'F4.6 detectará "dijiste X, querías decir Y" tras cada turno.',
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  )
}
