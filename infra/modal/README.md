# Modal infra · Whisper + GOP

Apps Modal opcionales para activar:
- **whisper.py** · Whisper small.en transcripción · alimenta `/api/transcribe`
- **gop.py** · wav2vec2 GOP proxy · alimenta `/api/assess-pronunciation`

## Deploy

```bash
pip install modal
modal token new  # autenticación primera vez
modal deploy infra/modal/whisper.py
modal deploy infra/modal/gop.py
```

Cada `deploy` imprime una URL · añadirla a Vercel:

```bash
echo "https://gurufe--omni-lingua-whisper-transcriber-transcribe.modal.run" | vercel env add MODAL_TRANSCRIBE_ENDPOINT production
echo "https://gurufe--omni-lingua-gop-gopscorer-score.modal.run" | vercel env add MODAL_GOP_ENDPOINT production
```

## Coste estimado

Modal free tier: $30 GPU credit/mes. T4 GPU es ~$0.59/h. Uso personal estimado:
- Whisper · ~3s por transcripción · 50 transcripciones/mes = 2.5 min GPU = €0.05
- GOP · ~2s por fonema · 200 fonemas/mes = 7 min GPU = €0.10

**Total estimado**: €0.15/mes · muy por debajo del free credit.

## Cuándo activar

Cuando vayas a usar realmente:
- Módulo Shazam de inglés (`/content-id`) con audios reales
- Módulo Performance (`/performance`) con grabaciones que merezcan GOP científico

Mientras no uses esos módulos pesadamente, el fallback ASR cliente (Web Speech) + Levenshtein
en `Pronunciation` ya cubre el 80% de necesidades reales.
