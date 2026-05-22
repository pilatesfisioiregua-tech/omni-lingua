/** Modal Whisper transcribe · F4.5 stub */

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  if (!process.env.MODAL_TRANSCRIBE_ENDPOINT) {
    return new Response(
      JSON.stringify({ transcript: '', demo: true, message: 'Modal endpoint no configurado' }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    )
  }
  return new Response(JSON.stringify({ transcript: '', message: 'F4.5 stub · Modal Whisper' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}
