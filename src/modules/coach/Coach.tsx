import { Placeholder } from '../_shared/Placeholder'

export function Coach() {
  return (
    <Placeholder
      title="Coach IA"
      phase="4.8"
      description="Chat dedicado Claude Sonnet streaming (distinto del sidebar). Context inyectado: nivel · skills · errores frecuentes · objetivo · wishlist · fatiga reciente. Tool use + 200 links curados + modo proactivo."
      bullets={[
        'Chat Claude Sonnet streaming · context completo del usuario',
        'Tools · recommend_drill · add_word_to_deck · link_curated_resource · start_scenario',
        'BD curada ~200 links pedagógicos (BBC LE · EnglishClass101 · MOSAlingua)',
        'Modo proactivo · detecta patrones · max 1 notif/día',
        'Daily Story (#2) · mini-historia 200pal diaria personalizada (Generative CI)',
        'Confidence calibrada · outputs marcan [high/medium/low]',
      ]}
    />
  )
}
