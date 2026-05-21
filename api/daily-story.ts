/** Generative Comprehensible Input · mini-historia 200pal personalizada · Diferenciador #2 · F4.8 stub */
export const config = { runtime: 'edge' }

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  return new Response(
    JSON.stringify({
      story:
        'Daily Story (Diferenciador #2) generará en F4.8 una mini-historia 200pal personalizada cada día con Claude Haiku usando tu nivel + vocab activo + wishlist contents.',
      cefr: 'A2',
      vocabUsed: [],
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  )
}
