/**
 * Minimal pairs · pares que rompen al hispanohablante.
 * Curados por contraste fonético crítico (Flege SLM 1995).
 */

export type MinimalPair = {
  a: { word: string; ipa: string; meaningEs: string }
  b: { word: string; ipa: string; meaningEs: string }
  contrast: string // qué fonemas se contrastan
  tip: string
}

export const MINIMAL_PAIRS: MinimalPair[] = [
  {
    a: { word: 'ship', ipa: '/ʃɪp/', meaningEs: 'barco' },
    b: { word: 'sheep', ipa: '/ʃiːp/', meaningEs: 'oveja' },
    contrast: '/ɪ/ vs /iː/',
    tip: 'sheep es más larga y tensa · ship más corta y relajada',
  },
  {
    a: { word: 'live', ipa: '/lɪv/', meaningEs: 'vivir' },
    b: { word: 'leave', ipa: '/liːv/', meaningEs: 'irse / dejar' },
    contrast: '/ɪ/ vs /iː/',
    tip: 'leave tiene vocal larga',
  },
  {
    a: { word: 'bit', ipa: '/bɪt/', meaningEs: 'trozo' },
    b: { word: 'beat', ipa: '/biːt/', meaningEs: 'golpe / vencer' },
    contrast: '/ɪ/ vs /iː/',
    tip: 'beat es más estirada hacia los labios',
  },
  {
    a: { word: 'full', ipa: '/fʊl/', meaningEs: 'lleno' },
    b: { word: 'fool', ipa: '/fuːl/', meaningEs: 'tonto' },
    contrast: '/ʊ/ vs /uː/',
    tip: 'fool tiene labios más redondeados y vocal larga',
  },
  {
    a: { word: 'cat', ipa: '/kæt/', meaningEs: 'gato' },
    b: { word: 'cut', ipa: '/kʌt/', meaningEs: 'cortar' },
    contrast: '/æ/ vs /ʌ/',
    tip: 'cat con boca más abierta · cut neutro corto',
  },
  {
    a: { word: 'bad', ipa: '/bæd/', meaningEs: 'malo' },
    b: { word: 'bed', ipa: '/bed/', meaningEs: 'cama' },
    contrast: '/æ/ vs /e/',
    tip: 'bad abierta y vibrante · bed más cerrada',
  },
  {
    a: { word: 'think', ipa: '/θɪŋk/', meaningEs: 'pensar' },
    b: { word: 'sink', ipa: '/sɪŋk/', meaningEs: 'fregadero / hundirse' },
    contrast: '/θ/ vs /s/',
    tip: 'think: lengua entre dientes · sink: lengua detrás',
  },
  {
    a: { word: 'this', ipa: '/ðɪs/', meaningEs: 'esto' },
    b: { word: 'dis', ipa: '/dɪs/', meaningEs: '(slang) faltar al respeto' },
    contrast: '/ð/ vs /d/',
    tip: 'this con lengua entre dientes · dis con lengua detrás',
  },
  {
    a: { word: 'very', ipa: '/ˈveri/', meaningEs: 'muy' },
    b: { word: 'berry', ipa: '/ˈberi/', meaningEs: 'baya' },
    contrast: '/v/ vs /b/',
    tip: 'very: dientes en labio · berry: labios juntos',
  },
  {
    a: { word: 'right', ipa: '/raɪt/', meaningEs: 'correcto / derecha' },
    b: { word: 'light', ipa: '/laɪt/', meaningEs: 'luz / ligero' },
    contrast: '/r/ vs /l/',
    tip: 'right: lengua curvada hacia atrás · light: lengua arriba contra paladar',
  },
]

// Frases para Shadowing — incrementan complejidad
export type ShadowingPhrase = {
  text: string
  ipa: string
  meaningEs: string
  level: 'A1' | 'A2' | 'B1'
}

export const SHADOWING_PHRASES: ShadowingPhrase[] = [
  { text: 'Nice to meet you.', ipa: '/naɪs tə miːt juː/', meaningEs: 'Encantado de conocerte.', level: 'A1' },
  { text: 'I am from Spain.', ipa: '/aɪ æm frəm speɪn/', meaningEs: 'Soy de España.', level: 'A1' },
  { text: 'What time is it?', ipa: '/wɒt taɪm ɪz ɪt/', meaningEs: '¿Qué hora es?', level: 'A1' },
  { text: 'I would like a coffee, please.', ipa: '/aɪ wʊd laɪk ə ˈkɒfi pliːz/', meaningEs: 'Querría un café, por favor.', level: 'A2' },
  { text: 'How long does it take to get there?', ipa: '/haʊ lɒŋ dʌz ɪt teɪk tə ɡet ðeər/', meaningEs: '¿Cuánto se tarda en llegar?', level: 'A2' },
  { text: 'I have been working here for two years.', ipa: '/aɪ hæv bɪn ˈwɜːkɪŋ hɪər fɔːr tuː jɪərz/', meaningEs: 'Llevo trabajando aquí dos años.', level: 'B1' },
  { text: 'If I had known, I would have helped.', ipa: '/ɪf aɪ hæd noʊn aɪ wʊd hæv helpt/', meaningEs: 'Si lo hubiera sabido, habría ayudado.', level: 'B1' },
]
