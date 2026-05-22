import { env } from './_env.js'
/**
 * ACRCloud audio identification · F4.5.
 *
 * Recibe audio (multipart form `audio`) → POST a ACRCloud Identify API
 * con firma HMAC-SHA1 (data_type=audio · sample_bytes).
 *
 * Privacy: ACRCloud procesa 15s aislados · no almacena el audio.
 *
 * Docs: https://docs.acrcloud.com/reference/identification-api
 */

import crypto from 'node:crypto'
import { Buffer } from 'node:buffer'

type AcrMusic = {
  title?: string
  artists?: { name: string }[]
  album?: { name?: string }
  release_date?: string
  external_metadata?: Record<string, unknown>
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json(405, { error: 'method_not_allowed' })
  }

  const host = env('ACRCLOUD_HOST')
  const key = env('ACRCLOUD_KEY')
  const secret = env('ACRCLOUD_SECRET')
  if (!host || !key || !secret) {
    return json(200, {
      matched: false,
      demo: true,
      message: 'ACRCloud no configurado · modo demo',
    })
  }

  let audioBytes: Uint8Array
  const contentType = req.headers.get('content-type') ?? ''
  try {
    if (contentType.startsWith('multipart/form-data')) {
      const form = await req.formData()
      const file = form.get('audio')
      if (!file || typeof file === 'string') {
        return json(400, { error: 'missing_audio' })
      }
      audioBytes = new Uint8Array(await file.arrayBuffer())
    } else {
      const buf = await req.arrayBuffer()
      audioBytes = new Uint8Array(buf)
    }
  } catch (e) {
    return json(400, { error: 'invalid_body', detail: errMsg(e) })
  }

  if (audioBytes.length === 0) {
    return json(400, { error: 'empty_audio' })
  }

  try {
    const httpMethod = 'POST'
    const httpUri = '/v1/identify'
    const dataType = 'audio'
    const signatureVersion = '1'
    const timestamp = Math.floor(Date.now() / 1000).toString()

    const stringToSign = [
      httpMethod,
      httpUri,
      key,
      dataType,
      signatureVersion,
      timestamp,
    ].join('\n')

    const signature = crypto.createHmac('sha1', secret).update(stringToSign).digest('base64')

    const boundary = '----acr-' + crypto.randomBytes(8).toString('hex')
    const body = buildMultipart(boundary, {
      access_key: key,
      sample_bytes: audioBytes.length.toString(),
      timestamp,
      signature,
      data_type: dataType,
      signature_version: signatureVersion,
    }, audioBytes)

    const url = `https://${host}/v1/identify`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': `multipart/form-data; boundary=${boundary}`,
      },
      body: new Uint8Array(body),
    })
    const data = (await res.json()) as { status?: { code: number; msg: string }; metadata?: { music?: AcrMusic[] } }

    if (data.status?.code !== 0) {
      return json(200, {
        matched: false,
        demo: false,
        message: data.status?.msg ?? 'ACRCloud no encontró match',
        code: data.status?.code,
      })
    }

    const music = data.metadata?.music?.[0]
    if (!music) {
      return json(200, { matched: false, demo: false, message: 'No music metadata in response' })
    }

    return json(200, {
      matched: true,
      demo: false,
      title: music.title ?? 'Untitled',
      artist: music.artists?.[0]?.name ?? '',
      album: music.album?.name ?? '',
      release_date: music.release_date ?? '',
      source: 'acrcloud',
    })
  } catch (e) {
    return json(500, { error: 'acrcloud_error', detail: errMsg(e) })
  }
}

function buildMultipart(
  boundary: string,
  fields: Record<string, string>,
  audio: Uint8Array,
): Buffer {
  const parts: Buffer[] = []
  for (const [name, value] of Object.entries(fields)) {
    parts.push(
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`),
    )
  }
  parts.push(
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="sample"; filename="sample.webm"\r\nContent-Type: audio/webm\r\n\r\n`,
    ),
  )
  parts.push(Buffer.from(audio))
  parts.push(Buffer.from(`\r\n--${boundary}--\r\n`))
  return Buffer.concat(parts)
}

function json(status: number, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}
