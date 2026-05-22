// Type declarations para Vercel Node functions sin @types/node completo.
declare const process: {
  env: Record<string, string | undefined>
}
declare module 'node:process' {
  const process: { env: Record<string, string | undefined> }
  export default process
}
declare module 'node:crypto' {
  interface Hmac {
    update(data: string | Uint8Array): Hmac
    digest(encoding: 'base64' | 'hex'): string
  }
  export function createHmac(algorithm: string, key: string): Hmac
  export function randomBytes(size: number): { toString(encoding: 'hex' | 'base64'): string }
}
declare module 'node:buffer' {
  export class Buffer extends Uint8Array {
    static from(input: string | Uint8Array | ArrayBuffer, encoding?: string): Buffer
    static concat(list: Buffer[]): Buffer
  }
}
