// Helper para leer env vars en Vercel Node functions sin @types/node.
// Usa globalThis (que TypeScript sí conoce) con type cast seguro.

type ProcessLike = { env: Record<string, string | undefined> }

export function env(name: string): string | undefined {
  const g = globalThis as { process?: ProcessLike }
  return g.process?.env?.[name]
}
