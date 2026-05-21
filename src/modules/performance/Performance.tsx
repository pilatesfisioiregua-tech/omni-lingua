import { Placeholder } from '../_shared/Placeholder'

export function Performance() {
  return (
    <Placeholder
      title="Análisis boca/labios + grabación autocrítica"
      phase="4.9"
      description="MediaPipe Face Landmarker detecta apertura de labios y posición de lengua aproximada (/θ/ entre dientes · /r/ americana · /ɪ/ vs /iː/). Reglas heurísticas + feedback visual tiempo real. Archivo de grabaciones con autocrítica IA (anti self-delusion)."
      bullets={[
        'MouthAnalyzer · MediaPipe Face Landmarker · feedback visual tiempo real',
        'RecordingArchive · audio + video opt-in de speaking',
        'Autocrítica IA · usuario primero auto-evalúa · luego ve análisis Claude',
        'Phonetic Distance Map (#3) · heatmap IPA con accuracy + ROI marginal por fonema',
      ]}
    />
  )
}
