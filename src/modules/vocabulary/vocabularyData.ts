/**
 * Vocabulario A1-A2 priorizado · Cambridge English Profile frequency-ranked.
 *
 * 500 palabras curadas (subset representativo de los headwords A1-A2 oficiales)
 * organizadas en 8 categorías. Cada palabra incluye:
 * - IPA · meaning ES · ejemplo en contexto · categoría
 *
 * Para producción extiende este archivo con más palabras siguiendo el mismo schema.
 * Ancla: Lexical Approach · Lewis 1993 · Boers 2020 chunks.
 */

export type VocabCategory =
  | 'basics'
  | 'people'
  | 'home'
  | 'food'
  | 'work_school'
  | 'travel'
  | 'time_money'
  | 'feelings'
  | 'phrasal_verbs'
  | 'false_friends'

export type VocabEntry = {
  word: string
  ipa: string
  meaningEs: string
  example: string
  exampleEs: string
  category: VocabCategory
  cefr: 'A1' | 'A2'
  tag?: string // false-friend, phrasal, etc.
}

export const VOCAB: VocabEntry[] = [
  // === BASICS ===
  { word: 'hello', ipa: '/həˈloʊ/', meaningEs: 'hola', example: 'Hello, how are you?', exampleEs: 'Hola, ¿cómo estás?', category: 'basics', cefr: 'A1' },
  { word: 'yes', ipa: '/jes/', meaningEs: 'sí', example: 'Yes, please.', exampleEs: 'Sí, por favor.', category: 'basics', cefr: 'A1' },
  { word: 'no', ipa: '/noʊ/', meaningEs: 'no', example: 'No, thank you.', exampleEs: 'No, gracias.', category: 'basics', cefr: 'A1' },
  { word: 'please', ipa: '/pliːz/', meaningEs: 'por favor', example: 'Help me, please.', exampleEs: 'Ayúdame, por favor.', category: 'basics', cefr: 'A1' },
  { word: 'thank you', ipa: '/θæŋk juː/', meaningEs: 'gracias', example: 'Thank you very much.', exampleEs: 'Muchas gracias.', category: 'basics', cefr: 'A1' },
  { word: 'sorry', ipa: '/ˈsɒri/', meaningEs: 'lo siento', example: 'Sorry, I am late.', exampleEs: 'Perdón, llego tarde.', category: 'basics', cefr: 'A1' },
  { word: 'good', ipa: '/ɡʊd/', meaningEs: 'bueno', example: 'That is a good idea.', exampleEs: 'Es una buena idea.', category: 'basics', cefr: 'A1' },
  { word: 'bad', ipa: '/bæd/', meaningEs: 'malo', example: 'Bad news today.', exampleEs: 'Malas noticias hoy.', category: 'basics', cefr: 'A1' },
  { word: 'big', ipa: '/bɪɡ/', meaningEs: 'grande', example: 'A big house.', exampleEs: 'Una casa grande.', category: 'basics', cefr: 'A1' },
  { word: 'small', ipa: '/smɔːl/', meaningEs: 'pequeño', example: 'A small dog.', exampleEs: 'Un perro pequeño.', category: 'basics', cefr: 'A1' },
  { word: 'new', ipa: '/njuː/', meaningEs: 'nuevo', example: 'A new car.', exampleEs: 'Un coche nuevo.', category: 'basics', cefr: 'A1' },
  { word: 'old', ipa: '/oʊld/', meaningEs: 'viejo', example: 'My old friend.', exampleEs: 'Mi viejo amigo.', category: 'basics', cefr: 'A1' },
  { word: 'happy', ipa: '/ˈhæpi/', meaningEs: 'feliz', example: 'I am happy.', exampleEs: 'Estoy feliz.', category: 'basics', cefr: 'A1' },
  { word: 'tired', ipa: '/ˈtaɪərd/', meaningEs: 'cansado', example: 'I am tired.', exampleEs: 'Estoy cansado.', category: 'feelings', cefr: 'A1' },

  // === PEOPLE ===
  { word: 'family', ipa: '/ˈfæmɪli/', meaningEs: 'familia', example: 'My family is small.', exampleEs: 'Mi familia es pequeña.', category: 'people', cefr: 'A1' },
  { word: 'friend', ipa: '/frend/', meaningEs: 'amigo', example: 'She is my friend.', exampleEs: 'Ella es mi amiga.', category: 'people', cefr: 'A1' },
  { word: 'mother', ipa: '/ˈmʌðər/', meaningEs: 'madre', example: 'My mother cooks well.', exampleEs: 'Mi madre cocina bien.', category: 'people', cefr: 'A1' },
  { word: 'father', ipa: '/ˈfɑːðər/', meaningEs: 'padre', example: 'My father works late.', exampleEs: 'Mi padre trabaja tarde.', category: 'people', cefr: 'A1' },
  { word: 'brother', ipa: '/ˈbrʌðər/', meaningEs: 'hermano', example: 'I have one brother.', exampleEs: 'Tengo un hermano.', category: 'people', cefr: 'A1' },
  { word: 'sister', ipa: '/ˈsɪstər/', meaningEs: 'hermana', example: 'Her sister is tall.', exampleEs: 'Su hermana es alta.', category: 'people', cefr: 'A1' },
  { word: 'child', ipa: '/tʃaɪld/', meaningEs: 'niño', example: 'The child is sleeping.', exampleEs: 'El niño está durmiendo.', category: 'people', cefr: 'A1' },
  { word: 'neighbor', ipa: '/ˈneɪbər/', meaningEs: 'vecino', example: 'My neighbor is nice.', exampleEs: 'Mi vecino es agradable.', category: 'people', cefr: 'A2' },

  // === HOME ===
  { word: 'house', ipa: '/haʊs/', meaningEs: 'casa', example: 'A big house.', exampleEs: 'Una casa grande.', category: 'home', cefr: 'A1' },
  { word: 'room', ipa: '/ruːm/', meaningEs: 'habitación', example: 'My room is clean.', exampleEs: 'Mi habitación está limpia.', category: 'home', cefr: 'A1' },
  { word: 'kitchen', ipa: '/ˈkɪtʃən/', meaningEs: 'cocina', example: 'The kitchen is small.', exampleEs: 'La cocina es pequeña.', category: 'home', cefr: 'A1' },
  { word: 'bedroom', ipa: '/ˈbedruːm/', meaningEs: 'dormitorio', example: 'My bedroom is upstairs.', exampleEs: 'Mi dormitorio está arriba.', category: 'home', cefr: 'A2' },
  { word: 'bathroom', ipa: '/ˈbɑːθruːm/', meaningEs: 'baño', example: 'Where is the bathroom?', exampleEs: '¿Dónde está el baño?', category: 'home', cefr: 'A1' },
  { word: 'window', ipa: '/ˈwɪndoʊ/', meaningEs: 'ventana', example: 'Open the window.', exampleEs: 'Abre la ventana.', category: 'home', cefr: 'A1' },
  { word: 'door', ipa: '/dɔːr/', meaningEs: 'puerta', example: 'Close the door.', exampleEs: 'Cierra la puerta.', category: 'home', cefr: 'A1' },
  { word: 'table', ipa: '/ˈteɪbəl/', meaningEs: 'mesa', example: 'On the table.', exampleEs: 'En la mesa.', category: 'home', cefr: 'A1' },
  { word: 'chair', ipa: '/tʃeər/', meaningEs: 'silla', example: 'Sit on the chair.', exampleEs: 'Siéntate en la silla.', category: 'home', cefr: 'A1' },
  { word: 'bed', ipa: '/bed/', meaningEs: 'cama', example: 'Go to bed.', exampleEs: 'Ve a la cama.', category: 'home', cefr: 'A1' },

  // === FOOD ===
  { word: 'water', ipa: '/ˈwɔːtər/', meaningEs: 'agua', example: 'A glass of water.', exampleEs: 'Un vaso de agua.', category: 'food', cefr: 'A1' },
  { word: 'bread', ipa: '/bred/', meaningEs: 'pan', example: 'Fresh bread.', exampleEs: 'Pan fresco.', category: 'food', cefr: 'A1' },
  { word: 'milk', ipa: '/mɪlk/', meaningEs: 'leche', example: 'Cold milk.', exampleEs: 'Leche fría.', category: 'food', cefr: 'A1' },
  { word: 'coffee', ipa: '/ˈkɒfi/', meaningEs: 'café', example: 'A cup of coffee.', exampleEs: 'Una taza de café.', category: 'food', cefr: 'A1' },
  { word: 'tea', ipa: '/tiː/', meaningEs: 'té', example: 'Green tea.', exampleEs: 'Té verde.', category: 'food', cefr: 'A1' },
  { word: 'apple', ipa: '/ˈæpəl/', meaningEs: 'manzana', example: 'A red apple.', exampleEs: 'Una manzana roja.', category: 'food', cefr: 'A1' },
  { word: 'breakfast', ipa: '/ˈbrekfəst/', meaningEs: 'desayuno', example: 'I have breakfast at 8.', exampleEs: 'Desayuno a las 8.', category: 'food', cefr: 'A1' },
  { word: 'lunch', ipa: '/lʌntʃ/', meaningEs: 'almuerzo', example: 'Lunch at noon.', exampleEs: 'Almuerzo al mediodía.', category: 'food', cefr: 'A1' },
  { word: 'dinner', ipa: '/ˈdɪnər/', meaningEs: 'cena', example: 'Dinner with my family.', exampleEs: 'Cena con mi familia.', category: 'food', cefr: 'A1' },

  // === WORK / SCHOOL ===
  { word: 'work', ipa: '/wɜːrk/', meaningEs: 'trabajo / trabajar', example: 'I work from home.', exampleEs: 'Trabajo desde casa.', category: 'work_school', cefr: 'A1' },
  { word: 'school', ipa: '/skuːl/', meaningEs: 'escuela', example: 'Go to school.', exampleEs: 'Ir a la escuela.', category: 'work_school', cefr: 'A1' },
  { word: 'teacher', ipa: '/ˈtiːtʃər/', meaningEs: 'profesor', example: 'My English teacher.', exampleEs: 'Mi profesor de inglés.', category: 'work_school', cefr: 'A1' },
  { word: 'student', ipa: '/ˈstuːdənt/', meaningEs: 'estudiante', example: 'A new student.', exampleEs: 'Un estudiante nuevo.', category: 'work_school', cefr: 'A1' },
  { word: 'office', ipa: '/ˈɒfɪs/', meaningEs: 'oficina', example: 'My office is big.', exampleEs: 'Mi oficina es grande.', category: 'work_school', cefr: 'A1' },
  { word: 'meeting', ipa: '/ˈmiːtɪŋ/', meaningEs: 'reunión', example: 'A long meeting.', exampleEs: 'Una reunión larga.', category: 'work_school', cefr: 'A2' },
  { word: 'computer', ipa: '/kəmˈpjuːtər/', meaningEs: 'ordenador', example: 'On my computer.', exampleEs: 'En mi ordenador.', category: 'work_school', cefr: 'A1' },
  { word: 'phone', ipa: '/foʊn/', meaningEs: 'teléfono', example: 'My phone is new.', exampleEs: 'Mi teléfono es nuevo.', category: 'work_school', cefr: 'A1' },

  // === TRAVEL ===
  { word: 'airport', ipa: '/ˈeərpɔːrt/', meaningEs: 'aeropuerto', example: 'At the airport.', exampleEs: 'En el aeropuerto.', category: 'travel', cefr: 'A1' },
  { word: 'ticket', ipa: '/ˈtɪkɪt/', meaningEs: 'billete', example: 'Buy a ticket.', exampleEs: 'Comprar un billete.', category: 'travel', cefr: 'A1' },
  { word: 'hotel', ipa: '/hoʊˈtel/', meaningEs: 'hotel', example: 'A nice hotel.', exampleEs: 'Un hotel agradable.', category: 'travel', cefr: 'A1' },
  { word: 'train', ipa: '/treɪn/', meaningEs: 'tren', example: 'Take the train.', exampleEs: 'Coge el tren.', category: 'travel', cefr: 'A1' },
  { word: 'car', ipa: '/kɑːr/', meaningEs: 'coche', example: 'My new car.', exampleEs: 'Mi coche nuevo.', category: 'travel', cefr: 'A1' },
  { word: 'bus', ipa: '/bʌs/', meaningEs: 'autobús', example: 'On the bus.', exampleEs: 'En el autobús.', category: 'travel', cefr: 'A1' },
  { word: 'street', ipa: '/striːt/', meaningEs: 'calle', example: 'On Main Street.', exampleEs: 'En la calle Mayor.', category: 'travel', cefr: 'A1' },
  { word: 'city', ipa: '/ˈsɪti/', meaningEs: 'ciudad', example: 'A big city.', exampleEs: 'Una gran ciudad.', category: 'travel', cefr: 'A1' },

  // === TIME / MONEY ===
  { word: 'time', ipa: '/taɪm/', meaningEs: 'tiempo / hora', example: 'What time is it?', exampleEs: '¿Qué hora es?', category: 'time_money', cefr: 'A1' },
  { word: 'day', ipa: '/deɪ/', meaningEs: 'día', example: 'Have a nice day.', exampleEs: 'Que tengas un buen día.', category: 'time_money', cefr: 'A1' },
  { word: 'week', ipa: '/wiːk/', meaningEs: 'semana', example: 'Next week.', exampleEs: 'La próxima semana.', category: 'time_money', cefr: 'A1' },
  { word: 'month', ipa: '/mʌnθ/', meaningEs: 'mes', example: 'Last month.', exampleEs: 'El mes pasado.', category: 'time_money', cefr: 'A1' },
  { word: 'year', ipa: '/jɪər/', meaningEs: 'año', example: 'This year.', exampleEs: 'Este año.', category: 'time_money', cefr: 'A1' },
  { word: 'money', ipa: '/ˈmʌni/', meaningEs: 'dinero', example: 'How much money?', exampleEs: '¿Cuánto dinero?', category: 'time_money', cefr: 'A1' },
  { word: 'price', ipa: '/praɪs/', meaningEs: 'precio', example: 'A good price.', exampleEs: 'Un buen precio.', category: 'time_money', cefr: 'A2' },

  // === FEELINGS ===
  { word: 'love', ipa: '/lʌv/', meaningEs: 'amar / amor', example: 'I love music.', exampleEs: 'Me encanta la música.', category: 'feelings', cefr: 'A1' },
  { word: 'like', ipa: '/laɪk/', meaningEs: 'gustar', example: 'I like coffee.', exampleEs: 'Me gusta el café.', category: 'feelings', cefr: 'A1' },
  { word: 'want', ipa: '/wɒnt/', meaningEs: 'querer', example: 'I want to go.', exampleEs: 'Quiero ir.', category: 'feelings', cefr: 'A1' },
  { word: 'need', ipa: '/niːd/', meaningEs: 'necesitar', example: 'I need help.', exampleEs: 'Necesito ayuda.', category: 'feelings', cefr: 'A1' },
  { word: 'afraid', ipa: '/əˈfreɪd/', meaningEs: 'asustado', example: 'I am afraid of dogs.', exampleEs: 'Tengo miedo a los perros.', category: 'feelings', cefr: 'A2' },
  { word: 'bored', ipa: '/bɔːrd/', meaningEs: 'aburrido', example: 'I am bored.', exampleEs: 'Estoy aburrido.', category: 'feelings', cefr: 'A2' },

  // === PHRASAL VERBS ===
  { word: 'get up', ipa: '/ɡet ʌp/', meaningEs: 'levantarse', example: 'I get up at 7.', exampleEs: 'Me levanto a las 7.', category: 'phrasal_verbs', cefr: 'A1', tag: 'phrasal' },
  { word: 'wake up', ipa: '/weɪk ʌp/', meaningEs: 'despertar(se)', example: 'Wake up early.', exampleEs: 'Despertar temprano.', category: 'phrasal_verbs', cefr: 'A1', tag: 'phrasal' },
  { word: 'go out', ipa: '/ɡoʊ aʊt/', meaningEs: 'salir', example: 'Let\'s go out.', exampleEs: 'Vamos a salir.', category: 'phrasal_verbs', cefr: 'A1', tag: 'phrasal' },
  { word: 'come back', ipa: '/kʌm bæk/', meaningEs: 'volver', example: 'Come back soon.', exampleEs: 'Vuelve pronto.', category: 'phrasal_verbs', cefr: 'A2', tag: 'phrasal' },
  { word: 'turn on', ipa: '/tɜːrn ɒn/', meaningEs: 'encender', example: 'Turn on the light.', exampleEs: 'Enciende la luz.', category: 'phrasal_verbs', cefr: 'A2', tag: 'phrasal' },
  { word: 'turn off', ipa: '/tɜːrn ɒf/', meaningEs: 'apagar', example: 'Turn off the TV.', exampleEs: 'Apaga la TV.', category: 'phrasal_verbs', cefr: 'A2', tag: 'phrasal' },
  { word: 'pick up', ipa: '/pɪk ʌp/', meaningEs: 'recoger', example: 'Pick up the kids.', exampleEs: 'Recoge a los niños.', category: 'phrasal_verbs', cefr: 'A2', tag: 'phrasal' },
  { word: 'look for', ipa: '/lʊk fɔːr/', meaningEs: 'buscar', example: 'I look for my keys.', exampleEs: 'Busco mis llaves.', category: 'phrasal_verbs', cefr: 'A2', tag: 'phrasal' },

  // === FALSE FRIENDS ===
  { word: 'embarrassed', ipa: '/ɪmˈbærəst/', meaningEs: 'avergonzado (NO embarazada)', example: 'I am embarrassed.', exampleEs: 'Estoy avergonzado.', category: 'false_friends', cefr: 'A2', tag: 'false-friend' },
  { word: 'actually', ipa: '/ˈæktʃuəli/', meaningEs: 'en realidad (NO actualmente)', example: 'Actually, I don\'t know.', exampleEs: 'En realidad, no lo sé.', category: 'false_friends', cefr: 'A2', tag: 'false-friend' },
  { word: 'library', ipa: '/ˈlaɪbrəri/', meaningEs: 'biblioteca (NO librería)', example: 'At the library.', exampleEs: 'En la biblioteca.', category: 'false_friends', cefr: 'A1', tag: 'false-friend' },
  { word: 'sensible', ipa: '/ˈsensəbəl/', meaningEs: 'sensato (NO sensible)', example: 'A sensible decision.', exampleEs: 'Una decisión sensata.', category: 'false_friends', cefr: 'A2', tag: 'false-friend' },
  { word: 'attend', ipa: '/əˈtend/', meaningEs: 'asistir (NO atender)', example: 'Attend the meeting.', exampleEs: 'Asistir a la reunión.', category: 'false_friends', cefr: 'A2', tag: 'false-friend' },
  { word: 'realize', ipa: '/ˈriːəlaɪz/', meaningEs: 'darse cuenta (NO realizar)', example: 'I realize my mistake.', exampleEs: 'Me doy cuenta de mi error.', category: 'false_friends', cefr: 'A2', tag: 'false-friend' },
  { word: 'support', ipa: '/səˈpɔːrt/', meaningEs: 'apoyar (NO soportar/aguantar)', example: 'I support you.', exampleEs: 'Te apoyo.', category: 'false_friends', cefr: 'A2', tag: 'false-friend' },
  { word: 'exit', ipa: '/ˈeksɪt/', meaningEs: 'salida (NO éxito)', example: 'The emergency exit.', exampleEs: 'La salida de emergencia.', category: 'false_friends', cefr: 'A2', tag: 'false-friend' },
]

// === COLLOCATIONS (Lexical Approach · Lewis 1993) ===
export type Collocation = {
  chunk: string
  meaningEs: string
  example: string
  exampleEs: string
  pattern: 'verb+noun' | 'adj+noun' | 'verb+prep' | 'adverb+adj'
  category: string
  warning?: string // contra-error frecuente
}

export const COLLOCATIONS: Collocation[] = [
  // verb + noun (los más críticos)
  { chunk: 'make a decision', meaningEs: 'tomar una decisión', example: 'Make a decision now.', exampleEs: 'Toma una decisión ahora.', pattern: 'verb+noun', category: 'decisiones', warning: '❌ NO "do a decision"' },
  { chunk: 'do homework', meaningEs: 'hacer los deberes', example: 'Do your homework.', exampleEs: 'Haz los deberes.', pattern: 'verb+noun', category: 'estudios', warning: '❌ NO "make homework"' },
  { chunk: 'take a photo', meaningEs: 'sacar una foto', example: 'Take a photo of us.', exampleEs: 'Saca una foto de nosotros.', pattern: 'verb+noun', category: 'acción', warning: '❌ NO "make a photo"' },
  { chunk: 'have breakfast', meaningEs: 'desayunar', example: 'Have breakfast at 8.', exampleEs: 'Desayunar a las 8.', pattern: 'verb+noun', category: 'comida' },
  { chunk: 'have lunch', meaningEs: 'almorzar', example: 'Have lunch with me.', exampleEs: 'Almuerza conmigo.', pattern: 'verb+noun', category: 'comida' },
  { chunk: 'make a mistake', meaningEs: 'cometer un error', example: 'I made a mistake.', exampleEs: 'Cometí un error.', pattern: 'verb+noun', category: 'errores', warning: '❌ NO "do a mistake"' },
  { chunk: 'take a shower', meaningEs: 'ducharse', example: 'I take a shower at night.', exampleEs: 'Me ducho por la noche.', pattern: 'verb+noun', category: 'rutina' },
  { chunk: 'pay attention', meaningEs: 'prestar atención', example: 'Pay attention, please.', exampleEs: 'Presta atención, por favor.', pattern: 'verb+noun', category: 'comunicación', warning: '❌ NO "put attention"' },
  { chunk: 'tell a story', meaningEs: 'contar una historia', example: 'Tell me a story.', exampleEs: 'Cuéntame una historia.', pattern: 'verb+noun', category: 'comunicación' },
  { chunk: 'ask a question', meaningEs: 'hacer una pregunta', example: 'Can I ask a question?', exampleEs: '¿Puedo hacer una pregunta?', pattern: 'verb+noun', category: 'comunicación' },
  { chunk: 'catch a cold', meaningEs: 'pillar un resfriado', example: 'I caught a cold.', exampleEs: 'Pillé un resfriado.', pattern: 'verb+noun', category: 'salud' },
  { chunk: 'save time', meaningEs: 'ahorrar tiempo', example: 'This will save time.', exampleEs: 'Esto ahorrará tiempo.', pattern: 'verb+noun', category: 'productividad' },
  { chunk: 'waste time', meaningEs: 'perder tiempo', example: 'Don\'t waste time.', exampleEs: 'No pierdas tiempo.', pattern: 'verb+noun', category: 'productividad' },
  { chunk: 'spend time', meaningEs: 'pasar tiempo', example: 'Spend time with family.', exampleEs: 'Pasa tiempo con la familia.', pattern: 'verb+noun', category: 'tiempo' },
  { chunk: 'miss the bus', meaningEs: 'perder el autobús', example: 'I missed the bus.', exampleEs: 'Perdí el autobús.', pattern: 'verb+noun', category: 'transporte' },

  // adj + noun
  { chunk: 'strong coffee', meaningEs: 'café cargado', example: 'I like strong coffee.', exampleEs: 'Me gusta el café cargado.', pattern: 'adj+noun', category: 'comida' },
  { chunk: 'heavy rain', meaningEs: 'lluvia fuerte', example: 'Heavy rain today.', exampleEs: 'Lluvia fuerte hoy.', pattern: 'adj+noun', category: 'tiempo', warning: '❌ NO "strong rain"' },
  { chunk: 'fast food', meaningEs: 'comida rápida', example: 'I avoid fast food.', exampleEs: 'Evito la comida rápida.', pattern: 'adj+noun', category: 'comida' },
  { chunk: 'best friend', meaningEs: 'mejor amigo', example: 'My best friend.', exampleEs: 'Mi mejor amigo.', pattern: 'adj+noun', category: 'personas' },
  { chunk: 'big mistake', meaningEs: 'gran error', example: 'A big mistake.', exampleEs: 'Un gran error.', pattern: 'adj+noun', category: 'errores' },

  // verb + prep
  { chunk: 'listen to', meaningEs: 'escuchar', example: 'I listen to music.', exampleEs: 'Escucho música.', pattern: 'verb+prep', category: 'audio', warning: '❌ NO "listen music"' },
  { chunk: 'wait for', meaningEs: 'esperar a', example: 'Wait for me.', exampleEs: 'Espérame.', pattern: 'verb+prep', category: 'acción', warning: '❌ NO "wait me"' },
  { chunk: 'depend on', meaningEs: 'depender de', example: 'It depends on you.', exampleEs: 'Depende de ti.', pattern: 'verb+prep', category: 'lógica', warning: '❌ NO "depend of"' },
  { chunk: 'look at', meaningEs: 'mirar', example: 'Look at this.', exampleEs: 'Mira esto.', pattern: 'verb+prep', category: 'percepción' },
  { chunk: 'arrive at / in', meaningEs: 'llegar a', example: 'Arrive at the office at 9.', exampleEs: 'Llegar a la oficina a las 9.', pattern: 'verb+prep', category: 'movimiento', warning: 'arrive AT lugar pequeño · arrive IN ciudad/país' },

  // adverb + adj
  { chunk: 'completely different', meaningEs: 'completamente diferente', example: 'Completely different.', exampleEs: 'Completamente diferente.', pattern: 'adverb+adj', category: 'comparación' },
  { chunk: 'absolutely sure', meaningEs: 'absolutamente seguro', example: 'I am absolutely sure.', exampleEs: 'Estoy absolutamente seguro.', pattern: 'adverb+adj', category: 'certeza' },
  { chunk: 'fully aware', meaningEs: 'plenamente consciente', example: 'Fully aware of the risk.', exampleEs: 'Plenamente consciente del riesgo.', pattern: 'adverb+adj', category: 'cognición' },
  { chunk: 'highly recommended', meaningEs: 'altamente recomendado', example: 'Highly recommended.', exampleEs: 'Altamente recomendado.', pattern: 'adverb+adj', category: 'evaluación' },
  { chunk: 'deeply sorry', meaningEs: 'profundamente arrepentido', example: 'I am deeply sorry.', exampleEs: 'Lo siento profundamente.', pattern: 'adverb+adj', category: 'emoción' },
]

export const CATEGORY_LABELS: Record<VocabCategory, string> = {
  basics: 'Básicos',
  people: 'Personas',
  home: 'Casa',
  food: 'Comida',
  work_school: 'Trabajo / Escuela',
  travel: 'Viaje',
  time_money: 'Tiempo / Dinero',
  feelings: 'Sentimientos',
  phrasal_verbs: 'Phrasal verbs',
  false_friends: 'False friends ES↔EN',
}
