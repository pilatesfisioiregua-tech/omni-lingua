/**
 * Phonemes IPA EN + contrastes ES.
 *
 * Curado para hispanohablantes A1-B1. Cada fonema incluye:
 * - Símbolo IPA (target)
 * - Ejemplos minimal pair · 1-2 palabras
 * - Contraste ES si aplica (qué hacemos los hispanohablantes mal)
 * - Categoría: vowel · consonant · diphthong · weak-form
 *
 * Anclas científicas:
 * - Contrastive analysis · Cummins 1979
 * - L2 phoneme transfer · Flege 1995 SLM
 * - Spanish-English phonetic interference · Major 2008
 */

export type PhonemeCategory = 'vowel' | 'consonant' | 'diphthong' | 'weak-form'
export type PhonemeDifficulty = 'easy' | 'medium' | 'hard'

export type Phoneme = {
  id: string
  ipa: string
  category: PhonemeCategory
  difficulty: PhonemeDifficulty
  examples: { word: string; ipa: string; meaningEs: string }[]
  esContrast?: string // qué hacemos los hispanohablantes mal
  tip?: string // pista articulatoria
}

export const PHONEMES: Phoneme[] = [
  // === VOWELS ===
  {
    id: 'i_long',
    ipa: '/iː/',
    category: 'vowel',
    difficulty: 'medium',
    examples: [
      { word: 'sheep', ipa: '/ʃiːp/', meaningEs: 'oveja' },
      { word: 'leave', ipa: '/liːv/', meaningEs: 'dejar' },
    ],
    esContrast: 'Los hispanohablantes lo confundimos con /ɪ/ corta. Es más larga y tensa.',
    tip: 'Sonríe ligeramente y alarga el sonido. Como una "i" española muy estirada.',
  },
  {
    id: 'i_short',
    ipa: '/ɪ/',
    category: 'vowel',
    difficulty: 'hard',
    examples: [
      { word: 'ship', ipa: '/ʃɪp/', meaningEs: 'barco' },
      { word: 'bit', ipa: '/bɪt/', meaningEs: 'trozo' },
    ],
    esContrast: '⚠️ No existe en español. Tendemos a pronunciarla como /iː/ larga.',
    tip: 'Más relajada, más corta y más grave que la /iː/. Mandíbula menos tensa.',
  },
  {
    id: 'schwa',
    ipa: '/ə/',
    category: 'weak-form',
    difficulty: 'hard',
    examples: [
      { word: 'about', ipa: '/əˈbaʊt/', meaningEs: 'sobre' },
      { word: 'sofa', ipa: '/ˈsoʊfə/', meaningEs: 'sofá' },
    ],
    esContrast:
      '⚠️ El fonema más común del inglés (40% de errores). Aparece en sílabas átonas. Tendemos a vocalizarlas como en español.',
    tip: 'Sonido neutro, boca relajada, como gruñido suave: "uh". Crítico para sonar natural.',
  },
  {
    id: 'ae',
    ipa: '/æ/',
    category: 'vowel',
    difficulty: 'hard',
    examples: [
      { word: 'cat', ipa: '/kæt/', meaningEs: 'gato' },
      { word: 'man', ipa: '/mæn/', meaningEs: 'hombre' },
    ],
    esContrast: '⚠️ Entre /a/ y /e/ españolas. Tendemos a pronunciar /e/.',
    tip: 'Abre la boca como para "a", pero sonríe ligeramente. Más vibrante que "e".',
  },
  {
    id: 'u_short',
    ipa: '/ʊ/',
    category: 'vowel',
    difficulty: 'medium',
    examples: [
      { word: 'book', ipa: '/bʊk/', meaningEs: 'libro' },
      { word: 'good', ipa: '/ɡʊd/', meaningEs: 'bueno' },
    ],
    esContrast: 'Confusión con /uː/ larga. Es corta y más relajada.',
    tip: 'Labios menos redondeados que en "u" española.',
  },

  // === CONSONANTS ===
  {
    id: 'th_voiceless',
    ipa: '/θ/',
    category: 'consonant',
    difficulty: 'medium',
    examples: [
      { word: 'think', ipa: '/θɪŋk/', meaningEs: 'pensar' },
      { word: 'three', ipa: '/θriː/', meaningEs: 'tres' },
    ],
    esContrast:
      'En España existe ("zapato"), en Latam se sustituye por /s/. Para acento americano se confunde con /s/ o /t/.',
    tip: 'Lengua entre los dientes, sopla aire sin vibrar.',
  },
  {
    id: 'th_voiced',
    ipa: '/ð/',
    category: 'consonant',
    difficulty: 'hard',
    examples: [
      { word: 'this', ipa: '/ðɪs/', meaningEs: 'esto' },
      { word: 'mother', ipa: '/ˈmʌðər/', meaningEs: 'madre' },
    ],
    esContrast: 'Similar a la "d" entre vocales del español ("nada"), pero más relajada.',
    tip: 'Lengua entre dientes, igual que /θ/ pero CON vibración (toca tu garganta).',
  },
  {
    id: 'v',
    ipa: '/v/',
    category: 'consonant',
    difficulty: 'hard',
    examples: [
      { word: 'very', ipa: '/ˈveri/', meaningEs: 'muy' },
      { word: 'voice', ipa: '/vɔɪs/', meaningEs: 'voz' },
    ],
    esContrast: '⚠️ En español NO existe diferenciada de /b/. Tendemos a decir "bery" en lugar de "very".',
    tip: 'Dientes superiores tocan el labio inferior, vibración.',
  },
  {
    id: 'r_american',
    ipa: '/r/',
    category: 'consonant',
    difficulty: 'medium',
    examples: [
      { word: 'red', ipa: '/red/', meaningEs: 'rojo' },
      { word: 'car', ipa: '/kɑːr/', meaningEs: 'coche' },
    ],
    esContrast: '⚠️ La "r" inglesa NO vibra. La hispana sí. Es retroflexa (lengua hacia atrás).',
    tip: 'Lengua se curva hacia atrás sin tocar paladar. Como un gruñido relajado.',
  },
  {
    id: 'sh',
    ipa: '/ʃ/',
    category: 'consonant',
    difficulty: 'easy',
    examples: [
      { word: 'she', ipa: '/ʃiː/', meaningEs: 'ella' },
      { word: 'fish', ipa: '/fɪʃ/', meaningEs: 'pez' },
    ],
    esContrast: 'No existe en español estándar. Como "shhh" para pedir silencio.',
    tip: 'Labios redondeados, lengua arriba sin tocar paladar, aire constante.',
  },

  // === DIPHTHONGS ===
  {
    id: 'ai',
    ipa: '/aɪ/',
    category: 'diphthong',
    difficulty: 'easy',
    examples: [
      { word: 'time', ipa: '/taɪm/', meaningEs: 'tiempo' },
      { word: 'my', ipa: '/maɪ/', meaningEs: 'mi' },
    ],
    esContrast: 'Existe en español ("aire"). Fácil para hispanohablantes.',
    tip: 'Empieza en "a" y desliza hacia "i".',
  },
  {
    id: 'ei',
    ipa: '/eɪ/',
    category: 'diphthong',
    difficulty: 'medium',
    examples: [
      { word: 'day', ipa: '/deɪ/', meaningEs: 'día' },
      { word: 'name', ipa: '/neɪm/', meaningEs: 'nombre' },
    ],
    esContrast: 'Confundimos con /e/ española. Es diptongo /e+ɪ/.',
    tip: 'Empieza en "e", desliza hacia "i". No es vocal pura.',
  },
  {
    id: 'ou',
    ipa: '/oʊ/',
    category: 'diphthong',
    difficulty: 'medium',
    examples: [
      { word: 'go', ipa: '/ɡoʊ/', meaningEs: 'ir' },
      { word: 'home', ipa: '/hoʊm/', meaningEs: 'casa' },
    ],
    esContrast: 'Confundimos con /o/ española. Es diptongo /o+ʊ/.',
    tip: 'Empieza en "o", desliza hacia "u". Labios se redondean al final.',
  },
]

export type PhonemePreset = {
  id: string
  label: string
  description: string
  phonemeIds: string[]
}

export const PHONEME_PRESETS: PhonemePreset[] = [
  {
    id: 'basics',
    label: 'Básicos',
    description: 'Diptongos fáciles + consonantes nuevas pero asequibles',
    phonemeIds: ['ai', 'ei', 'ou', 'sh'],
  },
  {
    id: 'tense_lax_vowels',
    label: 'Vocales tensas/laxas',
    description: '/iː/ vs /ɪ/ · /uː/ vs /ʊ/ · /æ/. Las que rompen ship/sheep.',
    phonemeIds: ['i_long', 'i_short', 'ae', 'u_short'],
  },
  {
    id: 'th_r_v',
    label: 'Consonantes th/r/v',
    description: 'Los 3 dolores: think, very, red. Los más distintivos del inglés.',
    phonemeIds: ['th_voiceless', 'th_voiced', 'v', 'r_american'],
  },
  {
    id: 'diphthongs',
    label: 'Diptongos',
    description: 'time, day, go. Confundidos con vocales puras del español.',
    phonemeIds: ['ai', 'ei', 'ou'],
  },
  {
    id: 'weak_forms',
    label: 'Weak forms (schwa)',
    description: 'El fonema más común del inglés. 40% del acento natural depende de él.',
    phonemeIds: ['schwa'],
  },
]

export function getPhonemeById(id: string): Phoneme | undefined {
  return PHONEMES.find((p) => p.id === id)
}

export function getPreset(id: string): PhonemePreset | undefined {
  return PHONEME_PRESETS.find((p) => p.id === id)
}
