# Omni-Lingua · 10 diferenciadores únicos

Esto es lo que separa Omni-Lingua de Duolingo / Babbel / Pimsleur / Lingoda.
Cada diferenciador tiene **ancla científica trazable** + **resultado material verificable** + **KPI** + **fase de implementación**.

> CEO aprobó los 10 (Tier 1+2+3) el 2026-05-21. Plan completo:
> `~/.claude/plans/users-jesusfernandezdominguez-omni-mind-robust-seahorse.md`

---

## Tier 1 · Fundamentales

### 1 · Language Twin (módulo fundacional)

- **Resultado material**: *"tu inglés tiene 47 patrones únicos que el sistema conoce. Hoy mejoramos 3."*
- **Qué es**: vector único de TUS errores recurrentes · vocab activo medido (producido, no expuesto) · accuracy por fonema · interferencias del español. Coach + Conversation + Scheduler consultan este Twin como contexto primario.
- **Ancla científica**: User Modeling for SLA · Mizumoto 2024 · Bilingual Interactive Activation Plus (BIA+) · Dijkstra 2018.
- **KPI**: cobertura Twin ≥ 5 categorías con datos tras 10 sesiones · efectiveCefr alineado ±1 nivel con CEFR test externo.
- **Fase**: F0 stub funcional · F4 implementación profunda.
- **Coste**: €0 (BGE-small ONNX en navegador con `@xenova/transformers`).

### 2 · Generative Comprehensible Input · Daily Story

- **Resultado material**: 1 mini-historia 200 palabras cada día en TU nivel exacto + vocab que estás aprendiendo + ambientada en wishlist contents. Tipo "The New Yorker pero TU inglés".
- **Ancla científica**: Krashen i+1 1985 · Reinders 2023 LLM-personalized input (efectividad ↑40% vs textbook).
- **KPI**: ≥ 20 historias generadas/mes · ≥ 60% lectura completada · ≥ 3 palabras nuevas "agregadas a deck" por historia.
- **Fase**: F4.8 (endpoint `/api/daily-story`).
- **Coste**: ~€0.15/mes (Claude Haiku).

### 3 · Phonetic Distance Map · heatmap del acento

- **Resultado material**: mapa visual IPA con accuracy por fonema. *"/θ/ al 23% · /v/ al 78% · prioridad ROI = schwa /ə/ porque aparece en 40% de tus errores"*. Dejas de trabajar fonemas dominados.
- **Ancla científica**: Goodness of Pronunciation · Witt 2000 · wav2vec2 era Lin 2023 · Forced alignment WhisperX 2024.
- **KPI**: ≥ 30 fonemas medidos tras 50 grabaciones · drill recomendado correlaciona con mejora medida +5pp en 4 semanas.
- **Fase**: F1 captura datos · F4.9 visualización heatmap.
- **Coste**: €0 cliente (wav2vec2 ONNX ~30MB) o Modal opcional.

### 4 · Honest Dashboard · honestidad como feature

- **Resultado material**: dashboard muestra métricas reales, no aspiracionales. *"3 semanas sin progresar en present perfect · vocab activo medido = 287 palabras (no las 1200 que viste) · CEFR efectivo A2 alto, no B1 como creías"*.
- **Ancla científica**: Bjork 1994 desirable difficulties · Dunning-Kruger mitigation · OMNI-MIND P1 anti-yes-man.
- **KPI**: ≥ 1 alerta honest/semana cuando hay estancamiento medible · CEO reporta "información útil para decidir" ≥ 4/5.
- **Fase**: F4 Dashboard.
- **Coste**: €0.

---

## Tier 2 · Producción activa

### 5 · ES↔EN Structural Pivot

- **Resultado material**: 50-80 contrastes estructurales que matan al hispanohablante con drill activo. *"En español 'tengo 30 años' · en inglés 'I am 30 years old' (verbo ser, no tener)"*.
- **Ancla científica**: Cummins 1979 cross-linguistic transfer · contrastive analysis renaissance 2023+.
- **KPI**: ≥ 80% accuracy en 50 contrastes top tras 4 semanas de drill.
- **Fase**: F4 (nuevo skill category dentro del curriculum).
- **Coste**: €0 (curriculum estático curado).

### 6 · Write→AI→Diff→Retry loop

- **Resultado material**: párrafo libre → Claude corrige con diff + explicación → re-escribir. **El error entra en FSRS** · próximo drill llega por tu error real hace 5 días.
- **Ancla científica**: Mizumoto 2023 LLM writing feedback (efficacy ↑60%) · Roediger 2006 testing effect.
- **KPI**: ≥ 10 ciclos write→retry/mes · reducción errores recurrentes -30% tras 4 semanas.
- **Fase**: F4 (nuevo step type "writing") + endpoint `/api/correct-writing`.
- **Coste**: ~€0.20/mes (Claude Sonnet para diff + explicación).

### 7 · Linguistic Mirror (transferencia BPF E5-E7)

- **Resultado material**: durante conversation jam, Claude marca momentos donde lo dicho ≠ lo querido. *"Dijiste 'I have 30 years' — querías 'I am 30 years old'"*.
- **Ancla científica**: BPF Mirror Engine E5-E7 (OMNI-MIND) aplicado al lenguaje · Swain 1985 output hypothesis.
- **KPI**: ≥ 1 mirror detection/conversation · ≥ 70% confirmados como gap real por el usuario.
- **Fase**: F4.6 inline en Conversation + endpoint `/api/mirror-conversation`.
- **Coste**: ~€0.10/mes.

---

## Tier 3 · Inmersión + adaptación

### 8 · Netflix/YouTube Subtitle Companion

- **Resultado material**: extensión Chrome opt-in. Cuando ves Netflix/YouTube, captura el subtitle DOM, marca palabras `i+1`, ofrece pausa + drill + add to deck. Convierte ocio en aprendizaje sin esfuerzo extra.
- **Ancla científica**: Refold/MIA sentence mining · Mizumoto 2024.
- **KPI**: ≥ 50 palabras `i+1` capturadas/mes desde contenido auténtico.
- **Fase**: F5+ extensión Chrome separada.
- **Coste**: €0 · +3-4 días desarrollo extensión.

### 9 · Conversational Replay · "tu peor momento, mejorado"

- **Resultado material**: cada conversation jam grabada. Claude marca los 3 turnos donde más sufriste · re-juegas ese turno con el texto correcto · retrieval practice sobre TU dolor real.
- **Ancla científica**: Roediger 2006 testing effect aplicado a producción oral · Bjork desirable difficulties.
- **KPI**: ≥ 3 replays/conversation · mejora medible en accuracy de ese tipo de turno en 2 semanas.
- **Fase**: F4.6 add-on.
- **Coste**: ~€0.05/mes.

### 10 · Cronotype-aware FSRS

- **Resultado material**: FSRS modula no solo intervalo días sino momento del día (grammar AM cognitivo · vocab PM rutinario) en función de tu cronotipo.
- **Ancla científica**: Diekelmann sleep consolidation · Mizumoto 2024 chrono-SRS.
- **KPI**: accuracy en reviews matutinas vs vespertinas converge tras 4 semanas de modulación.
- **Fase**: F5 lite (timestamps + user report) · F4 deja hooks listos.
- **Coste**: €0.

---

## Coste total mensual estimado nuevos diferenciadores

~**€0.50/mes** (Anthropic Haiku para #2 #6 #7 #9). Todo lo demás vive en cliente. CostGate P4 (>$5) NO se dispara.

## Trazabilidad

Cada implementación referencia este doc en su commit message: `feat(fase4): write→retry loop (#6 · DIFFERENTIATORS.md)`. El doc se actualiza con KPI reales tras cada fase verde.
