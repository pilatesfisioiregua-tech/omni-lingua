import { Placeholder } from '../_shared/Placeholder'

export function Listening() {
  return (
    <Placeholder
      title="Listening + Producción"
      phase="3"
      description="Pares mínimos (ship/sheep · live/leave · bit/beat). Shadowing técnica (Tanaka) con grabación y diff. Live transcriber con auto-feedback inmediato. Output forzado (Swain 1985)."
      bullets={[
        'ListeningTrainer · minimal pairs gamificado con Dexie tracking',
        'ShadowingDrill · audio TTS x3 · graba · compara con Web Speech ASR · accuracy %',
        'LiveTranscriber · habla y ve transcripción tiempo real',
        'Prosodic chunking · stress patterns + weak forms schwa (Mathy 2023)',
      ]}
    />
  )
}
