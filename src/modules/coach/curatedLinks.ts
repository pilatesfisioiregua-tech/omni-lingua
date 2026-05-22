export type CuratedLink = {
  id: string
  title: string
  url: string
  source: string
  cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  topic: 'grammar' | 'vocabulary' | 'listening' | 'pronunciation' | 'speaking' | 'reading' | 'writing' | 'culture'
  description: string
}

// Subset representativo de 30 links curados (target 200 en producción)
export const CURATED_LINKS: CuratedLink[] = [
  // BBC Learning English
  { id: 'bbc_6min', title: '6 Minute English', url: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english', source: 'BBC LE', cefr: 'A2', topic: 'listening', description: 'Podcast semanal · vocab + cultura UK' },
  { id: 'bbc_lingohack', title: 'Lingohack', url: 'https://www.bbc.co.uk/learningenglish/english/features/lingohack', source: 'BBC LE', cefr: 'B1', topic: 'listening', description: 'Noticias semanales · scripted news English' },
  { id: 'bbc_grammar', title: 'Quick Grammar Tutorials', url: 'https://www.bbc.co.uk/learningenglish/english/course/upper-intermediate/grammar', source: 'BBC LE', cefr: 'B1', topic: 'grammar', description: 'Video tutoriales 3-5 min por punto gramatical' },

  // British Council
  { id: 'bc_listening_a1', title: 'Listening A1', url: 'https://learnenglish.britishcouncil.org/skills/listening/a1-listening', source: 'British Council', cefr: 'A1', topic: 'listening', description: 'Audios cortos con preguntas + transcript' },
  { id: 'bc_grammar_ref', title: 'English Grammar Reference', url: 'https://learnenglish.britishcouncil.org/grammar/english-grammar-reference', source: 'British Council', cefr: 'A2', topic: 'grammar', description: 'Reference completa + ejercicios por nivel' },

  // EnglishClass101
  { id: 'ec_pronunciation', title: 'English Pronunciation Series', url: 'https://www.englishclass101.com/lessons/pronunciation', source: 'EnglishClass101', cefr: 'A1', topic: 'pronunciation', description: 'Video corto por fonema + drill' },

  // MOSAlingua
  { id: 'mosa_phrases', title: 'Essential English Phrases', url: 'https://www.mosalingua.com/en/english-phrases/', source: 'MOSAlingua', cefr: 'A1', topic: 'vocabulary', description: 'Frases más útiles por situación' },

  // Cambridge English
  { id: 'cambridge_word_lists', title: 'Word Lists A1-A2', url: 'https://www.cambridgeenglish.org/learning-english/exam-preparation/word-lists/', source: 'Cambridge', cefr: 'A1', topic: 'vocabulary', description: 'Listas oficiales CEFR vocab' },

  // Murphy + grammar
  { id: 'murphy_grammar', title: 'English Grammar In Use · Murphy', url: 'https://www.cambridge.org/elt/catalogue/subject/project/item404366/', source: 'Cambridge', cefr: 'B1', topic: 'grammar', description: 'El libro de gramática inglesa más usado del mundo' },

  // Reddit
  { id: 'reddit_englishlearning', title: 'r/EnglishLearning', url: 'https://www.reddit.com/r/EnglishLearning/', source: 'Reddit', cefr: 'B1', topic: 'speaking', description: 'Comunidad activa · preguntas + native answers' },

  // YouTube
  { id: 'rachelsenglish', title: "Rachel's English (American)", url: 'https://www.youtube.com/c/rachelsenglish', source: 'YouTube', cefr: 'A2', topic: 'pronunciation', description: 'Acento americano · phoneme-by-phoneme' },
  { id: 'lucy_english', title: 'English with Lucy (British)', url: 'https://www.youtube.com/c/EnglishwithLucy', source: 'YouTube', cefr: 'A2', topic: 'pronunciation', description: 'Acento británico RP · expresiones naturales' },
  { id: 'eng_addict', title: 'English Addict with Mr Steve', url: 'https://www.youtube.com/c/MisterDuncanInChina', source: 'YouTube', cefr: 'B1', topic: 'speaking', description: 'Lives diarios · cultura + idioms' },

  // Podcasts native
  { id: 'esl_pod', title: 'ESL Podcast', url: 'https://eslpod.com/', source: 'ESL Podcast', cefr: 'A2', topic: 'listening', description: 'Diálogo + explicación cultural · clásico learners' },
  { id: 'all_ears', title: 'All Ears English', url: 'https://www.allearsenglish.com/', source: 'Independent', cefr: 'B1', topic: 'speaking', description: 'Connection-not-perfection · slang + small talk' },
  { id: 'rosetta_eng', title: 'Rosetta Stone English Course', url: 'https://www.rosettastone.com/learn-english/', source: 'Rosetta Stone', cefr: 'A1', topic: 'vocabulary', description: 'Inmersión visual · no traducción ES' },

  // Reading
  { id: 'breaking_news', title: 'Breaking News English', url: 'https://breakingnewsenglish.com/', source: 'BNE', cefr: 'A2', topic: 'reading', description: '7 niveles del mismo artículo · choose tu nivel' },
  { id: 'news_in_levels', title: 'News In Levels', url: 'https://www.newsinlevels.com/', source: 'NIL', cefr: 'A1', topic: 'reading', description: 'Noticias 3 niveles · simple → original' },

  // Pronunciation tools
  { id: 'forvo', title: 'Forvo · native pronunciation', url: 'https://forvo.com/', source: 'Forvo', cefr: 'A1', topic: 'pronunciation', description: 'Cualquier palabra pronunciada por nativos' },
  { id: 'youglish', title: 'YouGlish', url: 'https://youglish.com/', source: 'YouGlish', cefr: 'A2', topic: 'pronunciation', description: 'Busca palabra → 50 videos YouTube con esa palabra dicha' },

  // Writing
  { id: 'grammarly', title: 'Grammarly Free', url: 'https://www.grammarly.com/', source: 'Grammarly', cefr: 'A2', topic: 'writing', description: 'Corrige spelling + grammar en tiempo real' },
  { id: 'languagetool', title: 'LanguageTool', url: 'https://languagetool.org/', source: 'LanguageTool', cefr: 'A2', topic: 'writing', description: 'Alternativa open source a Grammarly' },

  // Culture
  { id: 'engvid', title: 'engVid', url: 'https://www.engvid.com/', source: 'engVid', cefr: 'B1', topic: 'culture', description: 'Videos profesores nativos · idioms + slang moderno' },
  { id: 'kaplan_blog', title: 'Kaplan International Blog', url: 'https://blog.kaplaninternational.com/category/english/', source: 'Kaplan', cefr: 'B1', topic: 'culture', description: 'Cultura UK/US + life-in-english abroad' },

  // Speaking practice
  { id: 'cambly', title: 'Cambly · tutors', url: 'https://www.cambly.com/', source: 'Cambly', cefr: 'A2', topic: 'speaking', description: 'Tutor nativo on-demand · €€ pero efectivo' },
  { id: 'italki', title: 'iTalki · tutors', url: 'https://www.italki.com/', source: 'iTalki', cefr: 'A2', topic: 'speaking', description: 'Marketplace tutores · €€ pero flexible' },
  { id: 'tandem', title: 'Tandem · language exchange', url: 'https://www.tandem.net/', source: 'Tandem', cefr: 'A2', topic: 'speaking', description: 'Intercambio idiomas gratis · habla con nativos' },

  // IELTS / Cambridge exams
  { id: 'ielts_simon', title: 'IELTS Simon', url: 'https://ielts-simon.com/', source: 'Simon', cefr: 'B2', topic: 'writing', description: 'Ex-examiner IELTS · writing samples + tips' },
  { id: 'cambridge_exams', title: 'Cambridge English Exam Prep', url: 'https://www.cambridgeenglish.org/learning-english/exam-preparation/', source: 'Cambridge', cefr: 'B1', topic: 'reading', description: 'Past papers oficiales' },

  // TED
  { id: 'ted_subtitles', title: 'TED with EN subtitles', url: 'https://www.ted.com/', source: 'TED', cefr: 'B1', topic: 'listening', description: 'Subs interactivos · click word → diccionario' },
]
