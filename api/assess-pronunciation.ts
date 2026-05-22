import { env } from './_env.js'
/** GOP (Goodness of Pronunciation) backend · Diferenciador #3 · F1+ stub */

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  if (!env('MODAL_GOP_ENDPOINT')) {
    return new Response(
      JSON.stringify({
        demo: true,
        message: 'GOP endpoint no configurado · fallback Web Speech + Claude scoring se usará en F1',
        phoneme_scores: [],
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    )
  }
  return new Response(JSON.stringify({ phoneme_scores: [], message: 'F1+ stub · wav2vec2 GOP' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}
