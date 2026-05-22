"""
Modal GOP (Goodness of Pronunciation) app · wav2vec2 phoneme-level scoring.

Diferenciador #3 · Phonetic Distance Map verdadero (no Levenshtein placeholder).

Usage:
  pip install modal
  modal deploy infra/modal/gop.py

Devuelve endpoint URL · añadirlo a Vercel env como MODAL_GOP_ENDPOINT.

Coste: similar a Whisper · GPU T4 · scale to zero.

NOTA: implementación SIMPLIFICADA · usa wav2vec2 base + confidence-as-GOP-proxy.
Para GOP científico estricto (Witt 2000) se necesita force-alignment con MFA.
"""

import modal

app = modal.App("omni-lingua-gop")

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "transformers==4.44.0",
        "torch==2.2.0",
        "torchaudio==2.2.0",
        "soundfile==0.12.1",
        "fastapi[standard]==0.115.0",
    )
    .apt_install("ffmpeg")
)

with image.imports():
    import torch
    import torchaudio
    from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
    import io


@app.cls(image=image, gpu="T4", scaledown_window=120)
class GopScorer:
    processor = None
    model = None

    @modal.enter()
    def load(self):
        model_name = "facebook/wav2vec2-base-960h"
        self.processor = Wav2Vec2Processor.from_pretrained(model_name)
        self.model = Wav2Vec2ForCTC.from_pretrained(model_name)
        if torch.cuda.is_available():
            self.model = self.model.to("cuda")
        self.model.eval()

    @modal.fastapi_endpoint(method="POST")
    async def score(self, audio: bytes = modal.fastapi.File(...), target_phoneme: str = ""):
        if not self.model or not self.processor:
            return {"error": "model_not_loaded"}
        try:
            wav, sr = torchaudio.load(io.BytesIO(audio))
            if sr != 16000:
                wav = torchaudio.functional.resample(wav, sr, 16000)
            wav = wav.mean(dim=0)  # mono

            inputs = self.processor(wav.numpy(), sampling_rate=16000, return_tensors="pt")
            if torch.cuda.is_available():
                inputs = {k: v.to("cuda") for k, v in inputs.items()}

            with torch.no_grad():
                logits = self.model(**inputs).logits

            # GOP proxy: max softmax prob per frame promediado
            probs = torch.softmax(logits, dim=-1)
            max_probs = probs.max(dim=-1).values
            gop_score = float(max_probs.mean().cpu().item())

            # Decoded transcript para verificar
            predicted_ids = logits.argmax(dim=-1)
            transcript = self.processor.batch_decode(predicted_ids)[0]

            return {
                "gop_score": gop_score,
                "transcript": transcript.lower(),
                "target_phoneme": target_phoneme,
                "model": "wav2vec2-base-960h",
                "note": "GOP proxy via confidence · para GOP estricto necesita MFA alignment",
            }
        except Exception as e:
            return {"error": "gop_failed", "detail": str(e)}
