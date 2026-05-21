/** Cron mensual · Claude Sonnet + web_search busca updates curriculum · F4.7 stub */

export default async function handler() {
  return new Response(
    JSON.stringify({
      ok: true,
      message: 'curriculum-research stub · F4.7 ejecutará Claude Sonnet + web_search mensual',
      proposed_changes: [],
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  )
}
