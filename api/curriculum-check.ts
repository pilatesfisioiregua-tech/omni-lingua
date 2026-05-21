/** Check curriculum updates pendientes · F4.7 stub */

export default async function handler() {
  return new Response(JSON.stringify({ updates_available: false, version: '0.0.0' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}
