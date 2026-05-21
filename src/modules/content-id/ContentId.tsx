import { Placeholder } from '../_shared/Placeholder'

export function ContentId() {
  return (
    <Placeholder
      title="Shazam de inglés · identificación + transcripción"
      phase="4.5"
      description="Captura 15s audio (video YouTube, podcast, serie). ACRCloud identifica · Modal Whisper transcribe si es nuevo · TranscriptViewer con palabras clickables · estimación CEFR + sentence mining auto."
      bullets={[
        'ContentIdentifier · captura 15s audio · ACRCloud (100/mes free)',
        'Modal Whisper · transcribe contenido no reconocido',
        'TranscriptViewer · palabras clickables → definición + agregar a vocab deck',
        'DifficultyMeter · LLM estima CEFR (A1/A2/B1/B2/C1) por vocab + sintaxis',
        'Sentence Mining (Refold/MIA) · marca frases i+1 (1 palabra desconocida)',
      ]}
    />
  )
}
