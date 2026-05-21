/** ACRCloud identify · F4.5 stub */
export const config = { runtime: 'edge' }

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  if (!process.env.ACRCLOUD_HOST) {
    return new Response(
      JSON.stringify({ matched: false, demo: true, message: 'ACRCloud no configurado · modo demo' }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    )
  }
  return new Response(JSON.stringify({ matched: false, message: 'F4.5 stub · ACRCloud lookup' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}
