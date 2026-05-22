export type Scenario = {
  id: string
  label: string
  emoji: string
  description: string
  systemHint: string
}

export const SCENARIOS: Scenario[] = [
  { id: 'cafe', label: 'Café', emoji: '☕', description: 'Pedir un café · small talk con barista', systemHint: 'You are a friendly barista in London. Keep replies short.' },
  { id: 'airport', label: 'Aeropuerto', emoji: '✈️', description: 'Check-in · seguridad · perderse', systemHint: 'You work at an airport check-in counter. Be patient and clear.' },
  { id: 'interview', label: 'Entrevista', emoji: '💼', description: 'Entrevista trabajo casual', systemHint: 'You are interviewing a candidate. Ask about background and motivation.' },
  { id: 'small_talk', label: 'Small talk', emoji: '🗨️', description: 'Conversación trivial · tiempo · fin de semana', systemHint: 'You met the user at a casual event. Make small talk.' },
  { id: 'debate', label: 'Debate suave', emoji: '⚖️', description: 'Discutir un tema con opinión', systemHint: 'You debate with the user on a neutral topic. Be respectful but pointed.' },
]

export type Persona = {
  id: string
  label: string
  description: string
  systemHint: string
}

export const PERSONAS: Persona[] = [
  { id: 'casual', label: 'Amigo casual', description: 'Relajado · slang ligero · paciente', systemHint: 'Talk like a friendly peer. Use casual contractions.' },
  { id: 'strict', label: 'Profesor estricto', description: 'Corrige errores · vocab preciso', systemHint: 'You are a strict English tutor. Correct mistakes inline.' },
  { id: 'travel', label: 'Compañero viaje', description: 'Curioso · pregunta mucho · empático', systemHint: 'You are a curious travel companion. Ask follow-up questions.' },
]

export type Level = 'A1' | 'A2' | 'B1' | 'B2'

export const LEVELS: { id: Level; label: string; description: string }[] = [
  { id: 'A1', label: 'A1 básico', description: 'Vocab 500 palabras · presente simple · frases muy cortas' },
  { id: 'A2', label: 'A2 elemental', description: 'Pasado simple · futuro · vocab 1000' },
  { id: 'B1', label: 'B1 intermedio', description: 'Present perfect · condicionales · vocab 2000' },
  { id: 'B2', label: 'B2 avanzado', description: 'Cualquier tiempo verbal · matices · vocab 4000+' },
]
