import { Placeholder } from '../_shared/Placeholder'

export function Pronunciation() {
  return (
    <Placeholder
      title="Pronunciación"
      phase="1"
      description="Captura tu voz con Web Speech API + análisis pitch con Pitchy. Entrenador de fonemas IPA (/θ/, /ð/, /ɪ/ vs /iː/) con feedback visual."
      bullets={[
        'PronunciationAnalyzer · Web Speech + Pitchy entonación',
        'PhonemeTrainer · IPA del sonido objetivo + comparación con grabación',
        'TongueTwister drill · Tone.js metrónomo BPM ajustable',
        '5 presets dificultad · básicos · vocales tensas/laxas · th/r/v · diptongos · weak forms',
        'Alimenta Phonetic Distance Map (diferenciador #3) con datos GOP per phoneme',
      ]}
    />
  )
}
