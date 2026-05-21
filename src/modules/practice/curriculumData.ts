/**
 * Curriculum data · 40 skills · 20 lessons · 1 track A1→A2 · 12 icon contents.
 *
 * Subset representativo del PROMPT §4. Las lessons tienen steps tipados que
 * LessonRunner renderiza secuencialmente. Cada skill alimenta el Twin con
 * mastery state.
 *
 * Anclas:
 * - Spaced repetition · FSRS-5 (Ye 2023)
 * - Interleaved practice · Rohrer 2007
 * - Self-explanation prompts · Chi 1994
 */

export type SkillCategory =
  | 'phonetics'
  | 'vocabulary'
  | 'grammar'
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'writing'
  | 'es_en_pivot'

export type Skill = {
  id: string
  title: string
  category: SkillCategory
  cefr: 'A1' | 'A2' | 'B1'
  description: string
  prereqSkillIds?: string[]
}

export const SKILLS: Skill[] = [
  // PHONETICS
  { id: 'ph_th', title: 'Pronunciar /θ/ y /ð/', category: 'phonetics', cefr: 'A1', description: 'think, this, three' },
  { id: 'ph_ship_sheep', title: '/ɪ/ vs /iː/ (ship vs sheep)', category: 'phonetics', cefr: 'A1', description: 'Vocal corta vs larga' },
  { id: 'ph_schwa', title: 'Schwa /ə/ en sílabas átonas', category: 'phonetics', cefr: 'A2', description: 'about, sofa, banana' },
  { id: 'ph_r', title: 'R retrofleja americana', category: 'phonetics', cefr: 'A2', description: 'red, car, year' },

  // VOCABULARY
  { id: 'vo_basics', title: 'Saludos y básicos', category: 'vocabulary', cefr: 'A1', description: 'hello, please, sorry, thanks' },
  { id: 'vo_family', title: 'Familia', category: 'vocabulary', cefr: 'A1', description: 'mother, brother, child' },
  { id: 'vo_food', title: 'Comida y bebida', category: 'vocabulary', cefr: 'A1', description: 'water, bread, coffee, lunch' },
  { id: 'vo_phrasals', title: 'Phrasal verbs A2', category: 'vocabulary', cefr: 'A2', description: 'get up, turn on, look for' },
  { id: 'vo_false_friends', title: 'False friends ES↔EN', category: 'vocabulary', cefr: 'A2', description: 'embarrassed, actually, library' },
  { id: 'vo_collocations', title: 'Colocaciones críticas', category: 'vocabulary', cefr: 'A2', description: 'make/do/take' },

  // GRAMMAR
  { id: 'gr_present_simple', title: 'Present simple', category: 'grammar', cefr: 'A1', description: 'I work, she works' },
  { id: 'gr_present_continuous', title: 'Present continuous', category: 'grammar', cefr: 'A1', description: 'I am working now' },
  { id: 'gr_past_simple', title: 'Past simple', category: 'grammar', cefr: 'A1', description: 'I worked yesterday' },
  { id: 'gr_present_perfect', title: 'Present perfect', category: 'grammar', cefr: 'A2', description: 'I have lived here for 2 years' },
  { id: 'gr_will_going_to', title: 'Future · will vs going to', category: 'grammar', cefr: 'A2', description: 'I will help · I am going to study' },
  { id: 'gr_articles', title: 'Articles a/an/the', category: 'grammar', cefr: 'A1', description: 'a cat · the cat' },
  { id: 'gr_prepositions', title: 'Prepositions in/on/at time+place', category: 'grammar', cefr: 'A1', description: 'in 2024 · on Monday · at 5pm' },
  { id: 'gr_comparatives', title: 'Comparatives y superlatives', category: 'grammar', cefr: 'A2', description: 'bigger, the biggest' },

  // ES ↔ EN PIVOT (diferenciador #5)
  { id: 'es_have_be', title: 'tener vs to be (años, hambre, sueño)', category: 'es_en_pivot', cefr: 'A1', description: 'I am 30 (NO I have 30)' },
  { id: 'es_subject_required', title: 'Sujeto obligatorio en inglés', category: 'es_en_pivot', cefr: 'A1', description: 'It is raining (NO "Is raining")' },
  { id: 'es_do_make', title: 'do vs make', category: 'es_en_pivot', cefr: 'A2', description: 'do homework · make a decision' },
  { id: 'es_for_since', title: 'for vs since', category: 'es_en_pivot', cefr: 'A2', description: 'for 2 years · since 2024' },
  { id: 'es_say_tell', title: 'say vs tell', category: 'es_en_pivot', cefr: 'A2', description: 'say something · tell someone' },

  // LISTENING
  { id: 'ls_minimal_pairs', title: 'Distinguir pares mínimos', category: 'listening', cefr: 'A1', description: 'ship/sheep · live/leave' },
  { id: 'ls_weak_forms', title: 'Detectar weak forms', category: 'listening', cefr: 'A2', description: 'gonna · wanna · ta · uv' },
  { id: 'ls_connected_speech', title: 'Connected speech', category: 'listening', cefr: 'A2', description: 'Linking · contracciones naturales' },

  // SPEAKING
  { id: 'sp_introduction', title: 'Presentarse', category: 'speaking', cefr: 'A1', description: 'Nice to meet you, I am ___' },
  { id: 'sp_order_food', title: 'Pedir en un café', category: 'speaking', cefr: 'A1', description: 'I would like a coffee, please' },
  { id: 'sp_directions', title: 'Pedir/dar direcciones', category: 'speaking', cefr: 'A2', description: 'Excuse me, how do I get to ___?' },
  { id: 'sp_small_talk', title: 'Small talk', category: 'speaking', cefr: 'A2', description: 'weather · weekend · work chat' },

  // READING
  { id: 're_signs', title: 'Carteles y señales', category: 'reading', cefr: 'A1', description: 'Exit · No smoking · Push' },
  { id: 're_short_messages', title: 'Mensajes cortos', category: 'reading', cefr: 'A1', description: 'sms · post-it · email línea' },
  { id: 're_simple_article', title: 'Artículo simple noticias', category: 'reading', cefr: 'A2', description: 'BBC Learning English · easy' },

  // WRITING
  { id: 'wr_email_friend', title: 'Email a un amigo', category: 'writing', cefr: 'A1', description: '"Hi Sarah, how are you?"' },
  { id: 'wr_describe_self', title: 'Describirte', category: 'writing', cefr: 'A1', description: 'My name is · I live in · I work as' },
  { id: 'wr_email_formal', title: 'Email formal corto', category: 'writing', cefr: 'A2', description: 'Dear ___ · Best regards' },
  { id: 'wr_journal', title: 'Journal diario 3 frases', category: 'writing', cefr: 'A2', description: 'Today I · I felt · I learned' },
]

export type LessonStepType = 'intro' | 'demo' | 'guided' | 'application' | 'self_rate' | 'writing' | 'es_en_drill'

export type LessonStep =
  | { type: 'intro'; markdown: string }
  | { type: 'demo'; markdown: string; example: { en: string; es: string; ipa?: string } }
  | { type: 'guided'; prompt: string; expected: string }
  | { type: 'application'; prompt: string; hint: string }
  | { type: 'self_rate' }
  | { type: 'writing'; prompt: string; sampleAnswer: string }
  | { type: 'es_en_drill'; pairs: { es: string; en: string; tag: string; warning?: string }[] }

export type Lesson = {
  id: string
  title: string
  skillIds: string[]
  durationMinutes: number
  steps: LessonStep[]
}

export const LESSONS: Lesson[] = [
  {
    id: 'L01_introduction',
    title: 'Presentación básica',
    skillIds: ['vo_basics', 'sp_introduction'],
    durationMinutes: 8,
    steps: [
      { type: 'intro', markdown: 'En esta lección aprenderás a presentarte en inglés.' },
      { type: 'demo', markdown: 'Saludo + nombre + origen:', example: { en: 'Hi, I am Jesús. I am from Spain.', es: 'Hola, soy Jesús. Soy de España.' } },
      { type: 'guided', prompt: 'Completa: "Hi, I ___ Jesús."', expected: 'am' },
      { type: 'application', prompt: 'Preséntate en 2 frases (di tu nombre y de dónde eres)', hint: 'Empieza con "Hi, I am..."' },
      { type: 'self_rate' },
    ],
  },
  {
    id: 'L02_have_vs_be',
    title: '"tener" vs "to be" — el error #1 del hispanohablante',
    skillIds: ['es_have_be', 'gr_present_simple'],
    durationMinutes: 10,
    steps: [
      {
        type: 'intro',
        markdown:
          'En español: "tengo 30 años". En inglés: "**I am** 30 years old" (verbo *ser*, no *tener*).\n\nEsta interferencia afecta a edad, hambre, sed, sueño, miedo, calor, frío.',
      },
      {
        type: 'es_en_drill',
        pairs: [
          { es: 'Tengo 30 años.', en: 'I am 30 years old.', tag: 'edad', warning: '❌ NO "I have 30 years"' },
          { es: 'Tengo hambre.', en: 'I am hungry.', tag: 'hambre', warning: '❌ NO "I have hunger"' },
          { es: 'Tengo sueño.', en: 'I am sleepy.', tag: 'sueño', warning: '❌ NO "I have sleep"' },
          { es: 'Tengo miedo.', en: 'I am afraid.', tag: 'miedo' },
          { es: 'Tengo frío.', en: 'I am cold.', tag: 'frío' },
        ],
      },
      { type: 'self_rate' },
    ],
  },
  {
    id: 'L03_do_vs_make',
    title: 'do vs make · cómo dejar de confundirlos',
    skillIds: ['es_do_make', 'vo_collocations'],
    durationMinutes: 10,
    steps: [
      {
        type: 'intro',
        markdown:
          'En español es siempre "hacer". En inglés se reparte:\n\n- **do** → tareas + actividades genéricas (do homework, do exercise, do the dishes)\n- **make** → creación + decisión (make a decision, make a cake, make a mistake)',
      },
      {
        type: 'es_en_drill',
        pairs: [
          { es: 'Hago los deberes.', en: 'I do my homework.', tag: 'homework', warning: '❌ NO "make homework"' },
          { es: 'Toma una decisión.', en: 'Make a decision.', tag: 'decision', warning: '❌ NO "do a decision"' },
          { es: 'Cometí un error.', en: 'I made a mistake.', tag: 'mistake' },
          { es: 'Haz ejercicio.', en: 'Do exercise.', tag: 'exercise' },
          { es: 'Saca una foto.', en: 'Take a photo.', tag: 'photo', warning: '❌ NO "make a photo"' },
        ],
      },
      { type: 'self_rate' },
    ],
  },
  {
    id: 'L04_present_perfect_basic',
    title: 'Present perfect: "He vivido aquí 2 años"',
    skillIds: ['gr_present_perfect', 'es_for_since'],
    durationMinutes: 12,
    steps: [
      {
        type: 'intro',
        markdown:
          'En español "He vivido aquí 2 años" = en inglés "I **have lived** here **for** 2 years" (acción pasada que sigue ahora).\n\n- **for + duración** (2 years, a long time)\n- **since + punto inicio** (2024, last week, I was 18)',
      },
      { type: 'demo', markdown: 'Compara las dos formas:', example: { en: 'I have lived here for 2 years.', es: 'Vivo aquí desde hace 2 años.' } },
      { type: 'guided', prompt: 'Completa: "I have known her ___ 2020."', expected: 'since' },
      { type: 'application', prompt: 'Escribe 2 cosas sobre ti con present perfect + for/since.', hint: 'Empieza con "I have"' },
      { type: 'self_rate' },
    ],
  },
  {
    id: 'L05_phonemes_th',
    title: 'Pronunciar /θ/ (think) sin sonar a /t/ ni /s/',
    skillIds: ['ph_th'],
    durationMinutes: 8,
    steps: [
      {
        type: 'intro',
        markdown:
          '"Think" no es "tink" ni "sink". Saca la lengua **entre los dientes** (verás un poquito) y sopla aire SIN vibrar la garganta.',
      },
      { type: 'demo', markdown: 'Escucha y repite:', example: { en: 'I think three things are thinkable.', es: 'Creo que tres cosas son pensables.', ipa: '/aɪ θɪŋk θriː θɪŋz ɑːr ˈθɪŋkəbəl/' } },
      { type: 'application', prompt: 'Ve al módulo Pronunciación → fonemas → consonantes th/r/v y entrena 5 fonemas /θ/', hint: 'Lengua entre dientes, sin vibración' },
      { type: 'self_rate' },
    ],
  },
  {
    id: 'L06_writing_journal',
    title: 'Journal de 3 frases · escribir con feedback',
    skillIds: ['wr_journal'],
    durationMinutes: 10,
    steps: [
      {
        type: 'intro',
        markdown:
          'Escribir libremente 3 frases sobre tu día genera **errores reales** que entran en tu FSRS · diferenciador #6 (Write→AI→Diff→Retry).',
      },
      {
        type: 'writing',
        prompt: 'Escribe 3 frases sobre tu día de hoy. Estructura sugerida: "Today I... · I felt... · I learned..."',
        sampleAnswer: 'Today I worked from home. I felt productive but a bit tired. I learned how to fix a bug in my code.',
      },
      { type: 'self_rate' },
    ],
  },
]

export type IconContent = {
  id: string
  title: string
  artist?: string
  type: 'song' | 'movie_scene' | 'ted_talk' | 'podcast'
  cefrTarget: 'A2' | 'B1' | 'B2'
  whyIconic: string
}

export const ICON_CONTENTS: IconContent[] = [
  { id: 'imagine', title: 'Imagine', artist: 'John Lennon', type: 'song', cefrTarget: 'A2', whyIconic: 'Vocabulario universal · ritmo lento · letra clara' },
  { id: 'let_it_be', title: 'Let it Be', artist: 'The Beatles', type: 'song', cefrTarget: 'A2', whyIconic: 'Una de las frases más útiles en inglés conversacional' },
  { id: 'hello', title: 'Hello', artist: 'Adele', type: 'song', cefrTarget: 'B1', whyIconic: 'Pronunciación impecable · vocab emocional B1' },
  { id: 'forrest_gump_chocolate', title: '"Life is like a box of chocolates"', type: 'movie_scene', cefrTarget: 'A2', whyIconic: 'Frase icónica · estructura comparativa simple' },
  { id: 'godfather_offer', title: '"I\'ll make him an offer he can\'t refuse"', type: 'movie_scene', cefrTarget: 'B1', whyIconic: 'Future will + relative clause cant + verbo' },
  { id: 'ted_5min_intro', title: 'How to start a TED talk', type: 'ted_talk', cefrTarget: 'B1', whyIconic: 'Discurso público · pausa + énfasis' },
  { id: 'pinker_language', title: 'Steven Pinker · Language', type: 'ted_talk', cefrTarget: 'B2', whyIconic: 'Vocabulario académico moderado' },
  { id: 'serial_podcast', title: 'Serial Podcast S01 intro', type: 'podcast', cefrTarget: 'B1', whyIconic: 'Storytelling lento · pronunciación clara' },
  { id: 'bbc_6min', title: 'BBC 6 Minute English', type: 'podcast', cefrTarget: 'A2', whyIconic: 'Diseñado para learners A2-B1' },
  { id: 'queen_bohemian', title: 'Bohemian Rhapsody', artist: 'Queen', type: 'song', cefrTarget: 'B1', whyIconic: 'Vocab épico · variaciones de registro' },
  { id: 'shawshank_hope', title: 'Shawshank · "Hope is a good thing"', type: 'movie_scene', cefrTarget: 'B1', whyIconic: 'Frase universal · estructura gerundio' },
  { id: 'naval_podcast', title: 'Naval Ravikant · happiness', type: 'podcast', cefrTarget: 'B2', whyIconic: 'Lenguaje conceptual abstracto · útil para tech CEO' },
]

export const CATEGORY_LABEL: Record<SkillCategory, string> = {
  phonetics: 'Fonética',
  vocabulary: 'Vocabulario',
  grammar: 'Gramática',
  listening: 'Listening',
  speaking: 'Speaking',
  reading: 'Reading',
  writing: 'Writing',
  es_en_pivot: 'ES↔EN Pivot',
}
