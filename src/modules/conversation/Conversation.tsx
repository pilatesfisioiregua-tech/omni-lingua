import { Placeholder } from '../_shared/Placeholder'

export function Conversation() {
  return (
    <Placeholder
      title="Conversación con IA · voice-to-voice"
      phase="4.6"
      description="Diálogo voz a voz con Claude Sonnet. Escenarios (café · aeropuerto · entrevista · debate). Personas (amigo · profesor · compañero viaje). Niveles A1/A2/B1/B2. Feedback inline + Linguistic Mirror + Replay de peores turnos."
      bullets={[
        'AIConversationPartner · Web Speech in → Claude → TTS out',
        'Selector escenarios + persona + nivel',
        'Feedback inline · errores + vocab que pudiste usar + pronunciación si transcript difiere',
        'Linguistic Mirror (#7) · "dijiste X, querías decir Y" (patrón BPF E5-E7)',
        'Conversational Replay (#9) · re-juega los 3 peores turnos con texto correcto',
        'Persistencia · histórico conversaciones + "tus errores más frecuentes"',
      ]}
    />
  )
}
