# Omni-Lingua

App personal para aprender inglés desde cero. Hermana de Omni-Riff en el ecosistema OMNI-MIND.

## Stack

Vite · React 19 · TypeScript · Tailwind v4 · React Router 7 · Dexie · ts-fsrs · Pitchy · Tone.js · MediaPipe · Anthropic SDK · vite-plugin-pwa · @xenova/transformers (Language Twin embeddings).

## Filosofía

- **Exocortex personal** · no curso online más. f(IA) × A(t) variety attenuation.
- **Plan adaptativo** semana a semana · no rígido (anti-Duolingo).
- **Aprendizaje activo** · producción forzada · NO consumo pasivo.
- **Honestidad sobre dificultad** · si llevas 3 semanas atascado, la app lo dice.
- **Privacy first** · audio/video del usuario nunca al backend salvo ACRCloud 15s aislados.

## Diferenciadores únicos (vs Duolingo/Babbel/Pimsleur)

1. **Language Twin** · vector único de TU inglés (errores · vocab activo · pronunciación · interferencias ES).
2. **Generative Comprehensible Input** · mini-historia 200pal diaria personalizada (Claude Haiku).
3. **Phonetic Distance Map** · heatmap IPA con accuracy por fonema (GOP wav2vec2).
4. **Honest Dashboard** · CEFR efectivo real, no aspiracional.
5. **ES↔EN Structural Pivot** · 50-80 contrastes estructurales del hispanohablante.
6. **Write→AI→Diff→Retry** · errores reales entran en FSRS.
7. **Linguistic Mirror** · "dijiste X, querías decir Y" (transferencia BPF E5-E7).
8. **Netflix Subtitle Companion** · extensión Chrome opt-in.
9. **Conversational Replay** · re-juega los 3 peores turnos.
10. **Cronotype-aware FSRS** · momento del día óptimo.

Ver [docs/DIFFERENTIATORS.md](docs/DIFFERENTIATORS.md) para detalle con ancla científica.

## Setup

```bash
npm install
npm run dev      # localhost:5173
npm run build    # TypeScript strict + Vite production build
npm run lint
```

## Modo demo

Sin API keys la app funciona al 70% (pronunciación local · vocab · FSRS · listening pairs). Para activar features IA, copiar `.env.example` a `.env.local` y rellenar.

## Coste real esperado uso personal

| Servicio | Free tier | Tras free |
|---|---|---|
| Vercel Hobby | 100GB-hour gratis | — |
| Anthropic API | $5 credit | ~€0.50/mes |
| ACRCloud | 100 IDs/mes | si excedes |
| Modal | $30 GPU credit | si excedes |
| **Total** | **€0-5/mes** | |

## Estructura

```
src/
├── app/                  # Home + Layout + routes
├── modules/              # 10 módulos navegables + assistant + twin (fundacional)
└── shared/               # audio · speech · ipa · twin · ui
api/                      # 12 Vercel functions (stubs demo + Anthropic streams)
docs/                     # DIFFERENTIATORS.md · CURRICULUM_DESIGN.md
```

Plan completo: `~/.claude/plans/users-jesusfernandezdominguez-omni-mind-robust-seahorse.md` · PROMPT original: `~/omni-mind-cerebro/docs/proyectos/omni-lingua/PROMPT.md`.
